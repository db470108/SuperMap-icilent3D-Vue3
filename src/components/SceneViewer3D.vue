<template>
  <div id="SceneViewer3D-Container" class="SceneViewer3D-Container">
  </div>

</template>

<script setup>
import {onMounted, onUnmounted, watch} from "vue";
import axios from "@/utils/axios.js";

  const SuperMap3D = window.SuperMap3D;
  let viewer;

  // 接受PlatformPage传来的参数
  const props = defineProps({
    showBuildings: Boolean,
    showWater: Boolean,
    showRoads: Boolean,
    showRailways: Boolean,
    showSkyBox: Boolean,
    skyBoxMode: String,
    weatherMode: String,
    isBuildingInfoWindowOpen: Boolean,
  })

  const emit = defineEmits(['select-building']);

  // 飞向建筑物的方法
  function flyToBuilding(building) {
    if (!viewer || !building) return;
    // 通过建筑物ID在场景中查找并飞向对应的建筑物
    const buildingsLayer = viewer.scene.layers.find('buildings_3D');

    // 如果建筑物有经纬度信息，则飞向该位置
    if (building.longitude_X && building.latitude_Y) {
      // 将经纬度转换为笛卡尔坐标
      const position = SuperMap3D.Cartesian3.fromDegrees(
        building.longitude_X,
        building.latitude_Y,
      );

      // 创建一个包围球，使视图能够更好地包含目标建筑物
      const boundingSphere = new SuperMap3D.BoundingSphere(position, 350);

      // 飞向目标位置
      viewer.camera.flyToBoundingSphere(boundingSphere,{
        offset: new SuperMap3D.HeadingPitchRange(
            SuperMap3D.Math.toRadians(0),    // 方向角
            SuperMap3D.Math.toRadians(-50),  // 俯仰角
            1500                             // 距离
        ),
        duration: 3 // 飞行时间，单位秒
      });

      // 飞向建筑物后，选中并高亮显示该建筑物
      // 使用 buildingsLayer.setSelection 方法设置选中状态
      if (buildingsLayer && building.id !== undefined) {
        // 先清除之前的选中状态
        buildingsLayer.setSelection([]);
        // 设置当前建筑物为选中状态
        buildingsLayer.setSelection([building.id]);

        // 延迟触发，当视角飞往目标位置后，再触发select-building事件
        setTimeout(()=>{
          // 触发select-building事件，使得信息窗口可以显示
          emit('select-building', building);
        }, 2800)

      }
    } else {
      console.warn("建筑物缺少经纬度信息");
    }
  }

  // 将方法暴露给父组件
  defineExpose({
    flyToBuilding
  });

  
  onMounted(()=> {
    viewer = new SuperMap3D.Viewer('SceneViewer3D-Container', {
      imageryProvider: false, // 取消默认底图
      sceneMode: SuperMap3D.SceneMode.SCENE3D,
      infoBox: false
    });
    window.viewer = viewer;

    viewer.scene.skyAtmosphere.show = false; // 开启大气层
    viewer.scene.globe.enableLighting = false; // 关闭地球光照，开启后画面明显卡顿
    viewer.scene.sun.show = true;

    // 初始化天空盒
    viewer.scene.skyBox = new SuperMap3D.SkyBox({
      show: true,
      sources: {
        positiveX : 'Day/Right.jpg',
        negativeX : 'Day/Left.jpg',
        positiveY : 'Day/Front.jpg',
        negativeY : 'Day/Back.jpg',
        positiveZ : 'Day/Top.jpg',
        negativeZ : 'Day/Down.jpg'
      }
    });

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

      let waterLayer = viewer.scene.layers.find('water@wuhan');
      let roadsLayer = viewer.scene.layers.find('roads@wuhan');
      let railwaysLayer = viewer.scene.layers.find('railways@wuhan');

      // 设置水体的风格
      if (waterLayer && waterLayer.waterParameter) {
        waterLayer.waterParameter.waveDirection = 45; // 设置水流方向为东北
        waterLayer.waterParameter.color = SuperMap3D.Color.STEELBLUE; // 设置水体颜色
        waterLayer.waterParameter.waveStrength = SuperMap3D.WaveStrength.MODERATE;
        waterLayer.waterParameter.waterBodySize = SuperMap3D.WaterbodySize.LARGE;
        waterLayer.waterParameter.speed = 7;
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
      console.log("建筑物：", layer);
      // 冷灰蓝主题
      layer.style3D.enableFill = true;
      layer.style3D.enableFillForeColor = true;
      // layer.style3D.fillForeColor = new SuperMap3D.Color(0.12, 0.2, 0.3, 0.88);
      layer.style3D.fillForeColor = new SuperMap3D.Color(0.85, 0.85, 0.85, 1);

      // 深灰描边
      layer.style3D.enableLine = true;
      layer.style3D.lineColor = new SuperMap3D.Color(0, 0.8, 1, 1);
      layer.style3D.lineWidth = 2;

      // 阴影增强立体感
      viewer.shadows = true;
      viewer.scene.shadowMap.enabled = true;
      viewer.scene.light = new SuperMap3D.DirectionalLight({
        direction: new SuperMap3D.Cartesian3(-1, -1, -0.5)
      });

      viewer.camera.setView({
        destination: SuperMap3D.Cartesian3.fromDegrees(114.29, 30.53, 3000), // 武汉中心点
        orientation: {
          heading: SuperMap3D.Math.toRadians(0),
          pitch: SuperMap3D.Math.toRadians(-30), // 朝下看 45°
          roll: 0
        },
      });

      // 添加点击事件监听，使用 pick 方法获取点击建筑物的属性信息
      const handler = new SuperMap3D.ScreenSpaceEventHandler(viewer.scene.canvas);

      handler.setInputAction((movement) => {
        // 使用 viewer.pick 选取建筑物要素
        let pickedFeature = viewer.scene.pick(movement.position);

        if (pickedFeature.primitive._name === 'buildings_3D') {
          let pickedId = pickedFeature.id;
          console.log("点击的id：", pickedId)
          async function fetchBuildingInfo(pickedId) {
            const response = await axios({
              method: 'GET',
              url: `/buildings/${pickedId}`
            })
            console.log("返回的属性信息：", response.data)
            emit('select-building', response.data)
          }
          fetchBuildingInfo(pickedId)

        } else {
          console.warn("未点击到建筑物")
        }
      }, SuperMap3D.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);


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

    // 设置建筑物的风格
    promise.then((layer) => {
      window.buildingsLayer = layer;
      // 冷灰蓝主题
      layer.style3D.enableFill = true;
      layer.style3D.enableFillForeColor = true;
      layer.style3D.fillForeColor = new SuperMap3D.Color(0.85, 0.85, 0.85, 1);

      // 深灰描边
      layer.style3D.enableLine = true;
      layer.style3D.lineColor = new SuperMap3D.Color(0.3, 0.4, 0.6, 0.5);

      // 阴影增强立体感
      viewer.shadows = true;
      viewer.scene.shadowMap.enabled = true;
      viewer.scene.light = new SuperMap3D.DirectionalLight({
        direction: new SuperMap3D.Cartesian3(-1, -1, -0.5)
      });

    })

  }
  function unloadBuildings () {
    viewer.scene.layers.remove('buildings_3D', false);
  }



  // 水体图层的监视
  watch(() => props.showWater, (value) => {
    value ? loadWater() : unloadWater();
  })
  function loadWater () {
    let waterLayer = viewer.scene.layers.find('water@wuhan');
    waterLayer.visible = true;
  }
  function unloadWater () {
    let waterLayer = viewer.scene.layers.find('water@wuhan');
    waterLayer.visible = false;
  }



  // 公路图层的监视
  watch(() => props.showRoads, (value) => {
    value ? loadRoads() : unloadRoads();
  })
  function loadRoads () {
    let roadsLayer = viewer.scene.layers.find('roads@wuhan');
    roadsLayer.visible = true;
  }
  function unloadRoads () {
    let roadsLayer = viewer.scene.layers.find('roads@wuhan');
    roadsLayer.visible = false;
  }



  // 公路图层的监视
  watch(() => props.showRailways, (value) => {
    value ? loadRailways() : unloadRailways();
  });
  function loadRailways() {
    let railwaysLayer = viewer.scene.layers.find('railways@wuhan');
    railwaysLayer.visible = true;
  }
  function unloadRailways() {
    let railwaysLayer = viewer.scene.layers.find('railways@wuhan');
    railwaysLayer.visible = false;
  }

  // 是否开启天空盒的监视
  watch(() => props.showSkyBox, (visible) => {
    visible ? loadSkyBox(props.skyBoxMode) : unloadSkyBox();
  })

  // 天空盒的模式(白天/夜晚)
  watch(() => props.skyBoxMode, (mode) => {
    if (props.showSkyBox) {
      loadSkyBox(mode);
    }
  })

  function loadSkyBox (mode) {
    if (mode === 'day') {
      loadDaySkyBox();
    } else if (mode === 'night') {
      loadNightSkyBox();
    }

    // 手动触发当前天气
    applyWeather(props.weatherMode);
  }

  function unloadSkyBox () {
    let skyBox = viewer.scene.skyBox;
    skyBox.show = false;
    loadClearWeather(); // 禁用天气效果
  }

  // 加载白天的天空盒
  function loadDaySkyBox () {
    viewer.scene.skyBox = new SuperMap3D.SkyBox({
      show: true,
      sources: {
        positiveX : 'Day/Right.jpg',
        negativeX : 'Day/Left.jpg',
        positiveY : 'Day/Front.jpg',
        negativeY : 'Day/Back.jpg',
        positiveZ : 'Day/Top.jpg',
        negativeZ : 'Day/Down.jpg'
      }
    });
  }

  // 加载夜晚的天空盒子
  function loadNightSkyBox () {
    viewer.scene.skyBox = new SuperMap3D.SkyBox({
      show: true,
      sources: {
        positiveX : 'Night/Right.jpg',
        negativeX : 'Night/Left.jpg',
        positiveY : 'Night/Front.jpg',
        negativeY : 'Night/Back.jpg',
        positiveZ : 'Night/Top.jpg',
        negativeZ : 'Night/Down.jpg'
      }
    });
  }

  // 天气的监视
  watch(() => props.weatherMode, (weather) => {
    applyWeather(weather);
  })
  // 天空盒的天气的切换
  function applyWeather (weather) {
    if (weather === 'clear') {
      loadClearWeather();
    } else if (weather === 'rain') {
      loadRainWeather();
    } else if (weather === 'snow') {
      loadSnowWeather();
    }
  }
  function loadClearWeather () {
    viewer.scene.postProcessStages.rain.enabled = false;
    viewer.scene.postProcessStages.snow.enabled = false;
  }
  function loadRainWeather () {
    viewer.scene.postProcessStages.rain.enabled = true;
    viewer.scene.postProcessStages.rain.uniforms.angle = 6.1;
    viewer.scene.postProcessStages.rain.uniforms.speed = 5;
    viewer.scene.postProcessStages.snow.enabled = false;
  }
  function loadSnowWeather () {
    viewer.scene.postProcessStages.snow.enabled = true;
    viewer.scene.postProcessStages.snow.uniforms.angle = 1;
    viewer.scene.postProcessStages.snow.uniforms.speed = 1;
    viewer.scene.postProcessStages.rain.enabled = false;
  }


</script>

<style scoped>
  .SceneViewer3D-Container {
    width: 100%;
    height: 100%;
    background: black;
  }

</style>