<script setup>
  import {useRouter} from "vue-router";
  import {ref} from "vue";
  import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
  import {useUserStore} from "@/store/user.js";

  const router = useRouter();

  const loading = ref(false); // 控制加载动画是否显示

  const userStore = useUserStore();

  // 登录表单
  const showLogin = ref(false); // 控制登录窗口显示与否
  const username = ref('');
  const password = ref('');
  const userType = ref('citizen'); // 默认用户类型为“市民”
  const loginError = ref(''); // 登录失败提示文字
  const isPasswordVisible = ref(false); // 密码默认不可见

  // 登录成功后进入平台
  function enterPlatform () {
    loading.value = true;
    setTimeout(()=>{
      router.replace("/platform");
    }, 1000)
  }

  // 进入登录界面&取消登录
  function toggleLogin() {
    showLogin.value = !showLogin.value; // 控制是否显示登录界面
    loginError.value = '';
  }

  // 确认登录
  function handleLogin() {
    // 简单验证
    if (!username.value || !password.value) {
      loginError.value = '请输入用户名和密码';
      return;
    }

    // 模拟登录验证
    if (userType.value === 'citizen') {
      // 市民账户验证
      if (username.value === 'citizen' && password.value === '123456') {
        // 保存用户信息到本地存储
        localStorage.setItem('user', JSON.stringify({
          username: username.value,
          type: 'citizen',
          loggedIn: true
        }));
        enterPlatform();
        userStore.setCurrentUser(username.value);
      } else {
        loginError.value = '用户名或密码错误';
      }
    } else if (userType.value === 'admin') {
      // 行政人员账户验证
      if (username.value === 'admin' && password.value === '123456') {
        // 保存用户信息到本地存储
        localStorage.setItem('user', JSON.stringify({
          username: username.value,
          type: 'admin',
          loggedIn: true
        }));
        enterPlatform();
        userStore.setCurrentUser(username.value);
      } else {
        loginError.value = '用户名或密码错误';
      }
    }
  }

  // 切换密码可见性
  function changePasswordVisibility() {
    isPasswordVisible.value = !isPasswordVisible.value;
  }
</script>

<template>
  <div class="welcome-page">
<!--      //添加背景元素相关-->
      <div class="background-elements">
          <div class="grid-lines"></div>
          <div class="city-silhouette"></div>
          <div class="floating-icons">
              <i class="fa fa-building floating-icon" style="top: 20%; left: 15%; animation-delay: 0s;"></i>
              <i class="fa fa-tree floating-icon" style="top: 30%; left: 80%; animation-delay: 1s;"></i>
              <i class="fa fa-car floating-icon" style="top: 60%; left: 25%; animation-delay: 2s;"></i>
              <i class="fa fa-phone floating-icon" style="top: 45%; left: 65%; animation-delay: 3s;"></i>
              <i class="fa fa-cloud floating-icon" style="top: 25%; left: 45%; animation-delay: 4s;"></i>
<!--              <i class="fa fa-camera floating-icon" style="top: 25%; left: 45%; animation-delay: 4s;"></i>-->
          </div>
      </div>

    <div class="content">
      <!-- 正常欢迎内容 -->
      <!-- 左侧：文字部分 -->
        <div class="left">
            <h1>武汉市智慧城市可视化平台</h1>
            <h2>Wuhan City Visualization Platform</h2>
            <p>
                本平台融合城市三维可视化、数据治理、应急管理、智能决策等功能<br>
                打造数字孪生下的城市运行新范式。
            </p>
            <div class="buttons">
                <button @click="toggleLogin" class="login-btn">
                    进入平台 <i class="fa fa-arrow-right"></i>
                </button>
            </div>
        </div>
<!--        //添加背景元素-->
        <div class="right">
<!--            <div class="city-visualization">-->
<!--               -->
<!--            </div>-->
        </div>
    </div>

      <!-- 登录表单 -->
    <transition name="login" mode="out-in">
        <div v-if="showLogin && !loading" class="login-container">
            <div class="login-form">
                <h2>用户登录</h2>
                <div class="form-group">
                    <label>用户类型:</label>
                    <div class="user-type-selector">
                        <label class="radio-label">
                            <input type="radio" v-model="userType" value="citizen">
                            市民
                        </label>
                        <label class="radio-label">
                            <input type="radio" v-model="userType" value="admin">
                            管理员
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label for="username">用户名:</label>
                    <input
                            id="username"
                            type="text"
                            v-model="username"
                            placeholder="请输入用户名"
                            @keyup.enter="handleLogin"
                    />
                </div>

                <div class="form-group">
                    <label for="password">密码:</label>
                    <div class="password-wrapper">
                        <input
                                id="password"
                                :type="isPasswordVisible ? 'text' : 'password'"
                                v-model="password"
                                placeholder="请输入密码"
                                @keyup.enter="handleLogin"
                        />
                        <i
                                class="fa password-toggle"
                                :class="isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'"
                                @click="changePasswordVisibility"
                        ></i>
                    </div>
                </div>

                <div v-if="loginError" class="error-message">
                    {{ loginError }}
                </div>

                <div class="form-actions">
                    <button @click="handleLogin" class="submit-btn">登录</button>
                    <button @click="toggleLogin" class="cancel-btn">取消</button>
                </div>

                <div class="demo-accounts">
                    <p>演示账户:</p>
                    <p>市民: citizen / 123456</p>
                    <p>管理员: admin / 123456</p>
                </div>
            </div>
        </div>
    </transition>


