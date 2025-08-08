<template>
    <div class="platform-page">

<!--       主窗口，动态加载当前地图组件 -->
      <div class="main-container" id="main-container">
<!--         图层加载 -->
        <SceneViewer3D
            ref="sceneViewer3DRef"
            :show-buildings="showBuildings"
            :show-water="showWater"
            :show-roads="showRoads"
            :show-railways="showRailways"
            :sky-box-mode="skyBoxMode"
            :weather-mode="weatherMode"
            :search-mode="searchMode"
            @select-building="handleSelectBuilding"
        />

<!--       侧边菜单 -->
        <LeftMenu
            :user-type="userType"
            :user="user"
            @toggle-buildingsLayer="handleChangeBuildingsVisibility"
            @toggle-waterLayer="handleChangeWaterVisibility"
            @toggle-roadsLayer="handleChangeRoadsVisibility"
            @toggle-railwaysLayer="handleChangeRailwaysVisibility"
            @changeDayOrNight="handleChangeDayOrNight"
            @changeWeatherMode="handleChangeWeatherMode"
            @changeSearchMode="handleChangeSearchMode"
            @logout="logout"
            @closeInfoWindow="handleClose"
        />

<!--         上层的横幅和按钮 -->
        <BannerBar/>

<!--         时间显示 -->
        <TimeDisplay/>

<!--         全屏按钮 -->
        <FullScreen/>

<!--         弹窗组件 -->
        <BuildingInfoWindow
            v-if="selectedBuilding"
            :building="selectedBuilding"
            @close="handleClose"
        />

<!--         搜索框 -->
        <Search
            @fly-to-building="handleFlyToBuilding"
            @close="handleClose"
        />

<!--         天气显示 -->
        <WeatherDisplay />

<!--        酒店附近POI检索-->
        <POIAroundHotel
            @flyToHotel="handleFlyToBuilding"
            @flyToPOI="handleFlyToBuilding"
        />
      </div>

    </div>
</template>

<script setup>
  import BannerBar from "@/components/BannerBar.vue";
  import SceneViewer3D from "@/components/SceneViewer3D.vue";
  import {ref, onMounted, onUnmounted} from "vue";
  import TimeDisplay from "@/components/TimeDisplay.vue";
  import FullScreen from "@/components/FullScreen.vue";
  import BuildingInfoWindow from "@/components/BuildingInfoWindow.vue";
  import Search from "@/components/Search.vue";
  import LeftMenu from "@/layouts/LeftMenu.vue";
  import WeatherDisplay from "@/components/WeatherDisplay.vue";
  import {useRouter} from "vue-router";
  import POIAroundHotel from "@/components/POIAroundHotel.vue";
  import {usePanelStore} from "@/store/panel.js";

  // 获取用户信息
  const user = ref(null);
  const userType = ref('citizen'); // 默认为市民

  // 获取当前板块
  const panelStore = usePanelStore()

  onMounted(() => {
    // 从localStorage获取用户信息
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.loggedIn) {
      user.value = userData;
      userType.value = userData.type;
    } else {
      // 如果没有有效的用户信息，重定向到登录页
      router.push('/welcome');
    }

    // 监听天气更新事件
    window.addEventListener('weatherUpdate', handleWeatherUpdate);
  });

  onUnmounted(() => {
    // 移除事件监听
    window.removeEventListener('weatherUpdate', handleWeatherUpdate);
  });

  const router = useRouter();

  // 退出登录
  function logout() {
    // 清除用户信息
    localStorage.removeItem('user');
    // 清空用户状态
    user.value = null;
    userType.value = 'citizen';
    // 跳转到欢迎页面
    router.push('/welcome');
  }

  // 图层管理
  const showBuildings = ref(true);
  const showWater = ref(true);
  const showRoads = ref(true);
  const showRailways = ref(true);

  function handleChangeBuildingsVisibility(val) {
    showBuildings.value = val;
  }
  function handleChangeWaterVisibility(val) {
    showWater.value = val;
  }
  function handleChangeRoadsVisibility(val) {
    showRoads.value = val;
  }
  function handleChangeRailwaysVisibility(val) {
    showRailways.value = val;
  }

  // 场景设置
  const skyBoxMode = ref("auto"); // 默认为自动模式
  const weatherMode = ref("auto"); // 默认为自动模式

  function handleChangeDayOrNight(val) {
    skyBoxMode.value = val;
  }

  function handleChangeWeatherMode(val) {
    weatherMode.value = val;
  }

  // 建筑物信息弹窗
  const selectedBuilding = ref(null);

  // 弹窗状态
  const isBuildingInfoWindowOpen = ref(false);

  function handleSelectBuilding(building) {
    console.log("接收到建筑信息:", building); // 调试输出
    selectedBuilding.value = building;
    // 根据当前搜索模式设置面板状态
    if (searchMode.value === 'doubleClickSearch' || searchMode.value === 'keyWordSearch') {
      isBuildingInfoWindowOpen.value = true;
    }
  }

  function handleClose() {
    selectedBuilding.value = null;
    isBuildingInfoWindowOpen.value = false;
    const buildingsLayer = viewer.scene.layers.find('buildings_3D');
    if (buildingsLayer) {
      buildingsLayer.setSelection([]); // 清除所有选中
    }
  }

  // 添加SceneViewer3D的引用
  const sceneViewer3DRef = ref(null);
  // 处理点击后飞向建筑物
  function handleFlyToBuilding(building) {
    if (sceneViewer3DRef.value) {
      sceneViewer3DRef.value.flyToBuilding(building);
      console.log("点击了")
    }
  }

  // 处理天气更新
  function handleWeatherUpdate(event) {
    const { weather } = event.detail;

    // 根据天气自动调整场景
    if (weather.includes('雨')) {
      weatherMode.value = 'rain';
    } else if (weather.includes('雪')) {
      weatherMode.value = 'snow';
    } else {
      weatherMode.value = 'clear';
    }

    // 如果是晴天，可以考虑根据时间调整天空盒
    if (weather.includes('晴')) {
      skyBoxMode.value = 'auto'; // 使用自动模式，根据时间切换
    }
  }

  // 处理搜索模式切换
  const searchMode = ref('');
  function handleChangeSearchMode(mode) {
    searchMode.value = mode;
  }
</script>

<style scoped>
.platform-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: 'Segoe UI', sans-serif;
}

  /* 主容器 */
  .main-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
  }
</style>