<script setup>
import { ref } from "vue";

  // 控制菜单可见性
  const menuVisible = ref(false);

  function toggleMenu(){
    menuVisible.value = !menuVisible.value;
  }

  const showBuildings = ref(true);
  const emit = defineEmits(['toggle-layer'])

  function changeBuildingsVisibility() {
    emit('toggle-layer', showBuildings.value);
  }
</script>

<template>

  <div class="layer-control">
    <button class="glow-button" @click="toggleMenu">图层管理</button>

    <transition name="fade-slide">
      <ul v-if="menuVisible" class="dropdown-menu">

        <li>
          <input type="checkbox" v-model="showBuildings" @change="changeBuildingsVisibility">
          建筑物
        </li>

        <li>
          <input type="checkbox">
          水系
        </li>

        <li>
          <input type="checkbox">
          交通网
        </li>

        <li class="warning">
          请勿频繁切换！
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
  top: 8px;
  right: 280px;
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

.warning {
  color: #ff4d51;
  font-size: 12px;
  pointer-events: none;
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