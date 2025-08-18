<script setup>
  import AMapLoader from "@amap/amap-jsapi-loader";
  import {computed, onMounted, onUnmounted, ref, watch} from "vue";
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
  let riding = null;

  let startInput = ref(''); // 起点
  let endInput = ref(''); // 终点
  let trafficMode = ref('driving');  // 出行方式
  let showNavigation = ref(false); // 默认隐藏导航面板
  let hasNavigated = ref(false); // 是否已经导航过
  let unsupportedRoute = ref(false); // 是否不支持当前路线
  let isStartSelected = ref(false); // 起点是否选择
  let isEndSelected = ref(false); // 终点是否选择
  let isButtonDisabled = computed(() => !(isStartSelected.value && isEndSelected.value)); // 开始导航按钮是否可用

  // 驾车出行策略
  let drivingPolicies = ref([
    { label: "时间短", value: 0 }, // 最短时间
    { label: "费用少", value: 1 }, // 最低费用
    { label: "距离短", value: 2 }, // 最短距离
    { label: "考虑实时路况", value: 3 }, // 考虑实时路况
  ]);
  let selectedDrivingPolicy = ref(0);  // 选中的驾车出行策略

  // 公共交通出行策略
  let transferPolicies = ref([
    { label: "时间短", value: 0 }, // 最短时间
    { label: "费用少", value: 1 }, // 最低费用
    { label: "换乘少", value: 2 }, // 最少换乘
    { label: "步行少", value: 3 }, // 最少步行
    { label: "不坐地铁", value: 5 },  // 不坐地铁
  ]);
  let selectedTransferPolicy = ref(0); // 选中的公共交通出行策略

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

    if (isStartSelected.value && isEndSelected.value) {
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

              // 重置状态
              showNavigation.value = false;
              unsupportedRoute.value = false;
              // 已经导航过
              hasNavigated.value = true;

              if (trafficMode.value === 'driving') {
                showNavigation.value = true;
                driving.search(start, end);
              } else if (trafficMode.value === 'walking') {
                showNavigation.value = true;
                walking.search(start, end, function(status, result) {
                  if (status !== 'complete' || result.info !== 'OK') {
                    showNavigation.value = false;
                    unsupportedRoute.value = true;
                  }
                });
              } else if (trafficMode.value === 'transfer') {
                showNavigation.value = true;
                transfer.search(start, end);
              } else if (trafficMode.value === 'riding') {
                showNavigation.value = true;
                riding.search(start, end, function(status, result) {
                  if (status !== 'complete' || result.info !== 'OK') {
                    showNavigation.value = false;
                    unsupportedRoute.value = true;
                  }
                });
              }
            } else {
              alert("终点地址无法解析");
            }
          })
        } else {
          alert("起点地址无法解析");
        }
      })
    }



  }

  function initDriving() {
    driving = new AMap.Driving({
      policy: selectedDrivingPolicy.value,
      map: map,
      panel: 'route-panel',
      city: '武汉'
    });
  }
  function initTransfer() {
    transfer = new AMap.Transfer({
      policy: selectedTransferPolicy.value,
      map: map,
      panel: 'route-panel',
      city: '武汉'
    });
  }


  // 开始导航后，切换模式后，重新开始导航
    watch(() => trafficMode.value, (newMode) => {
      if (!hasNavigated) return;

      // 清除旧路线
      driving?.clear();
      walking?.clear();
      riding?.clear();
      transfer?.clear();

      // 立即导航
      startNavigation();

    })

  // 输入框内容改变时，重置按钮状态
  watch(() => startInput.value, (value) => {
    if (!value) {
      isStartSelected.value = false;
      showNavigation.value = false;
    }
  })
  watch(() => endInput.value, (value) => {
    if (!value) {
      isEndSelected.value = false;
      showNavigation.value = false;
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
          "AMap.Riding",
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
          citylimit: true,
        };
        const endAutoOptions = {
          input: 'endInput',
          city: '武汉',
          citylimit: true,
        };
        const startAutoComplete = new AMap.AutoComplete(startAutoOptions);
        const endAutoComplete = new AMap.AutoComplete(endAutoOptions);

        startAutoComplete.on('select', (e) => {
          startInput.value = e.poi.name;
          isStartSelected.value = true;
        });
        endAutoComplete.on('select', (e) => {
          endInput.value = e.poi.name;
          isEndSelected.value = true;
        });

        driving = new AMap.Driving({
          policy: selectedDrivingPolicy.value,
          map: map,
          panel: 'route-panel',
        });

        walking = new AMap.Walking({
          map: map,
          panel: 'route-panel'
        });

        riding = new AMap.Riding({
          map: map,
          panel: 'route-panel'
        });

        transfer = new AMap.Transfer({
          policy: selectedTransferPolicy.value,
          map: map, panel: 'route-panel',
          city: '武汉'
        });


        // 切换出行策略后执行一次导航
        watch(() => selectedDrivingPolicy.value, (value) => {
          console.log( value)
          if (trafficMode.value === 'driving') {
            driving?.clear();
            initDriving();
            startNavigation();
          }
        });

        watch(() => selectedTransferPolicy.value, (value) => {
          if (trafficMode.value === 'transfer') {
            transfer?.clear();
            initTransfer();
            startNavigation();
          }
        })


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

        <div class="mode-select">
          <el-select v-model="trafficMode" placeholder="选择出行方式">
            <el-option label="驾车" value="driving"/>
            <el-option label="步行" value="walking"/>
            <el-option label="骑行" value="riding"/>
            <el-option label="公共交通" value="transfer"/>
          </el-select>

          <el-select v-model="selectedDrivingPolicy" placeholder="选择出行策略" v-if="trafficMode === 'driving'">
            <el-option
              v-for="item in drivingPolicies"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <el-select v-model="selectedTransferPolicy" placeholder="选择出行策略" v-if="trafficMode === 'transfer'">
            <el-option
                v-for="item in transferPolicies"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </div>

        <el-button type="primary" @click="startNavigation" :disabled="isButtonDisabled">开始导航</el-button>

      </div>

<!--      路线面板-->
      <div id="route-panel" v-if="showNavigation"></div>
      <div class="unsupported-route" v-if="unsupportedRoute">不支持当前路线</div>

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

.mode-select {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 280px;
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

.unsupported-route {
  position: absolute;
  top: 150px;
  right: 5px;
  width: 300px;
  background: white;
  z-index: 5000;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  font-size: 16px;
  color: #666;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 隐藏前往高德地图查看链接 */
:deep(.amap-call) {
  display: none !important;
}


</style>