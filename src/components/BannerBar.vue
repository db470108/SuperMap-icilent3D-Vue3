<script setup>

</script>

<template>
  <!-- 横幅条 -->
  <div class="banner-bar">

    <div class="banner-left">武汉市智慧城市平台</div>

  </div>

</template>

<style scoped>
.banner-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  box-sizing: border-box;

  backdrop-filter: blur(12px);
  background: rgba(5, 10, 25, 0.6); /* 深蓝毛玻璃 */
  border-bottom: 1px solid rgba(51, 102, 204, 0.3);
  z-index: 1000;
  /* 无法选中 */
  user-select: none;
}

.banner-left {
  font-size: 25px;
  font-weight: bold;
  color: whitesmoke;
  text-shadow: 0 0 8px rgba(51, 153, 255, 0.6);
  pointer-events: none;
  z-index: 1000;
}

</style>