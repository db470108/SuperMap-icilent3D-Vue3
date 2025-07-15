<template>
  <div id="SceneViewer3D-Container" class="SceneViewer3D-Container">
  </div>

</template>

<script setup>
import {onMounted, onUnmounted, ref, watch, watchEffect} from "vue";

  const SuperMap3D = window.SuperMap3D;
  let viewer;

  const props = defineProps({
    showBuildings: Boolean,
  })


  onMounted(()=>{
    viewer = new SuperMap3D.Viewer('SceneViewer3D-Container', {
      imageryProvider: false, // 取消默认底图
      sceneMode: SuperMap3D.SceneMode.SCENE3D
    });
    window.viewer = viewer;

    viewer.scene.skyAtmosphere.show = false; // 关闭大气层
    viewer.scene.globe.enableLighting = false; // 关闭地球光照
    viewer.scene.sun.show = true;

    // 添加Mapbox矢量底图
    viewer.imageryLayers.addImageryProvider(
        new SuperMap3D.UrlTemplateImageryProvider({
          url: 'https://api.mapbox.com/styles/v1/x02lgc32/cmcw2j5kg004001qs87hddjb1/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoieDAybGdjMzIiLCJhIjoiY21jbTBpejVtMGNjczJscXFqOGc0OHgxMSJ9.g2aByb1XDIrtSF66FgfAtA',
          tilingScheme: new SuperMap3D.WebMercatorTilingScheme(),
          tileWidth: 512,
          maximumLevel: 20,
          minimumLevel: 1,

        })
    );

    // 添加建筑物三维瓦片缓存
    let buildingsS3MUrl = 'http://localhost:8090/iserver/services/3D-local3DCache-buildings_3D/rest/realspace/datas/buildings_3D/config';
    let promise = viewer.scene.addS3MTilesLayerByScp(buildingsS3MUrl, {name: 'buildings_3D'});

    // 设置建筑物的风格
    promise.then((layer) => {
      window.buildingsLayer = layer;
      // 冷灰蓝主题
      layer.style3D.enableFill = true;
      layer.style3D.enableFillForeColor = true;
      layer.style3D.fillForeColor = new SuperMap3D.Color(0.12, 0.2, 0.35, 0.88);

      // 深灰描边
      layer.style3D.enableLine = true;
      layer.style3D.lineColor = new SuperMap3D.Color(0.3, 0.4, 0.6, 0.5);

      // 阴影增强立体感
      viewer.shadows = true;
      viewer.scene.shadowMap.enabled = true;
      viewer.scene.light = new SuperMap3D.DirectionalLight({
        direction: new SuperMap3D.Cartesian3(-1, -1, -0.5)
      });
      console.log('白膜风格应用成功');

      viewer.camera.setView({
        destination: SuperMap3D.Cartesian3.fromDegrees(114.29, 30.53, 3000), // 武汉中心点
        orientation: {
          heading: SuperMap3D.Math.toRadians(0),
          pitch: SuperMap3D.Math.toRadians(-30), // 朝下看 45°
          roll: 0
        },
      });
    })
  })

  onUnmounted(() => {
    if (window.viewer) {
      window.viewer.destroy()
      window.viewer = null
    }
  })

  watch(()=>props.showBuildings, (value)=>{
    if (value) {
      loadBuildings()
    } else {
      unloadBuildings()
    }
  })

  function loadBuildings () {
    // 添加三维瓦片缓存
    let buildingsS3MUrl = 'http://localhost:8090/iserver/services/3D-local3DCache-buildings_3D/rest/realspace/datas/buildings_3D/config';
    let promise = viewer.scene.addS3MTilesLayerByScp(buildingsS3MUrl, {name: 'buildings_3D'});

    // 设置建筑物的风格
    promise.then((layer) => {
      window.buildingsLayer = layer;
      // 冷灰蓝主题
      layer.style3D.enableFill = true;
      layer.style3D.enableFillForeColor = true;
      layer.style3D.fillForeColor = new SuperMap3D.Color(0.12, 0.2, 0.35, 0.88);

      // 深灰描边
      layer.style3D.enableLine = true;
      layer.style3D.lineColor = new SuperMap3D.Color(0.3, 0.4, 0.6, 0.5);

      // 阴影增强立体感
      viewer.shadows = true;
      viewer.scene.shadowMap.enabled = true;
      viewer.scene.light = new SuperMap3D.DirectionalLight({
        direction: new SuperMap3D.Cartesian3(-1, -1, -0.5)
      });
      console.log('白膜风格应用成功');

    })

  }
  function unloadBuildings () {
    viewer.scene.layers.remove('buildings_3D', false);
    console.log("图层已移除");
  }
</script>

<style scoped>
  .SceneViewer3D-Container {
    width: 100%;
    height: 100%;
    background: black;
  }

</style>