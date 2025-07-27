<script setup>
  import { defineProps, defineEmits } from "vue";
  import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

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
        <li><strong>名称：</strong>{{ props.building.type === "未录入" ? "未知" : props.building.name }} </li>
        <li><strong>楼层数：</strong>{{ props.building.type === "未录入" ? "未知" : props.building.floor }} </li>
        <li><strong>高度：</strong>{{ props.building.type === "未录入" ? "未知" : props.building.height + " 米"}} </li>
        <li><strong>录入状态：</strong>{{ props.building.type }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.info-window {
  position: fixed;
  top: 100px;
  right: 350px;
  z-index: 9999;
}

.info-card {
  background: rgba(255, 255, 255, 0.08);
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  color: white;
  width: 240px;
  animation: fadeIn 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.info-card h3 {
  margin-top: 0;
  font-size: 18px;
  color: black;
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
  color: black;
}

.close-btn {
  position: absolute;
  top: 6px;
  right: 8px;
  background: transparent;
  border: none;
  color: rgb(9, 27, 58);
  font-size: 16px;
  cursor: pointer;
  z-index: 1000;
}

.close-btn:hover {
  color: #e15151;
  transform: scale(1.1);
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