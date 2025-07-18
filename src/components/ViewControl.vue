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
    <button class="glow-button" :class="{ active: menuVisible }" @click="toggleMenu">视角控制</button>
    <transition name="fade-slide" mode="out-in">
      <ul v-show="menuVisible" class="dropdown-menu">
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
  top: 5px;
  right: 160px; /* 根据实际情况调整 */
  user-select: none;
}

.glow-button {
  background: linear-gradient(45deg, #00bfff80, #0077ff80);
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.glow-button:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.glow-button.active {
  background: linear-gradient(45deg, #ffc40080, #004f9980); /* 半透明背景颜色 */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4); /* 更强的阴影效果 */
  transform: scale(1.1); /* 保持按钮放大效果 */
}

.dropdown-menu {
  position: absolute;
  top: 50px; /* 调整这个值以避免与其他菜单重叠 */
  left: 0;
  background: linear-gradient(135deg, #ffffff4d, #f8f9fa4d);
  border-radius: 12px;
  padding: 8px 10px; /* 调整内边距 */
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  list-style: none;
  z-index: 1000;
  overflow: hidden;
  animation: fadeInScale 0.3s ease-in-out;
}

.dropdown-menu li {
  display: flex; /* 确保文字水平显示 */
  align-items: center;
  padding: 8px 15px; /* 调整内边距 */
  font-size: 14px; /* 调整字体大小 */
  color: #333;
  transition: background 0.3s, transform 0.2s;
  cursor: pointer;
}

.dropdown-menu li:hover {
  background: rgba(0, 119, 255, 0.1);
  transform: translateX(2px);
}

.dropdown-menu input[type="checkbox"],
.dropdown-menu input[type="radio"] {
  margin-right: 10px;
}

.dropdown-menu hr {
  margin: 4px 0;
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.dropdown-menu li {
  color: #000000;
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