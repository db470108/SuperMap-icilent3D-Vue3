//import './assets/main.css'

import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router.js';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faExpand, faCompress, faMagnifyingGlass, faCloud, faEye, faList, faXmark, faLocationDot, faBars, faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css' // 引入暗黑模式CSS变量

// 添加图标到库中
library.add(faExpand, faCompress, faMagnifyingGlass, faCloud, faEye, faList, faXmark, faLocationDot, faBars, faLayerGroup);

// 创建 Vue 应用
const app = createApp(App)

// 注册全局组件
app.component("font-awesome-icon", FontAwesomeIcon);

// 使用路由
app.use(router)

// 使用 Element Plus并设置暗黑模式
app.use(ElementPlus)

// 设置暗黑模式
document.documentElement.classList.add('dark')

// 挂载应用
app.mount('#app')


