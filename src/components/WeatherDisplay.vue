<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import * as echarts from 'echarts';
import {usePanelStore} from "@/store/panel.js";
import {useWeatherStore} from "@/store/weather.js";
import {useUserStore} from "@/store/user.js";

const panelStore = usePanelStore();
const weatherStore = useWeatherStore();
const userStore = useUserStore(); //用户类型

//根据用户类型显示不同主题
const themeType = ref([
  {backgroundColor: '', textColor: '', iconColor: ''}
]);
watch(() => userStore.currentUser, (newType) => {
  if (newType === 'admin') {
    themeType.value.textColor = '#f4f0f0';
    themeType.value.backgroundColor = 'rgba(5, 10, 25, 0.7)';
    themeType.value.iconColor = '#f4f0f0';
  } else if (newType === 'citizen') {
    themeType.value.textColor = '#454545';
    themeType.value.backgroundColor = '#f4f0f0';
    themeType.value.iconColor = '#409EFF';
  }
}, {immediate: true})

const weatherInfo = reactive({}); // 实时天气信息{}对象

const forecastInfo = ref([]); // 天气预报信息[]数组
let chart = null; // 图表实例

// 切换详细面板显示
function toggleDetailPanel() {
  panelStore.togglePanel('weather');
  console.log("当前打开的面板为：", panelStore.activePanel);
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
      forecastInfo.value = data.forecasts[0].casts;
    }

  } catch (error) {
    console.error('请求天气预报失败:', error);
  }
};

// 格式化日期，去除‘-’，并加上月日
function formatDate(date) {
  const parts = date.split('-');
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  return `${year}年${month}月${day}日`;
}

// 格式化星期几
function formatWeekday(day) {
  switch (day) {
    case '1':
      return '星期一';
    case '2':
      return '星期二';
    case '3':
      return '星期三';
    case '4':
      return '星期四';
    case '5':
      return '星期五';
    case '6':
      return '星期六';
    case '7':
      return '星期日';
    default:
      return '';
  }
}

