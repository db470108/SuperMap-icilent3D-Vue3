<script setup>
  import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
  import {usePanelStore} from "@/store/panel.js";

  const props = defineProps({
    building: {
      type: Object,
      default: null
    }
  });

  const panelStore = usePanelStore();

  const emit = defineEmits(['close']);

  function close() {
    emit('close');
    panelStore.closePanel();
  }

</script>

<template>
  <div v-if="props.building && (panelStore.activePanel === 'doubleClickSearch' || panelStore.activePanel === 'keyWordSearch')" class="info-window">
    <div class="info-card">
        <button class="close-btn" @click="close">
          <font-awesome-icon icon="xmark"/>
        </button>
        <h3>地物属性信息：{{ props.building.category }}</h3>
        <ul>
          <li>名称：<strong> {{ props.building.type === "未录入" ? "未知" : props.building.name }} </strong></li>
          <li>楼层数：<strong> {{ props.building.type === "未录入" ? "未知" : props.building.floor }} </strong></li>
          <li>高度：<strong> {{ props.building.type === "未录入" ? "未知" : props.building.height + " 米"}} </strong></li>
          <li>录入状态：<strong> {{ props.building.type }} </strong></li>
        </ul>

        <div class="longitude-latitude">
          坐标位置：
          <br>
          {{ props.building.longitude_X.toFixed(6) }} 东 &nbsp;&nbsp;{{ props.building.latitude_Y.toFixed(6) }} 北
        </div>

    </div>
  </div>
</template>

<style scoped>
.info-window {
  position: fixed;
  top: 108px;
  right: 385px;
  z-index: 9999;
}

.info-card {
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  color: white;
  width: 240px;
  animation: fadeIn 0.3s ease;
  border: 1px solid #f4f0f0;
  background: rgba(5, 10, 25, 0.6);
  backdrop-filter: blur(12px);
}

.info-card h3 {
  margin-top: 0;
  font-size: 19px;
  color: #f3f3f3;
  margin-bottom: 12px;
}

.info-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-card li {
  font-size: 15px;
  margin-bottom: 8px;
  color: #f3f3f3;
}

.info-card li strong{
  color: #f4f0f0;
}

.close-btn {
  position: absolute;
  top: 6px;
  right: 8px;
  background: transparent;
  border: none;
  color: #f3f3f3;
  font-size: 19px;
  cursor: pointer;
  z-index: 1000;
}

.close-btn:hover {
  color: #e15151;
  transform: scale(1.1);
}

.longitude-latitude {
  font-size: 11px;
  color: #f3f3f3;
  margin-top: 12px;
  font-style: italic;
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