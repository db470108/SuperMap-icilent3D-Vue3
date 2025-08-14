//import './assets/main.css'

import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router.js';
//引入图标库
import 'font-awesome/css/font-awesome.min.css'
import { library } from "@fortawesome/fontawesome-svg-core";
import { 
    faExpand,
    faCompress,
    faMagnifyingGlass,
    faCloud,
    faEye,
    faList,
    faXmark,
    faLocationDot,
    faBars,
    faLayerGroup,
    faUser,
    faRightFromBracket,
    faRightToBracket,
    faSun,
    faSnowflake,
    faCloudRain,
    faWind,
    faTint,
    faTemperatureHigh,
    faTemperatureLow,
    faClock,
    faEyeSlash,
    faMinus,
    faPeopleGroup,
    faHotel,
    faHouse,
    faMapLocationDot,
    faBridge,
    faLocationArrow,
    faArrowLeftLong,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css' // 引入暗黑模式CSS变量
import { createPinia } from "pinia";

// 添加图标到库中
library.add(
    faExpand,
    faCompress,
    faMagnifyingGlass,
    faCloud,
    faEye,
    faList,
    faXmark,
    faLocationDot,
    faBars,
    faLayerGroup,
    faUser,
    faRightFromBracket,
    faRightToBracket,
    faSun,
    faSnowflake,
    faCloudRain,
    faWind,
    faTint,
    faTemperatureHigh,
    faTemperatureLow,
    faClock,
    faEye,
    faEyeSlash,
    faMinus,
    faPeopleGroup,
    faHotel,
    faHouse,
    faMapLocationDot,
    faBridge,
    faLocationArrow,
    faArrowLeftLong,
);

// 创建 Vue 应用
const app = createApp(App)

const pinia = createPinia()

// 注册全局组件
app.component("font-awesome-icon", FontAwesomeIcon);

// 使用路由
app.use(router)

// 使用 Element Plus
app.use(ElementPlus)
// 引入Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 使用Pinia
app.use(pinia)

// 设置暗黑模式
// document.documentElement.classList.add('dark')

// 挂载应用
app.mount('#app')


