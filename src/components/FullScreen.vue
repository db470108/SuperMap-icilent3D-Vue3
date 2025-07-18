<script setup>
  // 全屏状态
  import {ref} from "vue";

  const isFullscreen = ref(false);

  // 切换全屏
  function toggleFullScreen() {
    const elem = props.targetElement || document.getElementById("main-container");

    if (!elem) {
      console.error("未找到目标元素");
      return;
    }

    if (!document.fullscreenElement) {
      elem.requestFullscreen()
          .then(() => {
            isFullscreen.value = true;
            console.log("进入全屏成功");
          })
          .catch((err) => {
            console.error("进入全屏失败:", err);
            alert(`进入全屏失败: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
      isFullscreen.value = false;
      console.log("退出全屏")
    }
  }

  // 监听浏览器全屏变化
  document.addEventListener("fullscreenchange", () => {
    isFullscreen.value = !!document.fullscreenElement;
    console.log("全屏状态变化:", isFullscreen.value ? "全屏中" : "非全屏");
  });

  // 接收目标容器
  const props = defineProps({
    targetElement: {
      type: HTMLElement,
      default: null
    }
  });
</script>

<template>
  <button
      class="fullscreen-button"
      @click="toggleFullScreen"
      :title="isFullscreen ? '退出全屏' : '进入全屏'"
  >
    <font-awesome-icon :icon="isFullscreen ? 'compress' : 'expand'"/>
  </button>
</template>

<style scoped>
.fullscreen-button {
  position: absolute;
  top: 12px;
  right: 10px;
  background: rgba(5, 10, 25, 0.7);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  z-index: 1000;
  transition: all 0.2s ease-in-out;
}

.fullscreen-button:hover {
  background: rgba(5, 10, 25, 0.9);
  transform: scale(1.1);
}
</style>