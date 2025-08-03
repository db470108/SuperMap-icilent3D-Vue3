<script setup>
import {ref, watch} from 'vue';
  import axios from "@/utils/axios.js";
  import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
  import {usePanelStore} from "@/store/panel.js";

  const searchBoxVisible = ref(false);  // 搜索框是否可见
  const searchQuery = ref('');  // 存储用户输入的搜索关键词
  const searchResults = ref([]);  // 存储搜索结果列表
  const showResult = ref(false);  // 控制搜索结果面板的显示与隐藏
  let searchTimeout = null; // 用于防抖的定时器引用

  const panelStore = usePanelStore();

  watch(() => panelStore.activePanel, (newPanel) => {
    if (newPanel === 'keyWordSearch') {
      toggleSearchBox();
    } else {
      searchBoxVisible.value = false;
    }
  })

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
    // 判空
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
  function closeKeyWordSearch() {
    panelStore.closePanel();
  }

</script>

<template>
  <!-- 搜索按钮 -->
  <div class="search">

<!--    输入框-->
    <transition name="fade-slide" mode="out-in">
      <div class="search-input-container" v-if="searchBoxVisible">
        <el-input
            class="search-input"
            type="text"
            placeholder="查找地点"
            v-model="searchQuery"
            @input="handleInput"
            clearable
        />
        <button class="closeKeyWordSearch" :title="'关闭'" @click="closeKeyWordSearch">
          <font-awesome-icon icon="xmark"/>
        </button>
      </div>
    </transition>

<!--    结果列表-->
    <transition name="fade-slide" mode="out-in">
      <div class="search-results" v-if="(showResult && searchResults.length > 0 && searchBoxVisible)">
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
  top: 50px;
  right: 50px;
  user-select: none;
}

/* 横向弹出菜单 */
.search-input-container {
  position: relative;
  width: 327px;
  padding: 1px 1px;
  display: flex;
  gap: 20px;
  background: rgba(5, 10, 25, 0.6);
  backdrop-filter: blur(12px);
  color: #f4f0f0;
  z-index: 3000;
  border: 1px solid #f4f0f0;
  border-radius: 12px;
}

.search-input {
  padding: 10px 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  color: #f4f0f0;
  font-size: 14px;
  outline: none;
  width: 90%;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}


.closeKeyWordSearch {
  position: absolute;
  top: 16px;
  right: 5px;
  background: transparent;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  z-index: 1000;
}

.closeKeyWordSearch:hover {
  color: #e15151;
}

/* 搜索结果样式 */
.search-results {
  position: fixed;
  top: 108px;
  right: 50px;
  width: 327px;
  max-height: 600px;
  overflow-y: auto;
  background: rgba(5, 10, 25, 0.6);
  backdrop-filter: blur(12px);
  z-index: 3000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid #f4f0f0;
  border-radius: 12px;
}

.result-item {
  padding: 10px 15px;
  color: #f4f0f0;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.result-item:last-child {
  border-bottom: none;
}

.result-item:hover {
  background: rgba(51, 153, 255, 0.5);
}

.location-dot {
  font-size: 15px;
  color: #f4f0f0;
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