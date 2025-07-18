<script setup>
import { ref } from "vue";

  // 控制菜单可见性
  const menuVisible = ref(false);

  function toggleMenu(){
    menuVisible.value = !menuVisible.value;
  }

  const showBuildings = ref(true);
  const showWater = ref(true);
  const showRoads = ref(true);
  const showRailways = ref(true);

  const emit = defineEmits([
      'toggle-buildingsLayer',
      'toggle-waterLayer',
      'toggle-roadsLayer',
      'toggle-railwaysLayer'
  ]);

  function changeBuildingsVisibility() {
    emit('toggle-buildingsLayer', showBuildings.value);
  }

  function changeWaterVisibility() {
    emit('toggle-waterLayer', showWater.value);
  }

  function changeRoadsVisibility() {
    emit('toggle-roadsLayer', showRoads.value);
  }

  function changeRailwaysVisibility() {
    emit('toggle-railwaysLayer', showRailways.value);
  }

</script>

<template>

  <div class="layer-control">
    <button class="glow-button" :class="{ active: menuVisible }" @click="toggleMenu">图层管理</button>

    <transition name="fade-slide" mode="out-in">
      <ul v-show="menuVisible" class="dropdown-menu">

        <li>
          <input type="checkbox" v-model="showBuildings" @change="changeBuildingsVisibility">
          建筑
        </li>

        <li>
          <input type="checkbox" v-model="showWater" @change="changeWaterVisibility">
          水系
        </li>

        <li>
          <input type="checkbox" v-model="showRoads" @change="changeRoadsVisibility">
          公路
        </li>

        <li>
          <input type="checkbox" v-model="showRailways" @change="changeRailwaysVisibility">
          铁路
        </li>


      </ul>
    </transition>
  </div>

</template>

<style scoped>
.layer-control {
  display: inline-block;
  z-index: 2000;
  position: absolute;
  top: 5px;
  right: 280px;
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
  top: 50px;
  left: 0;
  background: linear-gradient(135deg, #ffffff4d, #f8f9fa4d);
  border-radius: 12px;
  padding: 8px 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  list-style: none;
  z-index: 1000;
  overflow: hidden;
  animation: fadeInScale 0.3s ease-in-out;
}

.dropdown-menu li {
  display: flex;
  align-items: center;
  padding: 8px 15px;
  font-size: 14px;
  color: #ffffff;
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