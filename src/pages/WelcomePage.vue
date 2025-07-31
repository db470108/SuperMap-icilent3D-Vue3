<script setup>
  import {useRouter} from "vue-router";
  import {ref} from "vue";

  const router = useRouter();
  const loading = ref(false);
  const showLogin = ref(false);
  const username = ref('');
  const password = ref('');
  const userType = ref('citizen'); // citizen 或 admin
  const loginError = ref('');

  function enterPlatform () {
    loading.value = true;
    setTimeout(()=>{
      router.replace("/platform");
    }, 1000)
  }

  function toggleLogin() {
    showLogin.value = !showLogin.value;
    loginError.value = '';
  }

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
      } else {
        loginError.value = '用户名或密码错误';
      }
    }
  }
</script>

<template>
  <div class="welcome-page">
    <div v-if="!loading && !showLogin" class="content">
      <!-- 正常欢迎内容 -->
      <!-- 左侧：文字部分 -->
      <div class="left">
        <h1>武汉市智慧城市可视化平台</h1>
        <h2>Wuhan City Visualization Platform</h2>
        <p>
          本平台融合城市三维可视化、数据治理、应急管理、智能决策等功能<br>打造数字孪生下的城市运行新范式。
        </p>
        <!-- 点击按钮，进入主页面 -->
        <div class="buttons">
          <button @click="toggleLogin" class="login-btn">进入平台</button>
        </div>
      </div>
    </div>

    <!-- 登录表单 -->
    <div v-else-if="showLogin && !loading" class="login-container">
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
              行政人员
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
          <input
            id="password"
            type="password"
            v-model="password"
            placeholder="请输入密码"
            @keyup.enter="handleLogin"
          />
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
          <p>行政人员: admin / 123456</p>
        </div>
      </div>
    </div>

    <!-- 点击按钮后的加载动画 -->
    <div v-else class="loading-screen">
      <!-- 转动的圆环 -->
      <div class="spinner"></div>
      <p>正在加载平台资源，请稍后......</p>
    </div>

    <!-- 右侧：动态图或图片 -->
    <div class="right">
      <!--        <img src="@/assets/wuhan-animate.gif" alt="武汉城市图" />-->
      <!-- 或者用 <video>、Lottie 等更复杂的方案 -->
    </div>
  </div>
</template>

<style scoped>
.welcome-page {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to bottom, #0c1c2c, #1e2f4a);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Helvetica Neue', sans-serif;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  max-width: 1200px;
  pointer-events: none;
}

.left {
  flex: 1;
  padding-right: 40px;
  position: absolute;
  top: 200px;
  left: 200px;
}

.left h1 {
  font-size: 48px;
  margin: 0;
  color: #00bfff;
  user-select: none;
}

.left h2 {
  font-size: 24px;
  margin-top: 10px;
  color: #80d8ff;
  user-select: none;
}

.left p {
  margin-top: 24px;
  font-size: 16px;
  line-height: 1.6;
  color: #e0e0e0;
  user-select: none;
}

.buttons {
  margin-top: 40px;
  display: flex;
  gap: 20px;
  pointer-events: auto;
}

.left button {
  padding: 14px 40px;
  font-size: 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}

.login-btn {
  background: #00bfff;
  color: #0c1c2c;
  border: 2px solid #00bfff;
}

.left button:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 24px rgba(0, 153, 255, 0.5);
  border-color: #00c8ff;
}

.right {
  flex: 1;
  display: flex;
  justify-content: center;
}

.right img {
  max-width: 100%;
  max-height: 400px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
}

/* 登录表单样式 */
.login-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(12, 28, 44, 0.8);
  backdrop-filter: blur(5px);
  z-index: 10;
}

.login-form {
  background: rgba(30, 47, 74, 0.9);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 0 30px rgba(0, 195, 255, 0.3);
  width: 400px;
  max-width: 90%;
}

.login-form h2 {
  text-align: center;
  margin-bottom: 25px;
  color: #00bfff;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #e0e0e0;
}

.user-type-selector {
  display: flex;
  gap: 20px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.radio-label input {
  cursor: pointer;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border-radius: 5px;
  border: 1px solid #444;
  background: rgba(5, 10, 25, 0.6);
  color: white;
  font-size: 16px;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #00bfff;
  box-shadow: 0 0 0 2px rgba(0, 191, 255, 0.3);
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.submit-btn {
  flex: 1;
  padding: 12px;
  background: #00bfff;
  color: #0c1c2c;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
}

.cancel-btn {
  flex: 1;
  padding: 12px;
  background: transparent;
  color: #e0e0e0;
  border: 1px solid #666;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
}

.submit-btn:hover, .cancel-btn:hover {
  background: #00bfff;
  color: #0c1c2c;
  transform: translateY(-2px);
}

.error-message {
  color: #ff6b6b;
  text-align: center;
  margin: 15px 0;
}

.demo-accounts {
  margin-top: 25px;
  padding-top: 15px;
  border-top: 1px solid #444;
  color: #aaa;
  font-size: 14px;
}

.demo-accounts p {
  margin: 5px 0;
}

/* 加载动画部分 */
.loading-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 300px;
  bottom: 200px;
  user-select: none;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 8px solid #eee;
  border-top: 8px solid #00e3ff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin-bottom: 20px;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>