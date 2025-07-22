<script setup>
  import { defineProps, defineEmits } from "vue";

  const props = defineProps({
    building: {
      type: Object,
      default: null
    }
  });

  const emit = defineEmits(['close']);

  function close() {
    emit('close');
  }

</script>

<template>
  <div v-if="props.building" class="info-window">
    <div class="info-card">
      <button class="close-btn" @click="close">✖</button>
      <h3>建筑信息</h3>
      <ul>
        <li><strong>名称：</strong>{{ props.building.name }}</li>
        <li><strong>楼层数：</strong>{{ props.building.floor_UGMAX }}</li>
        <li><strong>高度：</strong>{{ props.building.height }} 米</li>
        <li><strong>用途：</strong>{{ props.building.usage }}</li>
        <li><strong>录入状态：</strong>{{ props.building.录入状态 }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.info-window {
  position: fixed;
  top: 100px;
  right: 200px;
  z-index: 9999;
}

.info-card {
  background: rgba(5, 10, 25, 0.95);
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  color: white;
  width: 240px;
  animation: fadeIn 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.info-card h3 {
  margin-top: 0;
  font-size: 18px;
  margin-bottom: 12px;
}

.info-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-card li {
  font-size: 14px;
  margin-bottom: 8px;
}

.close-btn {
  position: absolute;
  top: 6px;
  right: 8px;
  background: transparent;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>