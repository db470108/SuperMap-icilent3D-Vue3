<script setup>
  import {onMounted, ref} from "vue";

  let currentTime = ref("")

  function updateTime() {
    const now = new Date();
    currentTime.value = now.toLocaleString();
  }

  onMounted(() => {
    updateTime();
    setInterval(updateTime, 1000); // 每秒更新
  });
</script>

<template>
  <div class="time-display">
    {{currentTime}}
  </div>
</template>

<style scoped>
  .time-display {
    position: absolute;
    bottom: 20px;
    right: 20px;
    font-size: 14px;
    background-color: rgba(5, 10, 25, 0.6);
    padding: 6px 12px;
    border-radius: 8px;
    color: #f4f0f0;
    z-index: 9999;
    user-select: none;
    animation: glow 2s ease-in-out infinite;
  }

  @keyframes glow {
    0% { text-shadow: 0 0 5px #00e6ff; }
    50% { text-shadow: 0 0 15px #00e6ff; }
    100% { text-shadow: 0 0 5px #00e6ff; }
  }
</style>