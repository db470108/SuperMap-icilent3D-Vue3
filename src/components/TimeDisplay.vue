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
    top: 65px;
    left: 20px;
    font-size: 14px;
    background-color: rgba(5, 10, 25, 0.6);;
    padding: 6px 12px;
    border-radius: 8px;
    color: #f4f0f0;
    z-index: 9999;
    user-select: none;
  }
</style>