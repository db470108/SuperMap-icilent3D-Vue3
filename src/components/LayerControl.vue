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
    <button
        class="icon-button"
        @click="toggleMenu"
        :title="'图层管理'"
    >
      <font-awesome-icon icon="list" :class="['icon-border', { active: menuVisible }]"/>
    </button>

    <!-- 横向弹出菜单 -->
    <transition name="fade-slide" mode="out-in">
      <div v-if="menuVisible" class="layer-menu">
        <label>
          <input type="checkbox" v-model="showBuildings" @change="changeBuildingsVisibility">
          建筑
        </label>

        <label>
          <input type="checkbox" v-model="showWater" @change="changeWaterVisibility">
          水系
        </label>

        <label>
          <input type="checkbox" v-model="showRoads" @change="changeRoadsVisibility">
          公路
        </label>

        <label>
          <input type="checkbox" v-model="showRailways" @change="changeRailwaysVisibility">
          铁路
        </label>
      </div>
    </transition>
  </div>

</template>

<style scoped>
.layer-control {
  display: inline-block;
  z-index: 2000;
  position: absolute;
  top: 7px;
  right: 820px;
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
.layer-menu {
  position: fixed;
  top: 4px;
  right: 525px;
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

.layer-menu label {
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  cursor: pointer;
}

.layer-menu label:hover {
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