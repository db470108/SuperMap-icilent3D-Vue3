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
    showWater: Boolean,
    showRoads: Boolean,
    showRailways: Boolean,
  })


  onMounted(()=> {
    viewer = new SuperMap3D.Viewer('SceneViewer3D-Container', {
      imageryProvider: false, // 取消默认底图
      sceneMode: SuperMap3D.SceneMode.SCENE3D
    });
    window.viewer = viewer;

    viewer.scene.skyAtmosphere.show = true; // 开启大气层
    viewer.scene.globe.enableLighting = false; // 关闭地球光照，开启后画面明显卡顿
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

    // 添加场景(水系、公路、铁路)
    let sceneUrl = 'http://localhost:8090/iserver/services/3D-WuhanScene/rest/realspace';
    let sceneLayer = viewer.scene.open(sceneUrl);
    SuperMap3D.when(sceneLayer, (layer) => {
      window.sceneLayer = layer;
      console.log("场景加载完毕");
      console.log("场景属性：", layer);

      let waterLayer = viewer.scene.layers.find('water@wuhan');
      let roadsLayer = viewer.scene.layers.find('roads@wuhan');
      let railwaysLayer = viewer.scene.layers.find('railways@wuhan');

      // 设置水体的风格
      if (waterLayer && waterLayer.waterParameter) {
        console.log("水体加载完毕")
        console.log("水体属性：", waterLayer);
        waterLayer.waterParameter.waveDirection = 45; // 设置水流方向为东北
        waterLayer.waterParameter.color = SuperMap3D.Color.STEELBLUE; // 设置水体颜色
        waterLayer.waterParameter.waveStrength = SuperMap3D.WaveStrength.MODERATE;
        waterLayer.waterParameter.waterBodySize = SuperMap3D.WaterbodySize.MILD;
        waterLayer.waterParameter.speed = 10;
        waterLayer.waterParameter.fresnelPower = 0.6;
      } else {
        console.warn("未获取到水面图层或水面图层不具备waterParameter属性")
      }

      // 设置公路风格
      if (roadsLayer) {
        console.log("公路加载完毕")
        console.log("公路属性：", roadsLayer);
      }

      // 设置铁路风格
      if (railwaysLayer) {
        console.log("铁路加载完毕")
        console.log("铁路属性：", railwaysLayer);
      }
    })

    // 添加建筑物三维瓦片缓存
    let buildingsS3MUrl = 'http://localhost:8090/iserver/services/3D-local3DCache-buildings_3D/rest/realspace/datas/buildings_3D/config';
    let buildingsLayer = viewer.scene.addS3MTilesLayerByScp(buildingsS3MUrl, {name: 'buildings_3D'});

    // 设置建筑物的风格
    SuperMap3D.when(buildingsLayer, (layer) => {
      window.buildingsLayer = layer;
      console.log("建筑物加载完毕");
      console.log("建筑物属性：", layer);
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
      console.log('建筑物白膜风格应用成功');

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



  // 建筑物图层的监视
  watch(() => props.showBuildings, (value) => {
    value ? loadBuildings() : unloadBuildings();
  })
  function loadBuildings () {
    // 添加三维瓦片缓存
    let buildingsS3MUrl = 'http://localhost:8090/iserver/services/3D-local3DCache-buildings_3D/rest/realspace/datas/buildings_3D/config';
    let promise = viewer.scene.addS3MTilesLayerByScp(buildingsS3MUrl, {name: 'buildings_3D'});
    console.log("建筑物图层已加载");

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
      console.log('建筑物白膜风格应用成功');

    })

  }
  function unloadBuildings () {
    viewer.scene.layers.remove('buildings_3D', false);
    console.log("建筑物图层已卸载");
  }



  // 水体图层的监视
  watch(() => props.showWater, (value) => {
    value ? loadWater() : unloadWater();
  })
  function loadWater () {
    let waterLayer = viewer.scene.layers.find('water@wuhan');
    waterLayer.visible = true;
    console.log("水体图层已加载");
  }
  function unloadWater () {
    let waterLayer = viewer.scene.layers.find('water@wuhan');
    waterLayer.visible = false;
    console.log("水体图层已卸载");
  }



  // 公路图层的监视
  watch(() => props.showRoads, (value) => {
    value ? loadRoads() : unloadRoads();
  })
  function loadRoads () {
    let roadsLayer = viewer.scene.layers.find('roads@wuhan');
    roadsLayer.visible = true;
    console.log("公路图层已加载");
  }
  function unloadRoads () {
    let roadsLayer = viewer.scene.layers.find('roads@wuhan');
    roadsLayer.visible = false;
    console.log("公路图层已卸载");
  }



  // 公路图层的监视
  watch(() => props.showRailways, (value) => {
    value ? loadRailways() : unloadRailways();
  })
  function loadRailways() {
    let railwaysLayer = viewer.scene.layers.find('railways@wuhan');
    railwaysLayer.visible = true;
    console.log("铁路图层已加载");
  }
  function unloadRailways() {
    let railwaysLayer = viewer.scene.layers.find('railways@wuhan');
    railwaysLayer.visible = false;
    console.log("铁路图层已卸载");
  }


</script>

<style scoped>
  .SceneViewer3D-Container {
    width: 100%;
    height: 100%;
    background: black;
  }

</style>