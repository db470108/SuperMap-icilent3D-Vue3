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
  <div class="fullscreen">
    <button
        class="icon-button"
        @click="toggleFullScreen"
        :title="isFullscreen ? '退出全屏' : '进入全屏'"
    >
      <font-awesome-icon :icon="isFullscreen ? 'compress' : 'expand'" class="icon-border"/>
    </button>
  </div>
</template>

<style scoped>
.fullscreen {
  display: inline-block;
  z-index: 2000;
  position: absolute;
  top: 7px;
  right: 10px;
  user-select: none;
}

.icon-button {
  all: unset;
  cursor: pointer;
}

.icon-button:disabled {
  pointer-events: none;
}

.icon-border {
  font-size: 20px;
  color: white;
  border: 2px solid transparent;
  border-radius: 4px;
  padding: 3px;
  transition: border-color 0.3s ease;
}

/* 悬停时变边框颜色 */
.icon-border:hover {
  border-color: rgba(51, 153, 255, 0.6);
}

/* 激活时边框颜色 */
.icon-border.active {
  border-color: rgba(51, 153, 255, 0.6);
}

.icon-button:disabled {
  pointer-events: none;
}
</style>