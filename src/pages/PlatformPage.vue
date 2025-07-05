<template>
    <div class="platform-page">

      <!-- 主窗口，动态加载当前地图组件 -->
      <div class="main-container" id="main-container">
      </div>

      <!-- 上层的横幅和按钮 -->
      <BannerBar @selectMap="handleSelectMap"/>
    </div>
</template>

<script setup>
  import BannerBar from "@/components/BannerBar.vue";
  import {onMounted, ref} from "vue";

  const SuperMap3D = window.SuperMap3D;
  let viewer;

  // 图层
  let rasterImagery;
  let labelImagery;
  let vectorImagery;

  // 用于控制地图图层显示或隐藏的变量
  let showRaster = ref(true);
  let showLabel = ref(true);
  let showVector = ref(false);

  onMounted(()=>{
      viewer = new SuperMap3D.Viewer('main-container', {
      useWebGPU: true,
    });
    window.viewer = viewer;

    // 添加天地图栅格影像
    rasterImagery = viewer.imageryLayers.addImageryProvider(new SuperMap3D.TiandituImageryProvider({
      mapStyle: SuperMap3D.TiandituMapsStyle.IMG_C,
      token: 'e1e9885949008a7d38002cf78ac67918',
    }));

    // 添加天地图矢量地图
    vectorImagery = viewer.imageryLayers.addImageryProvider(new SuperMap3D.TiandituImageryProvider({
      mapStyle: SuperMap3D.TiandituMapsStyle.VEC_C,
      token: 'e1e9885949008a7d38002cf78ac67918'
    }));

    // 添加中文注记
    labelImagery = viewer.imageryLayers.addImageryProvider(new SuperMap3D.TiandituImageryProvider({
      mapStyle: SuperMap3D.TiandituMapsStyle.CTA_C,
      token: 'e1e9885949008a7d38002cf78ac67918'
    }));

    // 影像加载后设置视角（跳转到武汉）
    viewer.scene.camera.flyTo({
      destination: SuperMap3D.Cartesian3.fromDegrees(114.3, 30.7, 300000), // 武汉市中心，海拔约20km
      orientation: {
        heading: SuperMap3D.Math.toRadians(0.0),    // 朝北
        pitch: SuperMap3D.Math.toRadians(-90.0),    // 向下俯视
        roll: 0.0
      }
    });

    // 刚挂载时，默认加载栅格影像和文字注记
    rasterImagery.show = showRaster.value;
    labelImagery.show = showLabel.value;
    vectorImagery.show = showVector.value;

  })

  function handleSelectMap(type) {
    console.log(type)
    rasterImagery.show = (type === "raster");
    vectorImagery.show = (type === "vector");
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