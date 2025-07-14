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
    <button class="glow-button" @click="toggleMenu">视角控制</button>
    <transition name="fade-slide">
      <ul v-if="menuVisible" class="dropdown-menu">
        <li @click="resetView">默认视角</li>
        <li @click="topView">垂直俯视</li>
      </ul>
    </transition>
  </div>
</template>

<style scoped>
.view-control {
  display: inline-block;
  z-index: 2000;
  position: absolute;
  top: 8px;
  right: 160px;
  user-select: none;
}

.glow-button {
  background-color: #1e3c72;
  color: #fff;
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  font-size: 16px;
}

.glow-button:hover {
  background-color: #2a4fa3;
  box-shadow: 0 0 10px rgba(42, 79, 163, 0.6);
}

.dropdown-menu {
  position: absolute;
  top: 45px;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  list-style: none;
  padding: 8px 0;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.dropdown-menu li {
  padding: 8px 12px;
  cursor: pointer;
  white-space: nowrap;
}

.dropdown-menu li:hover {
  background-color: #f0f0f0;
  color: #1e3c72;
}

/* 过渡动画样式 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>