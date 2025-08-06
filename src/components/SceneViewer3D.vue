<template>
  <div id="SceneViewer3D-Container" class="SceneViewer3D-Container">
  </div>

</template>

<script setup>
import {onMounted, onUnmounted, watch} from "vue";
import axios from "@/utils/axios.js";
import {useWeatherStore} from "@/store/weather.js";

  const weatherStore = useWeatherStore();

  const SuperMap3D = window.SuperMap3D;
  let viewer;
  let timeCheckInterval = null; // 用于存储时间检查的定时器
  let lastAlpha = 1;  // 用于存储上一次建筑物的透明度值
  /*let lastCenter = null;
  let lastUpdateTime = 0;*/

  // 接受PlatformPage传来的参数
  const props = defineProps({
    showBuildings: Boolean,
    showWater: Boolean,
    showRoads: Boolean,
    showRailways: Boolean,
    skyBoxMode: String,
    weatherMode: String,
    isBuildingInfoWindowOpen: Boolean,
    searchMode: String,
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
            SuperMap3D.Math.toRadians(-40),  // 俯仰角
            800                             // 距离
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

  // 根据视角改变建筑物透明度的方法
  function updateBuildingsAlpha() {
    const height = viewer.camera.positionCartographic.height;

    const pitch = viewer.camera.pitch; // 弧度，俯视是负值
    const pitchDeg = SuperMap3D.Math.toDegrees(pitch); // 转换为角度

    const maxVisibleHeight = 5000; // 超过此高度时完全透明
    const minVisibleHeight = 800;  // 低于此高度时完全不透明
    const pitchThreshold = -70; // 只有俯仰角小于 -30° 才会出现建筑

    const buildingsLayer = viewer.scene.layers.find('buildings_3D');
    if (!buildingsLayer) return;

    // 不满足俯仰角要求则直接隐藏
    if (pitchDeg < pitchThreshold) {
      if (lastAlpha !== 0) {
        buildingsLayer.style3D.fillForeColor.alpha = 0;
        buildingsLayer.style3D.lineColor.alpha = 0;
        lastAlpha = 0;
      }
      return;
    }

    // 计算透明度 (0 到 1 之间)
    let alpha;
    if (height > maxVisibleHeight) {
      alpha = 0;
    } else if (height < minVisibleHeight) {
      alpha = 1;
    } else {
      alpha = 1 - (height - minVisibleHeight) / (maxVisibleHeight - minVisibleHeight);
    }

    // 避免频繁更新
    if (Math.abs(alpha - lastAlpha) > 0.01) {
      buildingsLayer.style3D.fillForeColor.alpha = alpha;
      lastAlpha = alpha;
    }
  }

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

    // WebGL启用色调映射
    viewer.scene.postProcessStages.fxaa.enabled = true;  // 先开启后期处理
    viewer.scene.highDynamicRange = true;  // 启用HDR

    // 隐藏credits
    setTimeout(() => {
      const creditsElements = document.querySelectorAll('.supermap3d-widget-credits');
      creditsElements.forEach(el => {
        el.style.display = 'none';
      });
    }, 100);

    // 初始化天空盒
    initializeSkyBox();

    // 每分钟检查一次时间并更新天空盒
    timeCheckInterval = setInterval(updateSkyBoxByTime, 60000);

    // 添加Mapbox矢量底图
    viewer.imageryLayers.addImageryProvider(
        new SuperMap3D.UrlTemplateImageryProvider({
          url: 'https://api.mapbox.com/styles/v1/x02lgc32/cmduh0nqv00oe01rh1n0sddaj/tiles/512/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoieDAybGdjMzIiLCJhIjoiY21jbTBpejVtMGNjczJscXFqOGc0OHgxMSJ9.g2aByb1XDIrtSF66FgfAtA',
          tilingScheme: new SuperMap3D.WebMercatorTilingScheme(),
          tileWidth: 512,
          tileHeight: 512,
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
        waterLayer.waterParameter.color = SuperMap3D.Color.fromBytes(135, 221, 255, 180); // 设置水体颜色
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
        destination: SuperMap3D.Cartesian3.fromDegrees(114.29, 30.51, 2000), // 武汉中心点
        orientation: {
          heading: SuperMap3D.Math.toRadians(0),
          pitch: SuperMap3D.Math.toRadians(-10),
          roll: 0
        },
      });

      // 添加点击事件监听，使用 pick 方法获取点击建筑物的属性信息
      const handler = new SuperMap3D.ScreenSpaceEventHandler(viewer.scene.canvas);
      watch(() => props.searchMode, (newValue) => {
        if (newValue === 'doubleClickSearch') {
          handler.setInputAction((movement) => {
            // 使用 viewer.pick 选取建筑物要素
            let pickedFeature = viewer.scene.pick(movement.position);

            if (pickedFeature && pickedFeature.primitive._name === 'buildings_3D') {
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
        } else {
          const buildingsLayer = viewer.scene.layers.find('buildings_3D');
          if (buildingsLayer) {
            buildingsLayer.setSelection([]); // 清除所有选中
          }
        }
      })


      // 监听相机高度变化，控制建筑物图层显隐
      viewer.camera.changed.addEventListener(() => {
        // 根据视角，改变建筑物透明度
        updateBuildingsAlpha();

        /*// 根据屏幕位置显示标签
        const now = Date.now();
        if (now - lastUpdateTime < 500) return; // 500ms 节流
        lastUpdateTime = now;

        const canvas = viewer.scene.canvas;
        const screenCenter = new SuperMap3D.Cartesian2(canvas.width / 2, canvas.height / 2);
        const cartesian = viewer.scene.pickPosition(screenCenter);

        if (SuperMap3D.defined(cartesian)) {
          const centerPoint = SuperMap3D.Cartographic.fromCartesian(cartesian);
          const centerPoint_Lon = SuperMap3D.Math.toDegrees(centerPoint.longitude);
          const centerPoint_Lat = SuperMap3D.Math.toDegrees(centerPoint.latitude);
          const height = centerPoint.height;
          // console.log("屏幕中心经纬度：", centerPoint_Lon, centerPoint_Lat, height);
        }

        // 添加标签
        let labelCollection = viewer.scene.primitives.add(new SuperMap3D.LabelCollection());
        let lon = SuperMap3D.Math.toRadians(114.285895);
        let lat = SuperMap3D.Math.toRadians(30.581270);
        let buildingsHeight = 183 + 10;
        labelCollection.add({
          position : SuperMap3D.Cartesian3.fromDegrees(114.285895, 30.581270, buildingsHeight),
          text : '新佳丽时尚广场',
          font : '20px Helvetica',
          fillColor: SuperMap3D.Color.SKYBLUE,
          outlineColor: SuperMap3D.Color.GREEN,
          outlineWidth: 2,
          scale: 1.0,
          style: SuperMap3D.LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: SuperMap3D.VerticalOrigin.BOTTOM
        })*/
      });

    })


  })

  onUnmounted(() => {
    // 清除定时器
    if (timeCheckInterval) {
      clearInterval(timeCheckInterval);
    }

    if (window.viewer) {
      window.viewer.destroy()
      window.viewer = null
    }
  })

  // 根据当前时间获取合适的天空盒类型
  function getCurrentSkyBoxMode() {
    const now = new Date();
    const hours = now.getHours();

    // 根据小时数判断时间段
    if (hours >= 6 && hours < 16) {
      return 'day'; // 白天 (6:00-16:00)
    } else if (hours >= 16 && hours < 19) {
      return 'sunset'; // 日落 (16:00-19:00)
    } else {
      return 'night'; // 夜晚 (19:00-6:00)
    }
  }

  // 初始化天空盒
  function initializeSkyBox() {
    // 如果模式为自动，则根据时间加载合适的天空盒
    if (!props.skyBoxMode || props.skyBoxMode === 'auto') {
      loadAppropriateSkyBoxByTime();
    } else {
      loadSkyBox(props.skyBoxMode);
    }
  }

  // 根据当前时间加载合适的天空盒
  function loadAppropriateSkyBoxByTime() {
    const skyBoxMode = getCurrentSkyBoxMode();
    loadSkyBox(skyBoxMode);
  }

  // 更新天空盒（根据时间）
  function updateSkyBoxByTime() {
    // 只有当模式为自动时才自动更新
    if (!props.skyBoxMode || props.skyBoxMode === 'auto') {
      loadAppropriateSkyBoxByTime();
    }
  }

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
      layer.style3D.fillForeColor = new SuperMap3D.Color(0.85, 0.85, 0.85, lastAlpha);

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

  // 天空盒模式的监视
  watch(() => props.skyBoxMode, (mode) => {
    if (mode === 'auto') {
      loadAppropriateSkyBoxByTime();
    } else {
      loadSkyBox(mode);
    }
  })

  function loadSkyBox (mode) {
    // 如果没有指定模式且模式为auto，则根据时间自动选择
    if (!mode || mode === 'auto') {
      mode = getCurrentSkyBoxMode();
    }

    console.log("加载天空盒模式:", mode); // 调试信息

    if (mode === 'day') {
      loadDaySkyBox();
    } else if (mode === 'night') {
      loadNightSkyBox();
    } else if (mode === 'sunset') {
      loadSunsetSkyBox();
    }

    // 手动触发当前天气
    applyWeather(props.weatherMode);
  }

  // 加载白天的天空盒
  function loadDaySkyBox () {
    console.log("加载白天天空盒");
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

  // 加载傍晚的天空盒
  function loadSunsetSkyBox () {
    console.log("加载傍晚天空盒");
    viewer.scene.skyBox = new SuperMap3D.SkyBox({
      show: true,
      imageUrl:'Sunset/kloppenheim_06_puresky_4k.hdr'
    });
  }

  // 加载夜晚的天空盒子
  function loadNightSkyBox () {
    console.log("加载夜晚天空盒");
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
  watch(() => weatherStore.currentWeather, (weather) => {
    if (props.weatherMode === 'auto') {
      loadAutoWeather();
    }
  })

  watch(() => props.weatherMode, (weather) => {
    applyWeather(weather);
  }, { immediate: true })
  // 天空盒的天气的切换
  function applyWeather (weather) {
    setTimeout(() => {
      if (weather === 'clear') {
        loadClearWeather();
      } else if (weather === 'rain') {
        loadRainWeather();
      } else if (weather === 'snow') {
        loadSnowWeather();
      } else if (weather === 'auto') {
        loadAutoWeather();
      }
    }, 200)
  }
  function loadClearWeather () {
    viewer.scene.postProcessStages.rain.enabled = false;
    viewer.scene.postProcessStages.snow.enabled = false;
  }
  function loadRainWeather () {
    viewer.scene.postProcessStages.rain.enabled = true;
    viewer.scene.postProcessStages.rain.uniforms.angle = 6.1;
    viewer.scene.postProcessStages.rain.uniforms.speed = 3;
    viewer.scene.postProcessStages.snow.enabled = false;
  }
  function loadSnowWeather () {
    viewer.scene.postProcessStages.snow.enabled = true;
    viewer.scene.postProcessStages.snow.uniforms.angle = 1;
    viewer.scene.postProcessStages.snow.uniforms.speed = 1;
    viewer.scene.postProcessStages.rain.enabled = false;
  }
  function loadAutoWeather () {
    const weather = weatherStore.currentWeather;
    if (weather && weather.includes('雨')) {
      loadRainWeather();
    } else if (weather && weather.includes('雪')) {
      loadSnowWeather();
    } else {
      loadClearWeather();
    }
  }


</script>

<style scoped>
  .SceneViewer3D-Container {
    width: 100%;
    height: 100%;
    background: black;
  }

</style>