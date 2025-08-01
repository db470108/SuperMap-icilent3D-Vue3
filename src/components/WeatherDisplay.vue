<script setup>
import { onMounted, reactive } from "vue";

const weatherInfo = reactive({
  temperature: '',
  weather: '',
  city: ''
});

onMounted(() => {
  // 请求高德天气 API
  const getWeather = async (city) => {
    const key = '333e4fb15c0f6989395655e71a7915b3'; // 高德Key
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${city}&key=${key}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log('天气信息:', data);
      // 确保数据存在再赋值
      if (data.lives) {
        Object.assign(weatherInfo, data.lives[0]);
      }
    } catch (error) {
      console.error('请求失败:', error);
    }
  };

  // 调用
  getWeather('420100'); // 武汉市的 cityCode
});
</script>

<template>
  <div class="weather-display" @click="">
    {{ weatherInfo.city }}
    {{ weatherInfo.weather }}
    {{ weatherInfo.temperature }}°C
  </div>
</template>

<style scoped>
.weather-display {
  position: absolute;
  bottom: 60px;
  right: 20px;
  font-size: 14px;
  background-color: rgba(5, 10, 25, 0.6);
  padding: 6px 12px;
  border-radius: 8px;
  color: #f4f0f0;
  z-index: 9999;
  user-select: none;
  animation: glow 2s ease-in-out infinite;
}

.weather-display:hover {
  cursor: pointer;
  background-color: rgba(5, 10, 25, 0.8);
  box-shadow: 0 0 10px #00e6ff;
  transition: all 0.3s ease-in-out;
}

@keyframes glow {
  0% { text-shadow: 0 0 5px #00e6ff; }
  50% { text-shadow: 0 0 15px #00e6ff; }
  100% { text-shadow: 0 0 5px #00e6ff; }
}
</style>