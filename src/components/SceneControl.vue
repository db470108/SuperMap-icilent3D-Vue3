<script setup>
import {ref} from "vue";

  // 根据建筑物信息窗口弹出与否，判断是否禁用按钮
  const props = defineProps({
    disableButtons: Boolean
  });

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
        class="glow-button"
        :class="{active: menuVisible}"
        @click="toggleMenu"
        :disabled="props.disableButtons"
    >
      场景设置
    </button>
    <transition name="fade-slide" mode="out-in">
      <ul class="dropdown-menu" v-show="menuVisible">

        <li>
          <input type="checkbox" v-model="showSkyBox" @change="changeSkyBox">
          天空
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
          晴天
        </li>

        <li v-if="showSkyBox">
          <input type="radio" value="rain" v-model="weatherMode" @change="changeWeatherMode">
          雨天
        </li>

        <li v-if="showSkyBox">
          <input type="radio" value="snow" v-model="weatherMode" @change="changeWeatherMode">
          雪天
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
  top: 5px;
  right: 400px;
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
  backdrop-filter: blur(10px);
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

.glow-button:disabled {
  background-color: #272727;
  color: #878787;
  pointer-events: none;
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
  backdrop-filter: blur(10px);
}

.dropdown-menu li {
  display: flex;
  align-items: center;
  padding: 8px 15px;
  font-size: 14px;
  color: #ffffff; /* 修改为显眼的颜色，匹配按钮的橙色渐变风格 */
  transition: background 0.3s, transform 0.2s;
  cursor: pointer;
}

.dropdown-menu li:hover {
  background: rgba(0, 119, 255, 0.1);
  transform: translateX(5px);
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