// 初始化图表
function initChart() {
  if (!forecastInfo.value.length) return;

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
      const dates = forecastInfo.value.map(item => item.date);
      const highs = forecastInfo.value.map(item => parseInt(item.daytemp));
      const lows = forecastInfo.value.map(item => parseInt(item.nighttemp));

      const option = {
        title: {
          text: '武汉未来天气预报',
          textStyle: {
            color: themeType.value.textColor,
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: [
            {name: '最高温度', textStyle: { color: themeType.value.textColor }},
            {name: '最低温度', textStyle: { color: themeType.value.textColor }}
          ],

        },
        xAxis: {
          type: 'category',
          data: dates,
          axisLabel: {
            color: themeType.value.textColor,
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: themeType.value.textColor,
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
  if (panelStore.activePanel === 'weather' && forecastInfo.value.length > 0) {
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
    <div
        class="weather-display"
        :class="{ active: panelStore.activePanel === 'weather'}"
        @click="toggleDetailPanel"
        v-if="weatherInfo.city"
        :title="'点击查看天气详情'"
    >
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
      <div
          v-if="panelStore.activePanel === 'weather'"
          :class="[userStore.currentUser === 'admin' ? 'weather-detail-panel-theme-admin' : 'weather-detail-panel-theme-citizen']"
      >
        <div class="panel-header">
          <h2 :class="[userStore.currentUser === 'admin' ? 'weather-h2-theme-admin' : 'weather-h2-theme-citizen']">武汉市天气详情</h2>
          <button class="close-btn" @click="closeDetailPanel">
            <font-awesome-icon icon="xmark" />
          </button>
        </div>

        <div class="current-weather">
          <div class="current-main">
            <font-awesome-icon
                :icon="getWeatherIcon(weatherInfo.weather)"
                :class="[userStore.currentUser === 'admin' ? 'large-icon-theme-admin' : 'large-icon-theme-citizen']"
            />
            <div
                :class="[userStore.currentUser === 'admin' ? 'temperature-theme-admin' : 'temperature-theme-citizen']"
            >
              {{ weatherInfo.temperature }}°C
            </div>
            <div
                :class="[userStore.currentUser === 'admin' ? 'weather-description-theme-admin' : 'weather-description-theme-citizen']"
            >
              {{ weatherInfo.weather }}
            </div>
          </div>

          <div class="current-details">
            <div class="detail-item">
              <font-awesome-icon icon="tint" :class="[userStore.currentUser === 'admin' ? 'detail-icon-theme-admin' : 'detail-icon-theme-citizen']" />
              <div class="detail-info">
                <div :class="[userStore.currentUser === 'admin' ? 'detail-label-theme-admin' : 'detail-label-theme-citizen']">湿度</div>
                <div :class="[userStore.currentUser === 'admin' ? 'detail-value-theme-admin' : 'detail-value-theme-citizen']">{{ weatherInfo.humidity }}%</div>
              </div>
            </div>

            <div class="detail-item">
              <font-awesome-icon icon="wind" :class="[userStore.currentUser === 'admin' ? 'detail-icon-theme-admin' : 'detail-icon-theme-citizen']" />
              <div class="detail-info">
                <div :class="[userStore.currentUser === 'admin' ? 'detail-label-theme-admin' : 'detail-label-theme-citizen']">风向</div>
                <div :class="[userStore.currentUser === 'admin' ? 'detail-value-theme-admin' : 'detail-value-theme-citizen']">{{ weatherInfo.winddirection }}</div>
              </div>
            </div>

            <div class="detail-item">
              <font-awesome-icon icon="wind" :class="[userStore.currentUser === 'admin' ? 'detail-icon-theme-admin' : 'detail-icon-theme-citizen']" />
              <div class="detail-info">
                <div :class="[userStore.currentUser === 'admin' ? 'detail-label-theme-admin' : 'detail-label-theme-citizen']">风力</div>
                <div :class="[userStore.currentUser === 'admin' ? 'detail-value-theme-admin' : 'detail-value-theme-citizen']">{{ weatherInfo.windpower }}</div>
              </div>
            </div>

            <div class="detail-item">
              <font-awesome-icon icon="clock" :class="[userStore.currentUser === 'admin' ? 'detail-icon-theme-admin' : 'detail-icon-theme-citizen']" />
              <div class="detail-info">
                <div :class="[userStore.currentUser === 'admin' ? 'detail-label-theme-admin' : 'detail-label-theme-citizen']">更新时间</div>
                <div :class="[userStore.currentUser === 'admin' ? 'detail-value-theme-admin' : 'detail-value-theme-citizen']">
                  {{
                    weatherInfo.reporttime.split('-')[0] + "/" +
                    weatherInfo.reporttime.split('-')[1] + "/" +
                    weatherInfo.reporttime.split('-')[2]
                  }}
                </div>
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
          <h3 :class="[userStore.currentUser === 'admin' ? 'forecast-h3-theme-admin' : 'forecast-h3-theme-citizen']">未来几天预报</h3>
          <div class="forecast-list">
            <div
              v-for="(forecast, index) in forecastInfo"
              :key="index"
              class="forecast-item"
            >
              <div :class="[userStore.currentUser === 'admin' ? 'forecast-date-theme-admin' : 'forecast-date-theme-citizen']">{{ formatDate(forecast.date) }}</div>
              <div :class="[userStore.currentUser === 'admin' ? 'forecast-day-theme-admin' : 'forecast-day-theme-citizen']">{{ formatWeekday(forecast.week) }}</div>
              <div class="forecast-weather">
                <font-awesome-icon
                    :icon="getWeatherIcon(forecast.dayweather)"
                    :class="[userStore.currentUser === 'admin' ? 'forecast-icon-theme-admin' : 'forecast-icon-theme-citizen']" />
              </div>
              <div class="forecast-temp">
                <span class="high-temp">{{ forecast.daytemp }}°</span>
                <span class="low-temp">{{ forecast.nighttemp }}°</span>
              </div>
              <div :class="[userStore.currentUser === 'admin' ? 'forecast-desc-theme-admin' : 'forecast-desc-theme-citizen']">{{ forecast.dayweather }}</div>
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
  top: 6px;
  right: 50px;
  font-size: 14px;
  /*background-color: rgba(5, 10, 25, 0.6);*/
  border: 1px solid rgba(51, 102, 204, 0.3);
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

.weather-display.active {
  box-shadow: 0 0 10px #f4f0f0;
}

.weather-icon {
  font-size: 16px;
  color: #f4f0f0;
}

.weather-display:hover {
  cursor: pointer;
  /*background-color: rgba(5, 10, 25, 0.8);*/
  box-shadow: 0 0 10px #f4f0f0;
  transition: all 0.3s ease-in-out;
}

/* 详细天气面板 */
.weather-detail-panel-theme-citizen {
  position: absolute;
  top: 50px;
  right: 20px;
  width: 460px;
  max-height: 690px;
  background: #f4f0f0;
  backdrop-filter: blur(12px);
  border: 1px solid #f4f0f0;
  border-radius: 12px;
  padding: 20px;
  z-index: 10000;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  user-select: none;
}

.weather-detail-panel-theme-admin {
  position: absolute;
  top: 50px;
  right: 20px;
  width: 460px;
  max-height: 690px;
  background: rgba(5, 10, 25, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid #f4f0f0;
  border-radius: 12px;
  padding: 20px;
  z-index: 10000;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  user-select: none;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.weather-h2-theme-citizen {
  margin: 0;
  font-size: 20px;
  color: #454545;
}

.weather-h2-theme-admin {
  margin: 0;
  font-size: 20px;
  color: #f4f0f0;
}

.close-btn {
  background: transparent;
  border: none;
  color: #454545;
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

.large-icon-theme-citizen {
  font-size: 48px;
  /*color: rgba(51, 153, 255, 0.7);*/
  color: #409EFF;
  margin-bottom: 10px;
}

.large-icon-theme-admin {
  font-size: 48px;
  color: #f4f0f0;
  margin-bottom: 10px;
}

.temperature-theme-citizen {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #454545;
}

.temperature-theme-admin {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #f4f0f0;
}

.weather-description-theme-citizen {
  font-size: 18px;
  color: #454545;
}

.weather-description-theme-admin {
  font-size: 18px;
  color: #f4f0f0;
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

.detail-icon-theme-citizen {
  font-size: 20px;
  color: #409EFF;
}

.detail-icon-theme-admin {
  font-size: 20px;
  color: #f4f0f0;
}

.detail-info {
  display: flex;
  flex-direction: column;
}

.detail-label-theme-citizen {
  font-size: 12px;
  color: #454545;
  font-weight: bold;
}

.detail-label-theme-admin {
  font-size: 12px;
  color: #f4f0f0;
  font-weight: bold;
}

.detail-value-theme-citizen {
  font-size: 15px;
  font-weight: bold;
  color: #454545;
}

.detail-value-theme-admin {
  font-size: 15px;
  font-weight: bold;
  color: #f4f0f0;
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

.forecast-h3-theme-citizen {
  margin: 0 0 15px 0;
  color: #454545;
  font-size: 18px;
}

.forecast-h3-theme-admin {
  margin: 0 0 15px 0;
  color: #f4f0f0;
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

.forecast-date-theme-citizen {
  font-size: 12px;
  color: #454545;
  margin-bottom: 5px;
}

.forecast-date-theme-admin {
  font-size: 12px;
  color: #f4f0f0;
  margin-bottom: 5px;
}

.forecast-day-theme-citizen {
  font-size: 13px;
  color: #454545;
  margin-bottom: 5px;
}

.forecast-day-theme-admin {
  font-size: 13px;
  color: #f4f0f0;
  margin-bottom: 5px;
}

.forecast-icon-theme-citizen {
  font-size: 24px;
  /*color: rgba(51, 153, 255, 0.7);*/
  color: #409EFF;
  margin: 5px 0;
}

.forecast-icon-theme-admin {
  font-size: 24px;
  color: #f4f0f0;
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

.forecast-desc-theme-citizen {
  font-size: 12px;
  color: #454545;
  font-weight: bold;
}
.forecast-desc-theme-admin {
  font-size: 12px;
  color: #f4f0f0;
  font-weight: bold;
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