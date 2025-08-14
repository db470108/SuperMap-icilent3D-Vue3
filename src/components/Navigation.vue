<script setup>
  import {usePanelStore} from "@/store/panel.js";
  import {useUserStore} from "@/store/user.js";
  import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

  const panelStore = usePanelStore();
  const userStore = useUserStore();

  // 关闭模块
  function closePanel() {
    panelStore.closePanel();
  }
</script>

<template>

  <transition name="fade-slide" mode="out-in">
    <div
        v-if="panelStore.activePanel === 'navigation'"
        :class="[
            'navigation-panel',
            userStore.currentUser === 'admin'
            ? 'theme-admin'
            : 'theme-citizen'
        ]"
    >

      <div class="panel-header">
        <h2>出行导航</h2>
        <div class="close-btn" @click="closePanel">
          <font-awesome-icon icon="xmark"/>
        </div>
      </div>

    </div>
  </transition>

</template>

<style scoped>
/* 公共布局 */
.navigation-panel {
  position: absolute;
  top: 50px;
  right: 20px;
  width: 380px;
  height: 255px;
  border-radius: 12px;
  padding: 15px;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  user-select: none;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  margin-bottom: 8px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
}

.close-btn:hover {
  color: #e15151;
}

/* 主题样式 */
.theme-citizen {
  background: #f4f0f0;
  backdrop-filter: blur(12px);
  color: #454545;
}

.theme-admin {
  background: rgba(5, 10, 25, 0.85);
  backdrop-filter: blur(12px);
  color: #f4f0f0;
}

/* 渐进过渡动画 */
.fade-slide-enter-active {
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  filter: blur(5px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  filter: blur(5px);
}
</style>