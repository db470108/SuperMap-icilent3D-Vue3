<script setup>
import { ref } from 'vue';
import { ElMenu, ElMenuItem, ElSubMenu, ElCol, ElRow } from 'element-plus';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

  // 控制菜单展开/收起状态
  const isCollapse = ref(true);
  // 控制菜单是否可见
  const isMenuVisible = ref(false);

  // 切换菜单状态
  function toggleMenu() {
    if (!isMenuVisible.value) {
      // 如果菜单不可见，先显示菜单再展开
      isMenuVisible.value = true;
      // 使用nextTick确保DOM更新后再展开菜单
      setTimeout(() => {
        isCollapse.value = false;
      }, 0);
    } else {
      // 如果菜单可见，则先收起再隐藏
      isCollapse.value = true;
      setTimeout(() => {
        isMenuVisible.value = false;
      }, 300);
    }
  }



  // 视角控制
  const SuperMap3D = window.SuperMap3D;

  function resetView() {
    viewer.camera.flyTo({
      destination: SuperMap3D.Cartesian3.fromDegrees(114.29, 30.53, 3000), // 武汉中心点
      orientation: {
        heading: SuperMap3D.Math.toRadians(0),
        pitch: SuperMap3D.Math.toRadians(-30), // 朝下看 45°
        roll: 0
      },
      duration: 3
    });
  }

  function topView() {
    viewer.camera.flyTo({
      destination: SuperMap3D.Cartesian3.fromDegrees(114.29, 30.59, 30000), // 武汉中心点
      orientation: {
        heading: SuperMap3D.Math.toRadians(0),
        pitch: SuperMap3D.Math.toRadians(-90), // 朝下看 45°
        roll: 0
      },
      duration: 3
    });
  }



  // 图层管理
  const showBuildings = ref(true);
  const showWater = ref(true);
  const showRoads = ref(true);
  const showRailways = ref(true);



  function changeBuildingsVisibility() {
    emit('toggle-buildingsLayer', showBuildings.value);
  }

  function changeWaterVisibility() {
    emit('toggle-waterLayer', showWater.value);
  }

  function changeRoadsVisibility() {
    emit('toggle-roadsLayer', showRoads.value);
  }

  function changeRailwaysVisibility() {
    emit('toggle-railwaysLayer', showRailways.value);
  }



  // 切换天气和时间
  // 默认为白天
  const skyBoxMode = ref('day');
  // 切换白天或夜晚
  function changeDayOrNight() {
    emit('changeDayOrNight', skyBoxMode.value);
  }

  // 默认为晴天
  const weatherMode = ref('clear');
  // 切换天气
  function changeWeatherMode() {
    emit('changeWeatherMode', weatherMode.value);
  }



  // 要向父组件发送的事件
  const emit = defineEmits([
    'toggle-buildingsLayer',
    'toggle-waterLayer',
    'toggle-roadsLayer',
    'toggle-railwaysLayer',
    'changeDayOrNight',
    'changeWeatherMode'
  ]);

</script>

<template>
  <div class="left-menu-wrapper">
    <!-- 菜单切换按钮 -->
    <div class="menu-toggle-btn" @click="toggleMenu">
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
            <el-menu
                default-active="2"
                class="el-menu"
                mode="vertical"
                :collapse="isCollapse"
                background-color="rgba(5, 10, 25, 0.7)"
                text-color="#f3f3f3"
                active-text-color="rgba(51, 153, 255, 0.8)"
            >
              <el-sub-menu index="1">
                <template #title>
                  <font-awesome-icon icon="eye"/>&nbsp;视角控制
                </template>
                <el-menu-item index="1-1" @click="resetView">默认视角</el-menu-item>
                <el-menu-item index="1-2" @click="topView">垂直俯视</el-menu-item>
              </el-sub-menu>

              <el-sub-menu index="2">
                <template #title>
                  <font-awesome-icon icon="layer-group"/>&nbsp;图层管理
                </template>
                <el-menu-item index="2-1">
                  <el-checkbox label="建筑图层" v-model="showBuildings" @change="changeBuildingsVisibility"/>
                </el-menu-item>

                <el-menu-item index="2-2">
                  <el-checkbox label="水系图层" v-model="showWater" @change="changeWaterVisibility"/>
                </el-menu-item>

                <el-menu-item index="2-3">
                  <el-checkbox label="公路图层" v-model="showRoads" @change="changeRoadsVisibility"/>
                </el-menu-item>

                <el-menu-item index="2-4">
                  <el-checkbox label="铁路图层" v-model="showRailways" @change="changeRailwaysVisibility"/>
                </el-menu-item>
              </el-sub-menu>

              <el-sub-menu index="3">
                <template #title>
                  <font-awesome-icon icon="cloud"/>&nbsp;场景设置
                </template>

                <el-sub-menu index="3-1">
                  <template #title>
                    天气设置
                  </template>
                  <el-menu-item index="3-1-1">
                    <el-radio value="clear" v-model="weatherMode" @change="changeWeatherMode">
                      晴天
                    </el-radio>
                  </el-menu-item>

                  <el-menu-item index="3-1-2">
                    <el-radio value="rain" v-model="weatherMode" @change="changeWeatherMode">
                      雨天
                    </el-radio>
                  </el-menu-item>

                  <el-menu-item index="3-1-3">
                    <el-radio value="snow" v-model="weatherMode" @change="changeWeatherMode">
                      雪天
                    </el-radio>
                  </el-menu-item>
                </el-sub-menu>

                <el-sub-menu index="3-2">
                  <template #title>
                    时间设置
                  </template>

                  <el-menu-item index="3-2-1">
                    <el-radio value="day" v-model="skyBoxMode" @change="changeDayOrNight">
                      白天
                    </el-radio>
                  </el-menu-item>

                  <el-menu-item index="3-2-2">
                    <el-radio value="sunset" v-model="skyBoxMode" @change="changeDayOrNight">
                      傍晚
                    </el-radio>
                  </el-menu-item>

                  <el-menu-item index="3-2-3">
                    <el-radio value="night" v-model="skyBoxMode" @change="changeDayOrNight">
                      夜晚
                    </el-radio>
                  </el-menu-item>
                </el-sub-menu>

              </el-sub-menu>
            </el-menu>
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
  top: 3px;
  left: 10px;
  width: 35px;
  height: 35px;
  background: rgba(5, 10, 25, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(51, 102, 204, 0.3);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 20px;
  z-index: 1001; /* 确保按钮在BannerBar之上 */
}

.menu-toggle-btn:hover {
  border-color: rgba(51, 102, 204, 0.6);
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
  background: rgba(5, 10, 25, 0.6); /* 深蓝毛玻璃 */
  border-bottom: 1px solid rgba(51, 102, 204, 0.3);
}

/* 菜单项样式优化 */
:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background-color: rgba(51, 153, 255, 0.5);
}
</style>