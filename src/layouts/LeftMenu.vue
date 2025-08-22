<script setup>
import {ref, computed, nextTick, watch} from 'vue';
import { ElMenu, ElMenuItem, ElSubMenu, ElCol, ElRow } from 'element-plus';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {usePanelStore} from "@/store/panel.js";
import {useRouter} from "vue-router";
import {usePageStore} from "@/store/page.js";
import {useUserStore} from "@/store/user.js";

  const panelStore = usePanelStore();
  const pageStore = usePageStore();
  const userStore = useUserStore();
  const router = useRouter();

  // 接收用户类型和用户信息
  const props = defineProps({
    user: {
      type: Object,
      default: null
    }
  });

  const emit = defineEmits([
    'toggle-buildingsLayer',
    'toggle-waterLayer',
    'changeSkyBox',
    'changeDayOrNight',
    'changeWeatherMode',
    'logout',
    'changeSearchMode',
    'closeInfoWindow'
  ]);

  //根据用户类型显示不同主题
  const themeType = ref([
    {backgroundColor: '', textColor: ''}
  ]);
  watch(() => userStore.currentUser, (newType) => {
    if (newType === 'admin') {
      themeType.value.backgroundColor = 'rgba(5, 10, 25, 0.7)';
      themeType.value.textColor = '#f4f0f0';
    } else if (newType === 'citizen') {
      themeType.value.textColor = 'black';
      themeType.value.backgroundColor = 'rgba(244, 240, 240, 0.85)';
    }
  }, {immediate: true});


  // 控制菜单展开/收起状态
  const isCollapse = ref(true);
  // 控制菜单是否可见
  const isMenuVisible = ref(false);
  // 控制菜单按钮是否禁用
  const isMenuBtnDisabled = ref(false);

  // 切换菜单状态
  function toggleMenu() {
    if (!isMenuVisible.value) {
      // 如果菜单不可见，先显示菜单再展开
      isMenuVisible.value = true;
      // 使用nextTick确保DOM更新后再展开菜单
      nextTick(() => {
        isCollapse.value = false;
      })
    } else {
      // 如果菜单可见，则先收起再隐藏
      isCollapse.value = true;
      setTimeout(() => {
        isMenuVisible.value = false;
      }, 300);
    }
  }

  // 退出登录
  function handleLogout() {
    emit('logout');
  }

  // 视角控制
  const SuperMap3D = window.SuperMap3D;

  function View3D() {
    viewer.camera.flyTo({
      destination: SuperMap3D.Cartesian3.fromDegrees(114.29, 30.51, 2000), // 武汉中心点
      orientation: {
        heading: SuperMap3D.Math.toRadians(0),
        pitch: SuperMap3D.Math.toRadians(-10),
        roll: 0
      },
      duration: 3
    });
  }

  function View2D() {
    viewer.camera.flyTo({
      destination: SuperMap3D.Cartesian3.fromDegrees(114.29, 30.59, 30000), // 武汉中心点
      orientation: {
        heading: SuperMap3D.Math.toRadians(0),
        pitch: SuperMap3D.Math.toRadians(-90),
        roll: 0
      },
      duration: 3
    });
  }

  // 图层管理
  const showBuildings = ref(true);
  const showWater = ref(true);

  function changeBuildingsVisibility() {
    emit('toggle-buildingsLayer', showBuildings.value);
  }

  function changeWaterVisibility() {
    emit('toggle-waterLayer', showWater.value);
  }


  // 切换天气和时间
  // 默认为自动模式
  const skyBoxMode = ref('auto'); // 'auto', 'day', 'night', 'sunset'
  // 切换白天或夜晚
  function changeDayOrNight() {
    emit('changeDayOrNight', skyBoxMode.value);
  }

  // 默认为晴天
  const weatherMode = ref('auto'); // 'auto', 'clear', 'rain', 'snow'
  // 切换天气
  function changeWeatherMode() {
    emit('changeWeatherMode', weatherMode.value);
  }

  // 基础设置（市民用户）
  const showSkyBox = ref(true);
  function changeSkyBox() {
    emit('changeSkyBox', showSkyBox.value);
  }

  // 检查用户是否已登录的计算属性
  const isLoggedIn = computed(() => {
    return props.user && props.user.loggedIn === true;
  });



  // 搜索模式
  let searchMode = ref('');

  function changeSearchMode() {
    panelStore.togglePanel(searchMode.value);
    console.log("当前打开的面板为：", panelStore.activePanel);
    emit('changeSearchMode', searchMode.value);
    console.log("当前搜索模式为：", searchMode.value)
    emit('closeInfoWindow')
  }

  watch(() => panelStore.activePanel, (newValue) => {
    if (newValue !== 'keyWordSearch' && newValue !== 'doubleClickSearch') {
      searchMode.value = null;
    }
  })

  // 打开高德地图
  function openPage(page) {
    pageStore.togglePage(page);
    // 关闭其他模块
    panelStore.closePanel();
    // 收起菜单
    isCollapse.value = true;
    isMenuVisible.value = false;
  }
  // 实时监听菜单按钮是否可用
  watch(() => pageStore.activePage, (newValue) => {
    isMenuBtnDisabled.value = newValue !== 'scene-viewer-3d';
  })


  // 打开酒店周边POI板块
  function openPanel(panel) {
    panelStore.togglePanel(panel);
    console.log("当前打开的面板为：", panelStore.activePanel);
  }

  // 打开走进武汉网站
  function knowMoreAboutWuhan() {
    window.open('https://www.wuhan.gov.cn/zjwh/', '_blank');
  }

  // 打开gdp大屏
  function openBigScreen() {
    window.open('https://ai.goviewlink.com/chart/preview/cmehalatv00dd5yv03a60tfzm', '_blank');
  }
