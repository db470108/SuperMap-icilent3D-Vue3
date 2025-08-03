<script setup>
  import {onMounted, ref} from "vue";

  const currentTime = ref('');

  function updateTime() {
    const now = new Date();
    const date = now.toLocaleString().split(" ")[0];
    const time = now.toLocaleString().split(" ")[1];
    const year = date.split("/")[0];
    const month = date.split("/")[1];
    const day = date.split("/")[2];
    return `${year}年${month}月${day}日 ${time}`;
  }

  onMounted(() => {
    currentTime.value = updateTime(); // 初始赋值
    setInterval(() => {
      currentTime.value = updateTime(); // 每秒更新响应式变量
    }, 1000);
  });

</script>

<template>
  <div class="time-display">
    <font-awesome-icon icon="clock" class="detail-icon" />
    {{currentTime}}
  </div>
</template>

<style scoped>
  .time-display {
    position: absolute;
    top: 6px;
    right: 220px;
    font-size: 14px;
    background-color: rgba(5, 10, 25, 0.6);
    padding: 6px 12px;
    border-radius: 8px;
    color: #f4f0f0;
    z-index: 9999;
    user-select: none;
    animation: glow 2s ease-in-out infinite;
  }

  .detail-icon {
    font-size: 20px;
    color: #f4f0f0;
  }

</style>