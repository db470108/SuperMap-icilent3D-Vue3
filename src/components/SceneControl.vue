<script setup>
import {ref} from "vue";

  // 控制菜单可见性
  const menuVisible = ref(false);
  function toggleMenu(){
    menuVisible.value = !menuVisible.value;
  }

  // 向PlatformPage发送参数
  const emit = defineEmits([
      'changeSkyBox',
      'changeDayOrNight',
      'changeWeatherMode'
  ]);

  // 默认开启天空盒
  const showSkyBox = ref(true);
  // 改变天空盒可见性
  function changeSkyBox () {
    emit('changeSkyBox', showSkyBox.value);
  }

  // 默认为白天
  const skyBoxMode = ref('day');
  // 切换白天或夜晚
  function changeDayOrNight() {
    emit('changeDayOrNight', skyBoxMode.value);
  }

  // 默认为晴天
  const weatherMode = ref('clear');
  // 切换天气
  function changeWeatherMode() {
    emit('changeWeatherMode', weatherMode.value);
  }

</script>

<template>

  <div class="scene-control">
    <button
        class="icon-button"
        @click="toggleMenu"
        :title="'场景设置'"
    >
      <font-awesome-icon icon="cloud" :class="['icon-border', { active: menuVisible }]"/>
    </button>
    <transition name="fade-slide" mode="out-in">
      <div class="skybox-menu" v-if="menuVisible">
        <label>
          <input type="checkbox" v-model="showSkyBox" @change="changeSkyBox">
          天空
        </label>

        <label v-if="showSkyBox">
          <input type="radio" value="day" v-model="skyBoxMode" @change="changeDayOrNight">
          白天
        </label>

        <label v-if="showSkyBox">
          <input type="radio" value="night" v-model="skyBoxMode" @change="changeDayOrNight">
          夜晚
        </label>

        <br v-if="showSkyBox">

        <label v-if="showSkyBox">
          <input type="radio" value="clear" v-model="weatherMode" @change="changeWeatherMode">
          晴天
        </label>

        <label v-if="showSkyBox">
          <input type="radio" value="rain" v-model="weatherMode" @change="changeWeatherMode">
          雨天
        </label>

        <label v-if="showSkyBox">
          <input type="radio" value="snow" v-model="weatherMode" @change="changeWeatherMode">
          雪天
        </label>

      </div>
    </transition>
  </div>

</template>

<style scoped>
.scene-control {
  display: inline-block;
  z-index: 2000;
  position: absolute;
  top: 7px;
  left: 250px;
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

.icon-button:disabled {
  pointer-events: none;
}

/* 横向弹出菜单 */
.skybox-menu {
  position: fixed;
  top: 4px;
  left: 290px;
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

.skybox-menu label {
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  cursor: pointer;
}

.skybox-menu label:hover {
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