</script>

<template>
  <div class="left-menu-wrapper">
    <!-- 菜单切换按钮 -->
    <div class="menu-toggle-btn" @click="!isMenuBtnDisabled && toggleMenu()" v-show="pageStore.activePage === 'scene-viewer-3d'">
      <span v-if="isCollapse"><font-awesome-icon icon="fa-solid fa-bars" /></span>
      <span v-else><font-awesome-icon icon="fa-solid fa-xmark" /></span>
    </div>

    <!-- 侧边菜单 -->
      <div
          class="side-menu"
          :class="{ 'collapsed': isCollapse }"
          v-show="isMenuVisible"
      >
        <el-row class="el-row">
          <el-col :span="24">
            <el-scrollbar style="height: 100%">

              <el-menu
                  default-active="1"
                  class="el-menu"
                  mode="vertical"
                  :collapse="isCollapse"
                  :background-color="themeType.backgroundColor"
                  :text-color="themeType.textColor"
                  active-text-color="rgba(51, 153, 255, 0.8)"
              >
                <!-- 用户信息区域 -->
                <el-sub-menu index="0" v-if="isLoggedIn">
                  <template #title>
                    <font-awesome-icon icon="user"/>&nbsp;用户管理
                  </template>
                  <el-menu-item index="0-1" disabled>
                  <span class="user-name" v-if="userStore.currentUser === 'admin'">
                    管理员
                  </span>
                    <span class="user-name" v-else>
                    市民
                  </span>
                  </el-menu-item>
                  <el-menu-item index="0-2" @click="handleLogout">
                    <font-awesome-icon icon="right-from-bracket"/>&nbsp;退出登录
                  </el-menu-item>
                </el-sub-menu>

                <el-sub-menu index="1">
                  <template #title>
                    <font-awesome-icon icon="eye"/>&nbsp;视角控制
                  </template>
                  <el-menu-item index="1-1" @click="View3D">三维视角</el-menu-item>
                  <el-menu-item index="1-2" @click="View2D">二维视角</el-menu-item>
                </el-sub-menu>

                <!-- 图层管理对行政人员可见 -->
                <el-sub-menu index="2" v-if="userStore.currentUser === 'admin'">
                  <template #title>
                    <font-awesome-icon icon="layer-group"/>&nbsp;图层管理
                  </template>
                  <el-menu-item index="2-1">
                    <el-checkbox label="三维建筑图层" v-model="showBuildings" @change="changeBuildingsVisibility"/>
                  </el-menu-item>

                  <el-menu-item index="2-2">
                    <el-checkbox label="水系图层" v-model="showWater" @change="changeWaterVisibility"/>
                  </el-menu-item>

                </el-sub-menu>

                <!-- 场景设置对所有用户可见 -->
                <el-sub-menu index="3">
                  <template #title>
                    <font-awesome-icon icon="cloud"/>&nbsp;场景设置
                  </template>

                  <el-sub-menu index="3-1">
                    <template #title>
                      天气设置
                    </template>

                    <el-menu-item index="3-1-0">
                      <el-radio value="auto" v-model="weatherMode" @change="changeWeatherMode">
                        自动
                      </el-radio>
                    </el-menu-item>

                    <el-menu-item index="3-1-1" v-if="userStore.currentUser === 'admin'">
                      <el-radio value="clear" v-model="weatherMode" @change="changeWeatherMode">
                        晴天
                      </el-radio>
                    </el-menu-item>

                    <el-menu-item index="3-1-2" v-if="userStore.currentUser === 'admin'">
                      <el-radio value="rain" v-model="weatherMode" @change="changeWeatherMode">
                        雨天
                      </el-radio>
                    </el-menu-item>

                    <el-menu-item index="3-1-3" v-if="userStore.currentUser === 'admin'">
                      <el-radio value="snow" v-model="weatherMode" @change="changeWeatherMode">
                        雪天
                      </el-radio>
                    </el-menu-item>
                  </el-sub-menu>

                  <el-sub-menu index="3-2">
                    <template #title>
                      时间设置
                    </template>

                    <el-menu-item index="3-2-0">
                      <el-radio value="auto" v-model="skyBoxMode" @change="changeDayOrNight">
                        自动
                      </el-radio>
                    </el-menu-item>

                    <el-menu-item index="3-2-1" v-if="userStore.currentUser === 'admin'">
                      <el-radio value="day" v-model="skyBoxMode" @change="changeDayOrNight">
                        白天
                      </el-radio>
                    </el-menu-item>

                    <el-menu-item index="3-2-2" v-if="userStore.currentUser === 'admin'">
                      <el-radio value="sunset" v-model="skyBoxMode" @change="changeDayOrNight">
                        傍晚
                      </el-radio>
                    </el-menu-item>

                    <el-menu-item index="3-2-3" v-if="userStore.currentUser === 'admin'">
                      <el-radio value="night" v-model="skyBoxMode" @change="changeDayOrNight">
                        夜晚
                      </el-radio>
                    </el-menu-item>
                  </el-sub-menu>
                </el-sub-menu>

                <el-sub-menu index="4">
                  <template #title>
                    <font-awesome-icon icon="search"/>&nbsp;地物查询
                  </template>

                  <el-menu-item index="4-1">
                    <el-radio value="keyWordSearch" v-model="searchMode" @change="changeSearchMode">
                      关键字搜索
                    </el-radio>
                  </el-menu-item>

                  <el-menu-item index="4-2">
                    <el-radio value="doubleClickSearch" v-model="searchMode" @change="changeSearchMode">
                      双击查询
                    </el-radio>
                  </el-menu-item>
                </el-sub-menu>

                <el-sub-menu index="5">
                  <template #title>
                    <font-awesome-icon icon="people-group"/>&nbsp;便民服务
                  </template>

                  <el-menu-item index="5-1" @click="openPanel('weather')">
                    <font-awesome-icon icon="cloud"/>&nbsp;天气预报
                  </el-menu-item>

                  <el-menu-item index="5-2" @click="openPage('amap')">
                    <font-awesome-icon icon="location-arrow"/>&nbsp;出行导航
                  </el-menu-item>

                  <el-menu-item index="5-3" @click="openPanel('houseRenting')">
                    <font-awesome-icon icon="house"/>&nbsp;租房中心
                  </el-menu-item>

                </el-sub-menu>

                <el-sub-menu index="6">
                  <template #title>
                    <font-awesome-icon icon="bridge"/>&nbsp;武汉通
                  </template>

                  <el-menu-item index="6-1" @click="openPanel('poiAroundHotel')">
                    <font-awesome-icon icon="hotel"/>&nbsp;酒店附近地点查询
                  </el-menu-item>

                  <el-menu-item index="6-2" @click="knowMoreAboutWuhan">
                    <font-awesome-icon icon="map-location-dot"/>&nbsp;走进武汉
                  </el-menu-item>
                </el-sub-menu>

                <el-menu-item index="7" v-if="userStore.currentUser === 'admin'" @click="openBigScreen">
                  <font-awesome-icon icon="coins"/> &nbsp;武汉经济数据大屏
                </el-menu-item>

              </el-menu>

            </el-scrollbar>

          </el-col>
        </el-row>
      </div>

  </div>
