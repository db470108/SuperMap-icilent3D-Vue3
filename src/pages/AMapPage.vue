<script setup>
  import AMapLoader from "@amap/amap-jsapi-loader";
  import {onMounted, onUnmounted, ref, watch} from "vue";
  import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
  import {usePageStore} from "@/store/page.js";
  import {usePanelStore} from "@/store/panel.js";

  // 获取当前页面
  const pageStore = usePageStore();
  // 获取当前模块
  const panelStore = usePanelStore();

  let map = null;
  let driving = null;
  let walking = null;
  let transfer = null;

  let startInput = ref(''); // 起点
  let endInput = ref(''); // 终点
  let mode = ref('');  // 出行方式
  let showNavigation = ref(false); // 默认隐藏导航面板
  let hasNavigated = ref(false); // 是否已经导航过

  // 离开高德地图，回到平台页面
  function exitAMap() {
    pageStore.activePage = "scene-viewer-3d";
    panelStore.closePanel();
  }

  // 开始导航
  function startNavigation() {
    // 判空
    if (!startInput.value && !endInput.value) {
      alert("请输入起点和终点");
      return;
    } else if (!startInput.value && endInput.value) {
      alert("请输入起点");
      return;
    } else if (!endInput.value && startInput.value) {
      alert("请输入终点");
      return;
    }

    // 地理编码起点
    const geocoder = new AMap.Geocoder({
      city: "武汉"
    });
    geocoder.getLocation(startInput.value, function (status, resultStart) {
      if (status === 'complete' && resultStart.info === 'OK') {
        const start = resultStart.geocodes[0].location;

        // 地理编码终点
        geocoder.getLocation(endInput.value, function (status, resultEnd) {
          if (status === 'complete' && resultEnd.info === 'OK') {
            const end = resultEnd.geocodes[0].location;


            if (mode.value === 'driving') {
              driving.search(start, end);
            } else if (mode.value === 'walking') {
              walking.search(start, end);
            } else if (mode.value === 'transfer') {
              transfer.search(start, end);
            }
          } else {
            alert("终点地址无法解析");
          }
        })
      } else {
        alert("起点地址无法解析");
      }
    })
    // 显示导航面板
    showNavigation.value = true;
    // 已经导航过
    hasNavigated.value = true;
  }


  // 开始导航后，切换模式后，重新开始导航
    watch(() => mode.value, (newMode) => {
      if (hasNavigated.value) {
        if (newMode === 'driving') {
          walking?.clear();
          transfer?.clear();
        } else if (newMode === 'walking') {
          driving?.clear();
          transfer?.clear();
        } else if (newMode === 'transfer') {
          driving?.clear();
          walking?.clear();
        }
        startNavigation();
      }
    })


  onMounted(() => {

    window._AMapSecurityConfig = {
      securityJsCode: "04f8d9328bfaa88a894e1a99a1fad779",
    };
    AMapLoader.load({
      key: "dc140ec9deaef19d44a8dbb73ac51175",
      version: "2.0",
      plugins: ["AMap.Scale"],
    })
        .then((AMap) => {
          map = new AMap.Map("amap-container", {
            viewMode: "3D",
            zoom: 16,
            center: [114.308228, 30.54223],
          });
        })
        .catch((e) => {
          console.error(e);
        });

    setTimeout(() => {
      AMap.plugin([
          "AMap.ToolBar",
          "AMap.Scale",
          "AMap.ControlBar",
          "AMap.MapType",
          "AMap.HawkEye",
          "AMap.AutoComplete",
          "AMap.Geocoder",
          "AMap.Driving",
          "AMap.Walking",
          "AMap.Transfer",
      ], function () { //异步同时加载多个插件
        // 放大缩小
        const toolBar = new AMap.ToolBar();
        map.addControl(toolBar);

        // 比例尺
        const scale = new AMap.Scale(); //创建工具条插件实例,
        map.addControl(scale);  //添加工具条插件到页面

        // 控制器
        const controlBar = new AMap.ControlBar({
          position: "RB",
          offset: [-10, 80],
        });
        map.addControl(controlBar);

        // 地图类型切换器
        const mapType = new AMap.MapType({
          position: "RT",
          offset: [5, 50]
        });
        map.addControl(mapType);

        // 自动补全
        const startAutoOptions = {
          input: 'startInput',
          city: '武汉',
        };
        const endAutoOptions = {
          input: 'endInput',
          city: '武汉',
        };
        const startAutoComplete = new AMap.AutoComplete(startAutoOptions);
        const endAutoComplete = new AMap.AutoComplete(endAutoOptions);

        // 三种地图导航方式
        driving = new AMap.Driving({ map: map, panel: 'route-panel'});
        walking = new AMap.Walking({ map: map, panel: 'route-panel'});
        transfer = new AMap.Transfer({ map: map, panel: 'route-panel', city: '武汉'});



      });
      const style = document.createElement('style');
      style.innerHTML = `
      .amap-sug-result {
      position: absolute;
      top: 200px !important;
      left: 40px !important;
      background: #fff !important;
      width: 279px !important;
      border-radius: 4px !important;
      }
      .amap-sug-item {
      padding: 8px 12px !important;
      }
      `;
      document.head.appendChild(style);
    }, 1000)


  });

  onUnmounted(() => {
    map?.destroy();
  });
</script>

<template>
  <div class="amap-page">

    <div id="amap-container">

<!--      返回按钮-->
      <div class="icon" @click="exitAMap">
        <font-awesome-icon icon="arrow-left-long"/>
        返回主页面
      </div>

<!--        导航输入框-->
      <div class="nav-inputs">
        <el-input
            id="startInput"
            placeholder="请输入起点"
            v-model="startInput"
            class="input"
            clearable
        />
        <el-input
            id="endInput"
            placeholder="请输入终点"
            v-model="endInput"
            class="input"
            clearable
        />

        <el-select v-model="mode" placeholder="请选择出行方式">
          <el-option label="驾车" value="driving"/>
          <el-option label="步行" value="walking"/>
          <el-option label="公共交通" value="transfer"/>
        </el-select>

        <el-button type="primary" @click="startNavigation">开始导航</el-button>

      </div>

<!--      路线面板-->
      <div id="route-panel" v-if="showNavigation"></div>

    </div>


  </div>




</template>

<style scoped>
.amap-page {
  position: absolute;
  height: 100vh;
  width: 100vw;
}

#amap-container {
  height: 100vh;
  width: 100vw;
}

.icon {
  font-size: 13px;
  color: #f4f0f0;
  position: absolute;
  top: 6px;
  left: 20px;
  cursor: pointer;
  z-index: 5000;
  border: 1px solid rgba(54, 171, 243, 0.84);
  padding: 6px 12px;
  border-radius: 8px;
  user-select: none;
}

.icon:hover {
  cursor: pointer;
  box-shadow: 0 0 10px rgba(54, 171, 243, 0.84);
  transition: all 0.3s ease-in-out;
}

:deep(.amap-toolbar) {
  transform: scale(1.1);
}

:deep(.amap-controlbar) {
  transform: scale(0.7); /* 缩小 */
}

:deep(.amap-maptype) {
  transform: scale(0.9); /* 缩小 */
}

.nav-inputs {
  position: absolute;
  top: 50px;
  left: 40px;
  z-index: 5000;
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 280px;
}

.input {
  width: 100%;
}

#route-panel {
  position: absolute;
  top: 150px;
  right: 5px;
  width: 300px;
  max-height: 60%;
  overflow-y: auto;
  background: white;
  z-index: 5000;
  border-radius: 8px;
  padding: 10px;
}


</style>