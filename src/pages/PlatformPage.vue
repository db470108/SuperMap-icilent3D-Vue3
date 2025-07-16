<template>
    <div class="platform-page">

      <!-- 主窗口，动态加载当前地图组件 -->
      <div class="main-container" id="main-container">
        <!-- 图层加载 -->
        <SceneViewer3D
            :show-buildings="showBuildings"
            :show-water="showWater"
            :show-roads="showRoads"
            :show-railways="showRailways"
        />

        <!-- 上层的横幅和按钮 -->
        <BannerBar/>

        <!-- 视角控制 -->
        <ViewControl/>

        <!-- 图层管理 -->
        <LayerControl
            @toggle-buildingsLayer="handleChangeBuildingsVisibility"
            @toggle-waterLayer="handleChangeWaterVisibility"
            @toggle-roadsLayer="handleChangeRoadsVisibility"
            @toggle-railwaysLayer="handleChangeRailwaysVisibility"
        />
      </div>

    </div>
</template>

<script setup>
  import BannerBar from "@/components/BannerBar.vue";
  import ViewControl from "@/components/ViewControl.vue";
  import LayerControl from "@/components/LayerControl.vue";
  import SceneViewer3D from "@/components/SceneViewer3D.vue";
  import {ref} from "vue";

  const showBuildings = ref(true);
  const showWater = ref(true);
  const showRoads = ref(true);
  const showRailways = ref(true);

  function handleChangeBuildingsVisibility(val) {
    showBuildings.value = val;
    console.log("是否显示建筑物：", val);
  }
  function handleChangeWaterVisibility(val) {
    showWater.value = val;
    console.log("是否显示水体：", val);
  }
  function handleChangeRoadsVisibility(val) {
    showRoads.value = val;
    console.log("是否显示公路：", val);
  }
  function handleChangeRailwaysVisibility(val) {
    showRailways.value = val;
    console.log("是否显示铁路：", val);
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