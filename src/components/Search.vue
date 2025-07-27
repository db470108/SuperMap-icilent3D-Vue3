<script setup>
  import { ref } from 'vue';
  import axios from "@/utils/axios.js";
  import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

  const searchBoxVisible = ref(false);  // 搜索框是否可见
  const searchQuery = ref('');  // 存储用户输入的搜索关键词
  const searchResults = ref([]);  // 存储搜索结果列表
  const showResult = ref(false);  // 控制搜索结果面板的显示与隐藏
  let searchTimeout = null; // 用于防抖的定时器引用

  function toggleSearchBox() {
    searchBoxVisible.value = !searchBoxVisible.value;
    if (!searchBoxVisible.value) {
      showResult.value = false;
    } else {
      if (searchQuery.value.trim() !== '') {
        showResult.value = searchResults.value.length > 0;
      }
    }

  }

  // 实时搜索
  function handleInput() {
    clearTimeout(searchTimeout);
    if (searchQuery.value.trim() === '') {
      showResult.value = false;
      searchResults.value = [];
      return;
    }

    // 防抖处理，避免频繁请求
    searchTimeout = setTimeout(async () => {
      try {
        const response = await axios( {
          method: 'GET',
          url: '/buildings/search',
          params: {
            name: searchQuery.value,
          },
        });
        searchResults.value = response.data;
        showResult.value = searchResults.value.length > 0;
      } catch (error) {
        console.log("搜索出错", error)
        searchResults.value = [];
        showResult.value = false;
      }
    }, 300)
  }

  // 点击搜索结果
  function selectBuilding(building) {
    // 搜索框内容替换为点击内容
    searchQuery.value = building.name;
    /*// 隐藏搜索结果列表
    showResult.value = false;*/
    // 发送事件到父组件
    emit('fly-to-building', building);
  }
  const emit = defineEmits(["fly-to-building"])

  // 清空输入框内容
  function clearInput() {
    searchQuery.value = "";
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
            placeholder="查找地点"
            v-model="searchQuery"
            @input="handleInput"
        >
        <button class="clearInput" :title="'清空输入'" @click="clearInput">
          <font-awesome-icon icon="xmark"/>
        </button>
      </div>
    </transition>

    <transition name="fade-slide" mode="out-in">
      <div class="search-results" v-if="(showResult && searchResults.length > 0)">
        <div
            class="result-item"
            v-for="building in searchResults"
            :key="building.id"
            @click="selectBuilding(building)"
          >
          <font-awesome-icon icon="location-dot" class="location-dot"/> {{ building.name }}
        </div>
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
  right: 277px;
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

.clearInput {
  position: absolute;
  top: 6px;
  right: 8px;
  background: transparent;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  z-index: 1000;
}

.clearInput:hover {
  color: #4aa8a8;
}

/* 搜索结果样式 */
.search-results {
  position: fixed;
  top: 50px;
  right: 65px;
  width: 245px;
  max-height: 300px;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  z-index: 3000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.result-item {
  padding: 10px 15px;
  color: white;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.result-item:last-child {
  border-bottom: none;
}

.result-item:hover {
  background: rgba(74, 168, 168, 0.3);
}

.location-dot {
  font-size: 15px;
  color: rgb(19, 58, 142);
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