<script setup>
  import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
  import {usePanelStore} from "@/store/panel.js";
  import {useUserStore} from "@/store/user.js";

  const props = defineProps({
    building: {
      type: Object,
      default: null
    }
  });

  const panelStore = usePanelStore();
  const userStore = useUserStore(); // 根据不同登录身份，加载不同内容和主题

  const emit = defineEmits(['close']);

  function close() {
    emit('close');
    panelStore.closePanel();
  }

</script>

<template>
  <div v-if="props.building && (panelStore.activePanel === 'doubleClickSearch' || panelStore.activePanel === 'keyWordSearch')" class="info-window">
    <div
        :class="[userStore.currentUser === 'admin' ? 'info-card-theme-admin' : 'info-card-theme-citizen']"
    >
        <button
            :class="[userStore.currentUser === 'admin' ? 'close-btn-theme-admin' : 'close-btn-theme-citizen']"
            @click="close"
        >
          <font-awesome-icon icon="xmark"/>
        </button>
        <h3>地物属性信息：{{ props.building.category }}</h3>
        <ul>
          <li>名称：<strong> {{ props.building.type === "未录入" ? "未知" : props.building.name }} </strong></li>
          <li>楼层数：<strong> {{ props.building.type === "未录入" ? "未知" : props.building.floor }} </strong></li>
          <li>高度：<strong> {{ props.building.type === "未录入" ? "未知" : props.building.height + " 米"}} </strong></li>
          <li>录入状态：<strong> {{ props.building.type }} </strong></li>
        </ul>

        <div class="longitude-latitude" v-show="userStore.currentUser === 'admin'">
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

.info-card-theme-admin {
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

.info-card-theme-admin h3 {
  margin-top: 0;
  font-size: 19px;
  color: #f3f3f3;
  margin-bottom: 12px;
}

.info-card-theme-admin ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-card-theme-admin li {
  font-size: 15px;
  margin-bottom: 8px;
  color: #f3f3f3;
}

.info-card-theme-admin li strong{
  color: #f4f0f0;
}

.info-card-theme-citizen {
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  color: white;
  width: 240px;
  animation: fadeIn 0.3s ease;
  border: 1px solid #f4f0f0;
  background: #f4f0f0;
  backdrop-filter: blur(12px);
}

.info-card-theme-citizen h3 {
  margin-top: 0;
  font-size: 19px;
  color: #454545;
  margin-bottom: 12px;
}

.info-card-theme-citizen ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-card-theme-citizen li {
  font-size: 15px;
  margin-bottom: 8px;
  color: #454545;
}

.info-card-theme-citizen li strong{
  color: #454545;
}

.close-btn-theme-admin {
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

.close-btn-theme-citizen {
  position: absolute;
  top: 6px;
  right: 8px;
  background: transparent;
  border: none;
  color: #454545;
  font-size: 19px;
  cursor: pointer;
  z-index: 1000;
}

.close-btn-theme-citizen:hover,
.close-btn-theme-admin:hover {
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