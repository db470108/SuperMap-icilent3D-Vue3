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
    <button class="glow-button" @click="toggleMenu">场景设置</button>
    <transition name="fade-slide">
      <ul class="dropdown-menu" v-if="menuVisible">

        <li>
          <input type="checkbox" v-model="showSkyBox" @change="changeSkyBox">
          天空盒
        </li>

        <hr v-if="showSkyBox">

        <li v-if="showSkyBox">
          <input type="radio" value="day" v-model="skyBoxMode" @change="changeDayOrNight">
          白天
        </li>

        <li v-if="showSkyBox">
          <input type="radio" value="night" v-model="skyBoxMode" @change="changeDayOrNight">
          夜晚
        </li>

        <hr v-if="showSkyBox">

        <li v-if="showSkyBox">
          <input type="radio" value="clear" v-model="weatherMode" @change="changeWeatherMode">
          晴
        </li>

        <li v-if="showSkyBox">
          <input type="radio" value="rain" v-model="weatherMode" @change="changeWeatherMode">
          雨
        </li>

        <li v-if="showSkyBox">
          <input type="radio" value="snow" v-model="weatherMode" @change="changeWeatherMode">
          雪
        </li>
      </ul>
    </transition>
  </div>

</template>

<style scoped>
.scene-control {
  display: inline-block;
  z-index: 2000;
  position: absolute;
  top: 8px;
  right: 400px;
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