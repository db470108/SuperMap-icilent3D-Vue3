<template>
  <div id="SceneViewer3D-Container" class="SceneViewer3D-Container"></div>
</template>

<script setup>
  import {onMounted, onUnmounted} from "vue";

  onMounted(()=>{
    const SuperMap3D = window.SuperMap3D;
    let viewer = new SuperMap3D.Viewer('SceneViewer3D-Container');
    window.viewer = viewer;
    let sceneUrl = 'http://localhost:8090/iserver/services/3D-WuhanWorkspace/rest/realspace';
    let promise = viewer.scene.open(sceneUrl);

    SuperMap3D.when(promise, function () {
      // 获取到当前视窗场景图层中的建筑物图层
      let buildingsLayer = viewer.scene.layers.find('建筑物3D@wuhan');

      // 当场景打开时，将视窗飞到建筑物上
      viewer.flyTo(buildingsLayer);

      // 获取到当前视窗场景图层中的水系面图层，并通过waterParameter属性设置其样式
      let waterLayer = viewer.scene.layers.find('水系面@wuhan');
      waterLayer.waterParameter.waveStrength = 3;
      waterLayer.waterParameter.waveDirection = 45;
      waterLayer.waterParameter.wavebodySize = 2;
      waterLayer.waterParameter.color = SuperMap3D.Color.CADETBLUE;
    })
  })

  onUnmounted(() => {
    if (window.viewer) {
      window.viewer.destroy()
      window.viewer = null
    }
  })
</script>

<style scoped>
  .SceneViewer3D-Container {
    width: 100%;
    height: 100%;
    background: black;
  }
</style>