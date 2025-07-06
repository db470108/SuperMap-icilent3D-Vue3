<template>
    <div class="platform-page">

      <!-- 主窗口，动态加载当前地图组件 -->
      <div class="main-container" id="main-container">
        <SceneViewer3D/>
      </div>

      <!-- 上层的横幅和按钮 -->
      <BannerBar @selectMap="handleSelectMap"/>

    </div>
</template>

<script setup>
  import BannerBar from "@/components/BannerBar.vue";
  import SceneViewer3D from "@/components/SceneViewer3D.vue";
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