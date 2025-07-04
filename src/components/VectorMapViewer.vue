<script setup>
import {onMounted, onUnmounted} from "vue";

onMounted(()=> {
  const SuperMap3D = window.SuperMap3D;
  let viewer = new SuperMap3D.Viewer('map-container');
  window.viewer = viewer;
  // 添加天地图栅格影像
  viewer.imageryLayers.addImageryProvider(new SuperMap3D.TiandituImageryProvider({
    mapStyle: SuperMap3D.TiandituMapsStyle.VEC_C,
    token: 'e1e9885949008a7d38002cf78ac67918'
  }))
  let imageryLayers = viewer.imageryLayers;
  // 添加中文注记
  let labelImagery = new SuperMap3D.TiandituImageryProvider({
    mapStyle: SuperMap3D.TiandituMapsStyle.CIA_C,
    token: 'e1e9885949008a7d38002cf78ac67918'
  });
  imageryLayers.addImageryProvider(labelImagery);

  // 影像加载后设置视角（跳转到武汉）
  viewer.scene.camera.flyTo({
    destination: SuperMap3D.Cartesian3.fromDegrees(114.3, 30.7, 300000), // 武汉市中心，海拔约20km
    orientation: {
      heading: SuperMap3D.Math.toRadians(0.0),    // 朝北
      pitch: SuperMap3D.Math.toRadians(-90.0),    // 向下俯视
      roll: 0.0
    }
  });

  // // 加载武汉市边界json数据
  // viewer.dataSources.add(SuperMap3D.GeoJsonDataSource.load('/assets/武汉市.json', {
  //   stroke: SuperMap3D.Color.MAROON,
  //   fill: SuperMap3D.Color.MAROON.withAlpha(0.3),
  //   strokeWidth: 2,
  //   markerSymbol: '?'
  // }))
})

  onUnmounted(() => {
    if (window.viewer) {
      window.viewer.destroy()
      window.viewer = null
    }
  })
</script>

<template>
  <div class="map-container" id="map-container"></div>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  z-index: 0;
}
</style>