<!--    //载入动画-->
    <transition name="loading">
        <div v-if="loading" class="loading-screen">
            <div class="spinner"></div>
            <p>正在加载平台资源，请稍后...</p>
            <p>智慧城市系统启动中，预计需要 <strong>3-5</strong> 秒</p>
        </div>
    </transition>



  </div>
</template>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    overflow: hidden;
    font-family: 'Microsoft YaHei', 'Segoe UI', sans-serif;
    background: #0c1c2c;
    color: white;
}

#app {
    width: 100vw;
    height: 100vh;
    position: relative;
}

.welcome-page {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #0c1c2c 0%, #1e2f4a 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
}

/* 背景装饰元素 */
.background-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    overflow: hidden;
}

.grid-lines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:
            linear-gradient(rgba(0, 191, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 191, 255, 0.05) 1px, transparent 1px);
    background-size: 40px 40px;
    z-index: 1;
}

.city-silhouette {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40%;
    background: linear-gradient(to top, rgba(0, 100, 150, 0.3), transparent);
    z-index: 2;
}

.floating-icons {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
}

.floating-icon {
    position: absolute;
    color: rgba(0, 191, 255, 0.3);
    font-size: 1.8rem;
    animation: float 15s infinite linear;
}

@keyframes float {
    0% {
        transform: translateY(0) translateX(0);
    }
    25% {
        transform: translateY(-20px) translateX(15px);
    }
    50% {
        transform: translateY(-40px) translateX(0);
    }
    75% {
        transform: translateY(-20px) translateX(-15px);
    }
    100% {
        transform: translateY(0) translateX(0);
    }
}

.content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 85%;
    max-width: 1400px;
    position: relative;
    z-index: 10;
}

.left {
    flex: 1;
    padding-right: 40px;
    animation: fadeInUp 1.2s ease-out forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.left h1 {
    font-size: 3.5rem;
    margin: 0;
    color: #00bfff;
    line-height: 1.2;
    text-shadow: 0 0 15px rgba(0, 191, 255, 0.4);
    background: linear-gradient(90deg, #00bfff, #80d8ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.left h2 {
    font-size: 1.8rem;
    margin-top: 15px;
    color: #80d8ff;
    font-weight: 400;
    letter-spacing: 1px;
}

.left p {
    margin-top: 30px;
    font-size: 1.15rem;
    line-height: 1.8;
    color: #cceeff;
    max-width: 600px;
}

.buttons {
    margin-top: 45px;
    display: flex;
    gap: 20px;
}

.login-btn {
    padding: 16px 45px;
    font-size: 1.1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.4s;
    background: linear-gradient(135deg, #00bfff, #0088ff);
    color: white;
    font-weight: 500;
    box-shadow: 0 5px 20px rgba(0, 136, 255, 0.4);
    position: relative;
    overflow: hidden;
    z-index: 1;
}

.login-btn::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #0088ff, #00bfff);
    z-index: -1;
    opacity: 0;
    transition: opacity 0.4s;
}

.login-btn:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 153, 255, 0.6);
}

.login-btn:hover::after {
    opacity: 1;
}

.right {
    flex: 1;
    display: flex;
    justify-content: center;
    position: relative;
}

.city-visualization {
    width: 100%;
    max-width: 600px;
    height: 400px;
    background: rgba(0, 50, 80, 0.2);
    border-radius: 15px;
    border: 1px solid rgba(0, 191, 255, 0.2);
    position: relative;
    overflow: hidden;
    box-shadow: 0 0 40px rgba(0, 100, 255, 0.3);
}

.building {
    position: absolute;
    bottom: 0;
    background: rgba(0, 150, 200, 0.6);
    border: 1px solid rgba(0, 200, 255, 0.4);
}

