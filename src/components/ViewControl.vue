<script setup>
  import {ref} from "vue";

  const menuVisible = ref(false);

  function toggleMenu(){
    menuVisible.value = !menuVisible.value;
  }

  const SuperMap3D = window.SuperMap3D;

  function resetView() {
    viewer.camera.flyTo({
      destination: SuperMap3D.Cartesian3.fromDegrees(114.29, 30.53, 3000), // 武汉中心点
      orientation: {
        heading: SuperMap3D.Math.toRadians(0),
        pitch: SuperMap3D.Math.toRadians(-30), // 朝下看 45°
        roll: 0
      },
      duration: 3
    });
  }

  function topView() {
    viewer.camera.flyTo({
      destination: SuperMap3D.Cartesian3.fromDegrees(114.29, 30.59, 30000), // 武汉中心点
      orientation: {
        heading: SuperMap3D.Math.toRadians(0),
        pitch: SuperMap3D.Math.toRadians(-90), // 朝下看 45°
        roll: 0
      },
      duration: 3
    });
  }

</script>

<template>
  <div class="view-control">
    <button
        class="icon-button"
        @click="toggleMenu"
        :title="'视角控制'"
    >
      <font-awesome-icon icon="eye" :class="['icon-border', { active: menuVisible }]"/>
    </button>
    <transition name="fade-slide" mode="out-in">
      <div v-if="menuVisible" class="view-menu">
        <label @click="resetView">默认视角</label>
        <label @click="topView">垂直俯视</label>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.view-control {
  display: inline-block;
  z-index: 2000;
  position: absolute;
  top: 7px;
  right: 485px;
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
  border-color: #4aa8a8;
}

/* 激活时边框颜色 */
.icon-border.active {
  border-color: #4aa8a8;
}

/* 横向弹出菜单 */
.view-menu {
  position: fixed;
  top: 4px;
  right: 317px;
  display: flex;
  gap: 20px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  color: white;
  z-index: 3000;
}

.view-menu label {
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  cursor: pointer;
}

.view-menu label:hover {
  color: #4aa8a8;
}

/* 动画增强 */
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.fade-slide-enter-active {
  animation: fadeInScale 0.3s ease;
}
.fade-slide-leave-active {
  animation: fadeInScale 0.3s reverse;
}
</style>