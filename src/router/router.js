// 引入createRouter
import {createRouter, createWebHistory} from 'vue-router'

// 引入一个个可能要呈现的组件
import PlatformPage from "@/pages/PlatformPage.vue";
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
            meta: { requiresAuth: true }  // 恢复认证要求
        },

        // 重定向，每次进入到网页时，跳转到首页
        {
            path:'/',
            redirect: '/welcome',
        }

    ]
})

// 添加路由守卫
router.beforeEach((to, from, next) => {
  // 检查是否需要认证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 获取用户信息
    const user = JSON.parse(localStorage.getItem('user'));
    
    // 检查用户是否已登录
    if (!user || !user.loggedIn) {
      // 未登录则重定向到欢迎页
      next({
        path: '/welcome',
      });
    } else {
      // 已登录则允许访问
      next();
    }
  } else {
    // 不需要认证的路由直接访问
    next();
  }
});

// 把路由器暴露出去
export default router