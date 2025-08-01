<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import * as echarts from 'echarts';
import {usePanelStore} from "@/store/panel.js";
import {useWeatherStore} from "@/store/weather.js";

const panelStore = usePanelStore();
const weatherStore = useWeatherStore();

const weatherInfo = reactive([]);

const forecastInfo = reactive([]); // 天气预报信息
let chart = null; // 图表实例

// 切换详细面板显示
function toggleDetailPanel() {
  panelStore.togglePanel('weather');
  console.log("当前打开的面板为：", panelStore.activePanel)
}

// 获取当前天气
const getCurrentWeather = async (city) => {
  const key = '333e4fb15c0f6989395655e71a7915b3'; // 高德Key
  const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${city}&key=${key}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('当前天气信息:', data);
    // 确保数据存在再赋值
    if (data.lives && data.lives.length > 0) {
      Object.assign(weatherInfo, data.lives[0]);
      // 更新store中的天气
      weatherStore.setCurrentWeather(weatherInfo.weather);
    }

  } catch (error) {
    console.error('请求当前天气失败:', error);
  }
};

// 获取天气预报
const getForecastWeather = async (city) => {
  const key = '333e4fb15c0f6989395655e71a7915b3'; // 高德Key
  const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${city}&key=${key}&extensions=all`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('天气预报信息:', data);
    // 确保数据存在再赋值
    if (data.forecasts && data.forecasts.length > 0) {
      Object.assign(forecastInfo, data.forecasts[0].casts);
    }

  } catch (error) {
    console.error('请求天气预报失败:', error);
  }
};

// 初始化图表
function initChart() {
  if (!forecastInfo.length) return;

  // 使用 nextTick 确保 DOM 已更新
  setTimeout(() => {
    const chartDom = document.getElementById('weather-chart');
    if (chartDom) {
      // 如果图表已经存在，先销毁
      if (chart) {
        chart.dispose();
      }

      chart = echarts.init(chartDom);

      // 处理数据
      const dates = forecastInfo.map(item => item.date);
      const highs = forecastInfo.map(item => parseInt(item.daytemp));
      const lows = forecastInfo.map(item => parseInt(item.nighttemp));

      const option = {
        title: {
          text: '武汉未来天气预报',
          textStyle: {
            color: '#f4f0f0',
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['最高温度', '最低温度'],
          textStyle: {
            color: '#f4f0f0'
          }
        },
        xAxis: {
          type: 'category',
          data: dates,
          axisLabel: {
            color: '#f4f0f0'
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#f4f0f0',
            formatter: '{value} °C'
          }
        },
        series: [
          {
            name: '最高温度',
            type: 'line',
            data: highs,
            smooth: true,
            itemStyle: { color: '#ff9900' },
            areaStyle: { color: 'rgba(255, 153, 0, 0.3)' }
          },
          {
            name: '最低温度',
            type: 'line',
            data: lows,
            smooth: true,
            itemStyle: { color: '#4aa8a8' },
            areaStyle: { color: 'rgba(74, 168, 168, 0.3)' }
          }
        ]
      };

      chart.setOption(option);

      // 监听窗口大小变化
      window.addEventListener('resize', () => {
        if (chart) {
          chart.resize();
        }
      });
    }
  }, 100);
}

// 获取天气图标
function getWeatherIcon(weather) {
  if (!weather) return 'cloud';

  if (weather.includes('晴')) {
    return 'sun';
  } else if (weather.includes('云')) {
    return 'cloud';
  } else if (weather.includes('雨')) {
    return 'cloud-rain';
  } else if (weather.includes('雪')) {
    return 'snowflake';
  } else {
    return 'cloud';
  }
}

// 关闭详细面板
function closeDetailPanel() {
  panelStore.closePanel();
}

// 清理图表资源
function cleanupChart() {
  if (chart) {
    chart.dispose();
    chart = null;
  }
}

// 在面板打开动画完成后初始化图表
function handleEnterFinished() {
  if (panelStore.activePanel === 'weather' && forecastInfo.length > 0) {
    initChart();
  }
}

// 监听面板状态变化
watch(() => panelStore.activePanel, (newPanel) => {
    if (newPanel === 'weather') {
      // 面板打开时获取天气预报数据
      getForecastWeather('420100');
    } else {
      // 面板关闭时清理图表
      cleanupChart();
    }
  }
);

onMounted(() => {
  // 获取当前天气
  getCurrentWeather('420100'); // 武汉市的 cityCode:420100

  // 每30分钟更新一次天气
  setInterval(() => {
    getCurrentWeather('420100');
  }, 30 * 60 * 1000);
});
</script>

<template>
  <div>
    <!-- 简要天气信息 -->
    <div class="weather-display" @click="toggleDetailPanel" v-if="weatherInfo.city" :title="'点击查看天气详情'">
      <font-awesome-icon :icon="getWeatherIcon(weatherInfo.weather)" class="weather-icon" />
      {{ weatherInfo.city }}
      {{ weatherInfo.weather }}
      {{ weatherInfo.temperature }}°C
    </div>

    <!-- 详细天气信息面板 -->
    <transition
      name="weather-panel"
      @after-leave="cleanupChart"
      @after-enter="handleEnterFinished"
    >
      <div v-if="panelStore.activePanel === 'weather'" class="weather-detail-panel">
        <div class="panel-header">
          <h2>武汉市天气详情</h2>
          <button class="close-btn" @click="closeDetailPanel">
            <font-awesome-icon icon="xmark" />
          </button>
        </div>

        <div class="current-weather">
          <div class="current-main">
            <font-awesome-icon :icon="getWeatherIcon(weatherInfo.weather)" class="large-weather-icon" />
            <div class="temperature">{{ weatherInfo.temperature }}°C</div>
            <div class="weather-description">{{ weatherInfo.weather }}</div>
          </div>

          <div class="current-details">
            <div class="detail-item">
              <font-awesome-icon icon="tint" class="detail-icon" />
              <div class="detail-info">
                <div class="detail-label">湿度</div>
                <div class="detail-value">{{ weatherInfo.humidity }}%</div>
              </div>
            </div>

            <div class="detail-item">
              <font-awesome-icon icon="wind" class="detail-icon" />
              <div class="detail-info">
                <div class="detail-label">风向</div>
                <div class="detail-value">{{ weatherInfo.winddirection }}</div>
              </div>
            </div>

            <div class="detail-item">
              <font-awesome-icon icon="wind" class="detail-icon" />
              <div class="detail-info">
                <div class="detail-label">风力</div>
                <div class="detail-value">{{ weatherInfo.windpower }}</div>
              </div>
            </div>

            <div class="detail-item">
              <font-awesome-icon icon="clock" class="detail-icon" />
              <div class="detail-info">
                <div class="detail-label">更新时间</div>
                <div class="detail-value">{{ weatherInfo.reporttime }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 天气图表 -->
        <div class="weather-chart-container">
          <div id="weather-chart" class="weather-chart"></div>
        </div>

        <!-- 未来几天天气预报 -->
        <div class="forecast">
          <h3>未来几天预报</h3>
          <div class="forecast-list">
            <div
              v-for="(forecast, index) in forecastInfo"
              :key="index"
              class="forecast-item"
            >
              <div class="forecast-date">{{ forecast.date }}</div>
              <div class="forecast-weather">
                <font-awesome-icon :icon="getWeatherIcon(forecast.dayweather)" class="forecast-icon" />
              </div>
              <div class="forecast-temp">
                <span class="high-temp">{{ forecast.daytemp }}°</span>
                <span class="low-temp">{{ forecast.nighttemp }}°</span>
              </div>
              <div class="forecast-desc">{{ forecast.dayweather }}</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
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
  display: flex;
  align-items: center;
  gap: 5px;
}

.weather-icon {
  font-size: 16px;
  color: rgba(51, 153, 255, 0.7);
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

/* 详细天气面板 */
.weather-detail-panel {
  position: absolute;
  bottom: 95px;
  right: 20px;
  width: 480px;
  max-height: 80vh;
  background: rgba(5, 10, 25, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(51, 102, 204, 0.3);
  border-radius: 12px;
  padding: 20px;
  color: #f4f0f0;
  z-index: 10000;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-header h2 {
  margin: 0;
  font-size: 20px;
  color: rgba(51, 153, 255, 0.7);
}

.close-btn {
  background: transparent;
  border: none;
  color: #f4f0f0;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
}

.close-btn:hover {
  color: #e15151;
}

/* 当前天气 */
.current-weather {
  display: flex;
  margin-bottom: 20px;
}

.current-main {
  flex: 1;
  text-align: center;
  padding: 10px;
}

.large-weather-icon {
  font-size: 48px;
  color: rgba(51, 153, 255, 0.7);
  margin-bottom: 10px;
}

.temperature {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 5px;
}

.weather-description {
  font-size: 18px;
  color: #aaa;
}

.current-details {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.detail-icon {
  font-size: 20px;
  color: rgba(51, 153, 255, 0.7);
}

.detail-info {
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-size: 12px;
  color: #aaa;
  font-weight: bold;
}

.detail-value {
  font-size: 14px;
  font-weight: bold;
}

/* 天气图表 */
.weather-chart-container {
  margin: 20px 0;
  height: 200px;
}

.weather-chart {
  width: 100%;
  height: 100%;
}

/* 天气预报 */
.forecast {
  margin-top: 20px;
}

.forecast h3 {
  margin: 0 0 15px 0;
  color: rgba(51, 153, 255, 0.7);
  font-size: 18px;
}

.forecast-list {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.forecast-item {
  flex: 1;
  min-width: 80px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 10px;
  text-align: center;
}

.forecast-date {
  font-size: 12px;
  color: #aaa;
  margin-bottom: 5px;
}

.forecast-icon {
  font-size: 24px;
  color: rgba(51, 153, 255, 0.7);
  margin: 5px 0;
}

.forecast-temp {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin: 5px 0;
}

.high-temp {
  font-weight: bold;
  color: #ff9900;
}

.low-temp {
  color: rgba(51, 153, 255, 0.7);
}

.forecast-desc {
  font-size: 12px;
  color: #aaa;
}

/* 渐进过渡动画 */
.weather-panel-enter-active {
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.weather-panel-leave-active {
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.weather-panel-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  filter: blur(5px);
}

.weather-panel-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
}

.weather-panel-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
}

.weather-panel-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  filter: blur(5px);
}
</style>