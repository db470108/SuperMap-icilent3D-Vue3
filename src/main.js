//import './assets/main.css'

import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router.js';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faExpand, faCompress } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// 添加图标到库中
library.add(faExpand, faCompress);

// 创建 Vue 应用
const app = createApp(App)

// 注册全局组件
app.component("font-awesome-icon", FontAwesomeIcon);

// 使用路由
app.use(router)

// 挂载应用
app.mount('#app')
