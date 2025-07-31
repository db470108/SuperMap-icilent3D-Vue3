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
            :show-sky-box="showSkyBox"
            :sky-box-mode="skyBoxMode"
            :weather-mode="weatherMode"
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
            @changeSkyBox="handleChangeSkyBox"
            @changeDayOrNight="handleChangeDayOrNight"
            @changeWeatherMode="handleChangeWeatherMode"
            @logout="logout"
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
        <Search @fly-to-building="handleFlyToBuilding"/>
      </div>

    </div>
</template>

<script setup>
  import BannerBar from "@/components/BannerBar.vue";
  import SceneViewer3D from "@/components/SceneViewer3D.vue";
  import {ref, onMounted} from "vue";
  import TimeDisplay from "@/components/TimeDisplay.vue";
  import FullScreen from "@/components/FullScreen.vue";
  import BuildingInfoWindow from "@/components/BuildingInfoWindow.vue";
  import Search from "@/components/Search.vue";
  import LeftMenu from "@/layouts/LeftMenu.vue";
  import {useRouter} from "vue-router";

  // 获取用户信息
  const user = ref(null);
  const userType = ref('citizen'); // 默认为市民

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
  const showSkyBox = ref(true);
  const skyBoxMode = ref("day");
  const weatherMode = ref("clear");
  function handleChangeSkyBox(val) {
    showSkyBox.value = val;
  }

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
    isBuildingInfoWindowOpen.value = true;
  }

  function handleClose() {
    selectedBuilding.value = null;
    isBuildingInfoWindowOpen.value = false;
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