/* 登录表单动画 */
.login-enter-active {
    animation: loginIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.login-leave-active {
    animation: loginOut 0.4s cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards;
}

@keyframes loginIn {
    0% {
        opacity: 0;
        transform: translateY(50px) scale(0.95);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes loginOut {
    0% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
    100% {
        opacity: 0;
        transform: translateY(-50px) scale(0.95);
    }
}

.login-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(12, 28, 44, 0.9);
    backdrop-filter: blur(8px);
    z-index: 20;
}

.login-form {
    background: rgba(20, 40, 70, 0.95);
    padding: 35px;
    border-radius: 15px;
    box-shadow: 0 0 40px rgba(0, 150, 255, 0.4);
    width: 420px;
    max-width: 90%;
    border: 1px solid rgba(0, 191, 255, 0.3);
}

.login-form h2 {
    text-align: center;
    margin-bottom: 28px;
    color: #00bfff;
    font-size: 1.8rem;
}

.form-group {
    margin-bottom: 22px;
}

.form-group label {
    display: block;
    margin-bottom: 10px;
    color: #b0e0ff;
    font-size: 1rem;
}

.password-wrapper {
    position: relative;
}

.form-group input {
    width: 100%;
    padding: 14px;
    border-radius: 8px;
    border: 1px solid rgba(0, 150, 200, 0.5);
    background: rgba(5, 15, 30, 0.7);
    color: white;
    font-size: 1rem;
    transition: all 0.3s;
}

.form-group input:focus {
    outline: none;
    border-color: #00bfff;
    box-shadow: 0 0 0 3px rgba(0, 191, 255, 0.3);
}

.password-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #80d8ff;
    cursor: pointer;
}

.user-type-selector {
    display: flex;
    gap: 20px;
    margin-top: 8px;
}

.radio-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 10px 15px;
    background: rgba(10, 30, 60, 0.6);
    border-radius: 8px;
    border: 1px solid rgba(0, 150, 200, 0.3);
    flex: 1;
    transition: all 0.3s;
}

.radio-label input[type="radio"] {
    accent-color: #00bfff;
}

.radio-label:hover, .radio-label:has(input:checked) {
    background: rgba(0, 100, 180, 0.4);
    border-color: #00bfff;
}

.form-actions {
    display: flex;
    gap: 15px;
    margin-top: 30px;
}

.submit-btn, .cancel-btn {
    flex: 1;
    padding: 14px;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: 500;
}

.submit-btn {
    background: linear-gradient(135deg, #00bfff, #0077ff);
    color: white;
    border: none;
    box-shadow: 0 4px 15px rgba(0, 136, 255, 0.4);
}

.submit-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 136, 255, 0.6);
}

.cancel-btn {
    background: transparent;
    color: #80d8ff;
    border: 1px solid rgba(0, 150, 200, 0.5);
}

.cancel-btn:hover {
    background: rgba(0, 100, 150, 0.2);
    border-color: #00bfff;
}

.error-message {
    color: #ff6b6b;
    text-align: center;
    margin: 20px 0 5px;
    font-size: 0.95rem;
}

.demo-accounts {
    margin-top: 25px;
    padding-top: 20px;
    border-top: 1px solid rgba(0, 150, 200, 0.3);
    color: #80d8ff;
    font-size: 0.9rem;
    /*text-align: center;*/
}

.demo-accounts p {
    margin: 6px 0;
}

/* 加载动画 */
.loading-enter-active {
    animation: loadingIn 0.5s ease-out forwards;
}

.loading-leave-active {
    animation: loadingOut 0.4s ease-in forwards;
}

@keyframes loadingIn {
    0% {
        opacity: 0;
        transform: scale(0.9);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes loadingOut {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}

.loading-screen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgba(12, 28, 44, 0.95);
    backdrop-filter: blur(10px);
    z-index: 30;
}

.spinner {
    width: 70px;
    height: 70px;
    border: 5px solid rgba(255, 255, 255, 0.1);
    border-top: 5px solid #00e3ff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 25px;
    box-shadow: 0 0 20px rgba(0, 227, 255, 0.5);
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.loading-screen p {
    font-size: 1.2rem;
    color: #80d8ff;
    text-align: center;
    max-width: 400px;
    margin-top: 20px;
    line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 1024px) {
    .content {
        flex-direction: column;
        text-align: center;
        padding: 20px;
    }

    .left {
        padding-right: 0;
        margin-bottom: 40px;
    }

    .buttons {
        justify-content: center;
    }

    .left h1 {
        font-size: 2.8rem;
    }

    .left h2 {
        font-size: 1.5rem;
    }
}

@media (max-width: 768px) {
    .left h1 {
        font-size: 2.2rem;
    }

    .login-form {
        width: 90%;
        padding: 25px;
    }

    .user-type-selector {
        flex-direction: column;
        gap: 10px;
    }
}
</style>