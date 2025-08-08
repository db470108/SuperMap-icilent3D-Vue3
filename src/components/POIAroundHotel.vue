<script setup>
  import {usePanelStore} from "@/store/panel.js";
  import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
  import {computed, ref, watch} from "vue";
  import axios from "@/utils/axios.js";

  // 控制面板是否显示
  const panelStore = usePanelStore();

  // 关闭面板
  function closePanel() {
    panelStore.closePanel();
    showSearchResults.value = false;
  }

  const hotelName = ref("");  // 输入酒店的名称
  const hotelList = ref([]);  // 酒店结果列表
  let searchTimeout = null; // 用于防抖的定时器引用
  const enterDis = ref(); // 输入的距离
  const buildingsWithinDistance = ref([]); // 搜索的结果
  const categories = ref([
    {label: '饭馆', value: '饭馆'},
    {label: '酒店', value: '酒店'},
    {label: '购物场所', value: '购物场所'},
    {label: '娱乐场所', value: '娱乐场所'},
    {label: '服务机构', value: '服务机构'},
    {label: '企业', value: '企业'},
    {label: '社区', value: '社区'},
    {label: '医疗', value: '医疗'},
    {label: '学校', value: '学校'},
    {label: '政府机构', value: '政府机构'},
  ]);
  const selectedCategory = ref(''); // 选择的筛选类型

  // 搜索按钮是否可用
  const isSearchButtonEnabled = ref(computed(() => {
    return hotelName.value !== '' && Number(enterDis.value) > 0;
  }))
  const showSearchResults = ref(false);

  // 实时输入
  function handleInput() {
    clearTimeout(searchTimeout);
    // 判空
    if (hotelName.value.trim() === '') {
      hotelList.value = [];
      return;
    }

    // 防抖处理，避免频繁请求
    searchTimeout = setTimeout(async () => {
      try {
        const response = await axios({
          method: 'GET',
          url: '/buildings/searchHotel',
          params: {
            name: hotelName.value
          },
        })
        hotelList.value = response.data;
      } catch (error) {
        console.error("搜索出错" + error);
        hotelList.value = [];
      }
    }, 300)
  }

  const emit = defineEmits(['flyToHotel']);
  // 点击列表中的酒店后将输入框的输入框内容设置为选中
  function selectHotel(hotel) {
    hotelName.value = hotel.name;
    handleInput();
  }
  // 点击搜索后飞往酒店
  function flyToBuilding(hotel) {
    // 判断选中酒店和输入框中的酒店名相同后，才执行飞往酒店
    if (hotel.name === hotelName.value) {
      emit('flyToHotel', hotel);
      showSearchResults.value = true;
      // 执行搜索
      searchBuildingsWithinDistance(hotel);
    }
  }

  // 搜索酒店周边的地点
  async function searchBuildingsWithinDistance(hotel) {
    try {
      const response = await axios({
        method: 'GET',
        url: '/buildings/searchBuildingsWithinDistance',
        params: {
          longitudeX: hotel.longitude_X,
          latitudeY: hotel.latitude_Y,
          distance: enterDis.value,
        }
      })
      buildingsWithinDistance.value = response.data;
    } catch (error) {
      console.error("搜索周边POI出错" + error);
      buildingsWithinDistance.value = [];
    }
  }

  // 搜索结果的隐藏
  function closeSearchResults() {
    showSearchResults.value = false;
  }


</script>

