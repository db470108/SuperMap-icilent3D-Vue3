<script setup>
  import { ref } from 'vue';

  const searchBoxVisible = ref(false);

  function toggleSearchBox() {
    searchBoxVisible.value = !searchBoxVisible.value;
  }
</script>

<template>
  <!-- 搜索按钮 -->
  <div class="search">
    <button
        class="icon-button"
        @click="toggleSearchBox"
        :title="'地物查询'"
    >
      <font-awesome-icon icon="magnifying-glass" :class="['icon-border', {active: searchBoxVisible}]"/>
    </button>


    <transition name="fade-slide" mode="out-in">
      <div class="search-input-container" v-if="searchBoxVisible">
        <input
            class="search-input"
            type="text"
            placeholder="搜索建筑物"
        >
      </div>


    </transition>

  </div>


</template>

<style scoped>
.search {
  display: inline-block;
  z-index: 2000;
  position: absolute;
  top: 7px;
  right: 280px;
  user-select: none;
}

.icon-button {
  all: unset;
  cursor: pointer;
}

.icon-button:disabled {
  pointer-events: none;
}

.icon-border {
  font-size: 20px;
  color: white;
  border: 2px solid transparent;
  border-radius: 4px;
  padding: 3px;
  transition: border-color 0.3s ease;
}

/* 悬停时变边框颜色 */
.icon-border:hover {
  border-color: #4aa8a8;
}

/* 激活时边框颜色 */
.icon-border.active {
  border-color: #4aa8a8;
}

/* 横向弹出菜单 */
.search-input-container {
  position: fixed;
  padding: 1px 1px;
  top: 8px;
  right: 65px;
  display: flex;
  gap: 20px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  color: white;
  z-index: 3000;
}

.search-input {
  padding: 5px 15px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(5, 10, 25, 0.6);
  color: white;
  font-size: 14px;
  outline: none;
  backdrop-filter: blur(10px);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.search-input:focus {
  border-color: #4aa8a8;
  box-shadow: 0 0 0 2px #4aa8a8;
}

/* 动画增强 */
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.fade-slide-enter-active {
  animation: fadeInScale 0.3s ease;
}
.fade-slide-leave-active {
  animation: fadeInScale 0.3s reverse;
}



</style>