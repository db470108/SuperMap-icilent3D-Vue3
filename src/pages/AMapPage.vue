<script setup>
  import AMapLoader from "@amap/amap-jsapi-loader";
  import {onMounted, onUnmounted, ref} from "vue";
  import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
  import {usePageStore} from "@/store/page.js";
  import {usePanelStore} from "@/store/panel.js";

  let map = null;

  // 获取当前页面
  const pageStore = usePageStore();
  // 获取当前模块
  const panelStore = usePanelStore();

  let searchResult = ref('');
  let searchInput = ref('');

  // 离开高德地图，回到平台页面
  function exitAMap() {
    pageStore.activePage = "scene-viewer-3d";
    panelStore.closePanel();
  }

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
          "AMap.PlaceSearch",
      ], function () { //异步同时加载多个插件
        const toolBar = new AMap.ToolBar();
        map.addControl(toolBar);

        const scale = new AMap.Scale(); //创建工具条插件实例,
        map.addControl(scale);  //添加工具条插件到页面

        const controlBar = new AMap.ControlBar({
          position: "RB",
          offset: [-10, 80],
        });
        map.addControl(controlBar);

        const mapType = new AMap.MapType({
          position: "RT",
          offset: [5, 50]
        });
        map.addControl(mapType);

        // 自动补全
        const autoOptions = {
          input: 'input',
        }
        const autoComplete = new AMap.AutoComplete(autoOptions);
        console.log(autoComplete)




      });
      const style = document.createElement('style');
      style.innerHTML = `
      .amap-sug-result {
      position: absolute;
      top: 90px !important;
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

      <div class="icon" @click="exitAMap">
        <font-awesome-icon icon="arrow-left-long"/>
        返回主页面
      </div>

        <el-input
            placeholder="搜索位置、公交站、地铁站"
            v-model="searchInput"
            class="input"
            id="input"
            clearable
        />

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

.input {
  position: absolute;
  top: 50px;
  left: 40px;
  z-index: 5000;
  width: 280px;
  height: 40px;
}


</style>