<template>

  <transition name="fade-slide" mode="out-in">
    <div class="enter-info-panel" v-if="panelStore.activePanel === 'poiAroundHotel'">
      <div class="panel-header">
        <h2>酒店周边地点搜索</h2>
        <button class="close-btn" @click="closePanel">
          <font-awesome-icon icon="xmark"/>
        </button>
      </div>

      <div class="search-hotel">
          酒店/宾馆 名称：
        <el-input
            type="text"
            v-model="hotelName"
            placeholder="请输入酒店名称"
            @input="handleInput"
            clearable
            style="width: 260px"
        />
      </div>

      <transition name="fade-slide" mode="out-in">
        <div class="hotel-list">
          <div
            class="result-item"
            v-for="hotel in hotelList "
            :key="hotel.id"
            @click="selectHotel(hotel)"
            >
              <font-awesome-icon icon="hotel" class="icon-hotel"/> {{ hotel.name }}
          </div>
        </div>
      </transition>

      <div class="enter-dis">
        搜索距离：
        <el-input
            type="number"
            min="0"
            step="50"
            v-model="enterDis"
            placeholder="请输入搜索距离(米)"
            style="width: 230px"
        >
          <template #append>米</template>
        </el-input>
      </div>

      <div
          class="buttons"
          v-for="hotel in hotelList"
          :key="hotel.id"
      >
        <el-button
            type="primary"
            plain
            @click="flyToBuilding(hotel)"
            :disabled="!isSearchButtonEnabled"
            :title="!isSearchButtonEnabled ? '请填写酒店名和距离' : ''"
        >
          搜索
        </el-button>
      </div>
    </div>
  </transition>

  <transition name="fade-slide" mode="out-in">
    <div class="search-results" v-if="showSearchResults && panelStore.activePanel === 'poiAroundHotel'">
        <div class="search-results-header">
          <h2>找到以下周边地点：</h2>
          <el-select v-model="selectedCategory" placeholder="筛选类型" style="width: 150px">
            <el-option
                v-for="category in categories"
                :key="category.value"
                :label="category.label"
                :value="category.value"
            />
          </el-select>
          <button class="close-btn" @click="closeSearchResults">
            <font-awesome-icon icon="minus"/>
          </button>
        </div>

        <div class="result-list">
          <div
            class="poi-item"
            v-for="poi in buildingsWithinDistance.filter(p => {
              return (!selectedCategory || p.category === selectedCategory)
            })"
            :key="poi.id"
            v-show="poi.distance > 0 && poi.category !== null && poi.name !== '未知' && poi.name !== null"
            >
            <div class="poi-name">{{poi.name}}</div>
            <div class="poi-category">{{poi.category}}</div>
            <div class="poi-distance">{{poi.distance.toFixed(0)}}米</div>
          </div>

          <div
              class="no-results"
              v-if="buildingsWithinDistance.filter(p => {
                return (!selectedCategory || p.category === selectedCategory)
              }).length === 0">
            未找到周边地点
          </div>
        </div>
    </div>
  </transition>




</template>

<style scoped>
.enter-info-panel {
  position: absolute;
  top: 50px;
  right: 20px;
  width: 380px;
  height: 255px;
  background: rgba(5, 10, 25, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid #f4f0f0;
  border-radius: 12px;
  padding: 15px;
  color: #f4f0f0;
  z-index: 10000;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  user-select: none;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-header h2 {
  margin: 0;
  font-size: 15px;
  color: #f4f0f0;
}

.close-btn {
  background: transparent;
  border: none;
  color: #f4f0f0;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
}

.close-btn:hover {
  color: #e15151;
}

.search-hotel {
  font-size: 13px;
}

/* 搜索结果样式 */
.hotel-list {
  position: absolute;
  top: 100px;
  right: 20px;
  width: 375px;
  height: 130px;
  overflow-y: auto;
  background: rgba(5, 10, 25, 0.6);
  backdrop-filter: blur(12px);
  z-index: 3000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(117, 117, 117, 0.65);
  border-radius: 6px;
}

.result-item {
  padding: 10px 15px;
  color: #f4f0f0;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 13px;
}

.result-item:last-child {
  border-bottom: none;
}

.result-item:hover {
  background: rgba(51, 153, 255, 0.5);
}

.icon-hotel {
  font-size: 13px;
  color: #f4f0f0;
}

.enter-dis {
  font-size: 13px;
  position: fixed;
  bottom: 10px
}

.buttons {
  display: flex;
  position: fixed;
  bottom: 10px;
  right: 20px;
  gap: 20px;
}

.search-results {
  position: absolute;
  top: 340px;
  right: 20px;
  width: 380px;
  height: 270px;
  background: rgba(5, 10, 25, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid #f4f0f0;
  border-radius: 12px;
  padding: 15px;
  color: #f4f0f0;
  z-index: 10000;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  user-select: none;
}

.search-results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 2000;
}

.search-results-header h2 {
  margin: 0;
  font-size: 15px;
  color: #f4f0f0;
}

.result-list {
  max-height: 200px;
  overflow-y: auto;
}

.poi-item {
  padding: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.poi-item:last-child {
  border-bottom: none;
}

.poi-name {
  font-weight: bold;
  font-size: 14px;
}

.poi-category {
  font-size: 12px;
  color: #ccc;
  margin: 3px 0;
}

.poi-distance {
  font-size: 12px;
  color: #aaa;
}

.no-results {
  text-align: center;
  padding: 20px;
  color: #aaa;
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

.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
}

.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  filter: blur(5px);
}

</style>