</template>

<style scoped>
.left-menu-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 2000; /* 降低z-index，使其低于BannerBar */
}

.menu-toggle-btn {
  position: absolute;
  top: 4px;
  left: 10px;
  width: 30px;
  height: 30px;
  backdrop-filter: blur(12px);
  border: 1.5px solid rgba(54, 171, 243, 0.84);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  z-index: 1001; /* 确保按钮在BannerBar之上 */
}

.menu-toggle-btn:hover {
  cursor: pointer;
  box-shadow: 0 0 10px rgba(54, 171, 243, 0.84);
  transition: all 0.3s ease-in-out;
  transform: scale(1.05);
}

.side-menu {
  transition: all 0.3s;
  position: absolute;
  top: 45px; /* 从BannerBar下方开始 */
  width: 180px;
  opacity: 1;
  height: calc(100vh - 45px); /* 高度减去BannerBar的高度 */
}

.side-menu.collapsed {
  width: auto;
  opacity: 0;
}

.side-menu:not(.collapsed) {
  width: 180px;
  opacity: 1;
}

.el-row {
  height: calc(100vh - 45px); /* 高度减去BannerBar的高度 */
  margin: 0;
  user-select: none;
}

.el-menu {
  height: calc(100vh - 45px); /* 高度减去BannerBar的高度 */
  border: none;
  border-right: 1px solid rgba(51, 102, 204, 0.3);
  transition: all 0.3s ease;
  backdrop-filter: blur(12px);
  /*background: rgba(5, 10, 25, 0.6); !* 深蓝毛玻璃 *!*/
  border-bottom: 1px solid rgba(51, 102, 204, 0.3);
}

/* 菜单项样式优化 */
:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background-color: rgba(51, 153, 255, 0.5);
}

.user-name {
  font-weight: bold;
  color: #009eff;
  font-size: 18px;
}
</style>