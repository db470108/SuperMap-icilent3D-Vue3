<script setup>
  import LayerSelector from "@/components/LayerSelector.vue";
  import {ref} from "vue";

  // 布尔型变量，控制弹窗是否可见
  const showLayer = ref(false);

  // 点击后，改变控制弹窗的布尔值
  function toggleLayer() {
    showLayer.value = !showLayer.value;
  }

  const emit = defineEmits(['selectMap']);

  // 接受LayerSelector子组件传来的图层选项
  function handleLayerSelect(type) {
    showLayer.value = false
    console.log("选择的图层类型：", type);
    emit("selectMap", type);  //把从LayerSelector组件接收的type继续向上传递给PlatformPage组件
  }
</script>

<template>
  <!-- 横幅条 -->
  <div class="banner-bar">
    <div class="banner-left">武汉市智慧城市平台 · Wuhan Smart City Platform</div>
    <div class="banner-right">
      <button class="top-button" @click="toggleLayer">图层控制</button>
      <button class="top-button">系统设置</button>
    </div>
  </div>

  <!-- 图层弹窗组件 -->
  <LayerSelector v-model:visible="showLayer" @select="handleLayerSelect" />
</template>

<style scoped>
.banner-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  box-sizing: border-box;

  backdrop-filter: blur(12px);
  background: rgba(5, 10, 25, 0.6); /* 深蓝毛玻璃 */
  border-bottom: 1px solid rgba(51, 102, 204, 0.3);
  z-index: 1000;

  /* 无法选中 */
  user-select: none;
}

.banner-left {
  font-size: 18px;
  font-weight: bold;
  color: #3399ff; /* 深蓝亮光 */
  text-shadow: 0 0 8px rgba(51, 153, 255, 0.6);
  pointer-events: none;
  z-index: 1000
}

.banner-right {
  display: flex;
  gap: 16px;
  z-index: 1000;
  pointer-events: auto;
}

.top-button {
  background: rgba(30, 60, 120, 0.2);
  border: 1px solid #3399ff;
  color: #3399ff;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: 0.3s ease;
  z-index: 1000
}

.top-button:hover {
  background: rgba(30, 60, 120, 0.4);
  box-shadow: 0 0 12px rgba(51, 153, 255, 0.6);
}

</style>