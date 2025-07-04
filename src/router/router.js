// 引入createRouter
import {createRouter, createWebHistory} from 'vue-router'

// 引入一个个可能要呈现的组件
import PlatformPage from "@/pages/PlatformPage.vue";
import SceneViewer3D from "@/components/SceneViewer3D.vue";
import WelcomePage from "@/pages/WelcomePage.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        // 首页（欢迎页）
        {
            name: 'WelcomePage',
            path: '/welcome',
            component: WelcomePage,
        },

        // 主页面
        {
            name: 'PlatformPage',
            path: '/platform',
            component: PlatformPage,
        },


        // 三维场景页面
        {
            name: 'SceneViewer3D',
            path: '/scene3D',
            component: SceneViewer3D,
        },


        // 重定向，每次进入到网页时，跳转到首页
        {
            path:'/',
            redirect: '/welcome',
        }

    ]
})

// 把路由器暴露出去
export default router