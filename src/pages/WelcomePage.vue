<script setup>
  import {useRouter} from "vue-router";
  import {ref} from "vue";

  const router = useRouter();
  const loading = ref(false);

  function enterPlatform () {
    loading.value = true;
    setTimeout(()=>{
      router.replace("/platform");
    }, 1500)
  }
</script>

<template>
  <div class="welcome-page">

    <div v-if="!loading" class="content">
      <!-- 正常欢迎内容 -->
      <!-- 左侧：文字部分 -->
      <div class="left">
        <h1>武汉市智慧城市可视化平台</h1>
        <h2>Wuhan City Visualization Platform</h2>
        <p>
          本平台融合城市三维可视化、数据治理、应急管理、智能决策等功能<br>打造数字孪生下的城市运行新范式。
        </p>
        <!-- 点击按钮，进入主页面 -->
          <button @click="enterPlatform">进入平台</button>
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
}

.left h2 {
  font-size: 24px;
  margin-top: 10px;
  color: #80d8ff;
}

.left p {
  margin-top: 24px;
  font-size: 16px;
  line-height: 1.6;
  color: #e0e0e0;
}

.left button {
  margin-top: 40px;
  padding: 14px 40px;
  font-size: 18px;
  background: #00bfff;
  border: none;
  color: #0c1c2c;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
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

/* 加载动画部分 */
.loading-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 300px;
  bottom: 200px;
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