<template>
    <div class="platform-page">

      <!-- 主窗口，动态加载当前地图组件 -->
      <div class="main-container">
        <RasterMapViewer v-if="currentMap === 'raster'"/>
        <SceneViewer3D v-else-if="currentMap === 'scene3D'"/>
        <VectorMapViewer v-else-if="currentMap === 'vector'"/>
<!--        <SceneViewer3D/>-->
<!--        <RasterMapViewer/>-->
      </div>

      <!-- 上层的横幅和按钮 -->
      <BannerBar @selectMap="handleSelectMap"/>
    </div>
</template>

<script setup>
  import BannerBar from "@/components/BannerBar.vue";
  import SceneViewer3D from "@/components/SceneViewer3D.vue";
  import RasterMapViewer from "@/components/RasterMapViewer.vue";
  import {onMounted, ref} from "vue";
  import VectorMapViewer from "@/components/VectorMapViewer.vue";

  // 默认地图为栅格
   const currentMap = ref('raster');

  function handleSelectMap(type) {
     currentMap.value = type;
     console.log(type)
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