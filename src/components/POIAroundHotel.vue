<script setup>
  import {usePanelStore} from "@/store/panel.js";
  import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
  import {computed, ref, watch} from "vue";
  import axios from "@/utils/axios.js";
  import {useUserStore} from "@/store/user.js";

  // 控制面板是否显示
  const panelStore = usePanelStore();
  // 根据不同登录身份，加载不同内容和主题
  const userStore = useUserStore();

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
    {label: '所有结果', value: ''},
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

  const emit = defineEmits([
      'flyToHotel',
      'flyToPOI'
  ]);

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

  // 点击POI后飞往POI
  function flyToPOI(poi) {
    emit('flyToPOI', poi);
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
    <div
        :class="[userStore.currentUser === 'admin' ? 'enter-info-panel-theme-admin' : 'enter-info-panel-theme-citizen']"
        v-if="panelStore.activePanel === 'poiAroundHotel'"
    >
      <div
          :class="[userStore.currentUser === 'admin' ? 'panel-header-theme-admin' : 'panel-header-theme-citizen']"

      >
        <h2>酒店周边地点搜索</h2>
        <button
            :class="[userStore.currentUser === 'admin' ? 'close-btn-theme-admin' : 'close-btn-theme-citizen']"
            @click="closePanel"
        >
          <font-awesome-icon icon="xmark"/>
        </button>
      </div>

      <div
          :class="[userStore.currentUser === 'admin' ? 'search-hotel-theme-admin' : 'search-hotel-theme-citizen']"
      >
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
        <div
            :class="[userStore.currentUser === 'admin' ? 'hotel-list-theme-admin' : 'hotel-list-theme-citizen']"
        >
          <div
              :class="[userStore.currentUser === 'admin' ? 'result-item-theme-admin' : 'result-item-theme-citizen']"
            v-for="hotel in hotelList "
            :key="hotel.id"
            @click="selectHotel(hotel)"
            >
              <font-awesome-icon
                  icon="hotel"
                  :class="[userStore.currentUser === 'admin' ? 'icon-hotel-theme-admin' : 'icon-hotel-theme-citizen']"
              /> {{ hotel.name }}
          </div>
        </div>
      </transition>

      <div
          :class="[userStore.currentUser === 'admin' ? 'enter-dis-theme-admin' : 'enter-dis-theme-citizen']"
      >
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
    <div
        :class="[userStore.currentUser === 'admin' ? 'search-results-theme-admin' : 'search-results-theme-citizen']"
        v-if="showSearchResults && panelStore.activePanel === 'poiAroundHotel'"
    >
        <div
            :class="[userStore.currentUser === 'admin' ? 'search-results-header-theme-admin' : 'search-results-header-theme-citizen']"
        >
          <h2>找到以下周边地点：</h2>
          <el-select v-model="selectedCategory" placeholder="筛选类型" style="width: 180px" :teleported="false">
            <el-option
                v-for="category in categories"
                :key="category.value"
                :label="category.label"
                :value="category.value"
            />
          </el-select>
          <button
              :class="[userStore.currentUser === 'admin' ? 'close-btn-theme-admin' : 'close-btn-theme-citizen']"
              @click="closeSearchResults"
          >
            <font-awesome-icon icon="minus"/>
          </button>
        </div>

        <div class="result-list">
          <div
              :class="[userStore.currentUser === 'admin' ? 'poi-item-theme-admin' : 'poi-item-theme-citizen']"
            v-for="poi in buildingsWithinDistance.filter(p => {
              return (!selectedCategory || p.category === selectedCategory)
            })"
            :key="poi.id"
            v-show="poi.distance > 0 && poi.category !== null && poi.name !== '未知' && poi.name !== null"
            @click="flyToPOI(poi)"
            >
            <div
                :class="[userStore.currentUser === 'admin' ? 'poi-name-theme-admin' : 'poi-name-theme-citizen']"
            >
              {{poi.name}}
            </div>
            <div
                :class="[userStore.currentUser === 'admin' ? 'poi-category-theme-admin' : 'poi-category-theme-citizen']"
            >
              {{poi.category}}
            </div>
            <div
                :class="[userStore.currentUser === 'admin' ? 'poi-distance-theme-admin' : 'poi-distance-theme-citizen']"
            >
              {{poi.distance.toFixed(0)}}米
            </div>
          </div>

          <div
              :class="[userStore.currentUser === 'admin' ? 'no-result-theme-admin' : 'no-result-theme-citizen']"
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
.enter-info-panel-theme-admin {
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

.enter-info-panel-theme-citizen {
  position: absolute;
  top: 50px;
  right: 20px;
  width: 380px;
  height: 255px;
  background: #f4f0f0;
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

.panel-header-theme-admin {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-header-theme-admin h2 {
  margin: 0;
  font-size: 15px;
  color: #f4f0f0;
}

.panel-header-theme-citizen {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(69, 69, 69, 0.2);
}

.panel-header-theme-citizen h2 {
  margin: 0;
  font-size: 15px;
  color: #454545;
}

.close-btn-theme-admin {
  background: transparent;
  border: none;
  color: #f4f0f0;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
}

.close-btn-theme-citizen {
  background: transparent;
  border: none;
  color: #454545;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
}

.close-btn-theme-admin:hover,
.close-btn-theme-citizen:hover {
  color: #e15151;
}

.search-hotel-theme-admin {
  font-size: 13px;
  color: #f4f0f0;
}

.search-hotel-theme-citizen {
  font-size: 13px;
  color: #454545;
}

/* 搜索结果样式 */
.hotel-list-theme-admin {
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

.hotel-list-theme-citizen {
  position: absolute;
  top: 100px;
  right: 20px;
  width: 375px;
  height: 130px;
  overflow-y: auto;
  background: #f4f0f0;
  backdrop-filter: blur(12px);
  z-index: 3000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(117, 117, 117, 0.65);
  border-radius: 6px;
}

.result-item-theme-admin {
  padding: 10px 15px;
  color: #f4f0f0;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 13px;
}

.result-item-theme-citizen {
  padding: 10px 15px;
  color: #454545;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 13px;
}

.result-item-theme-admin:last-child,
.result-item-theme-citizen:last-child {
  border-bottom: none;
}

.result-item-theme-admin:hover,
.result-item-theme-citizen:hover {
  background: rgba(51, 153, 255, 0.5);
}

.icon-hotel-theme-admin {
  font-size: 13px;
  color: #f4f0f0;
}

.icon-hotel-theme-citizen {
  font-size: 13px;
  color: #409EFF;
}

.enter-dis-theme-admin {
  font-size: 13px;
  position: fixed;
  bottom: 10px;
  color: #f4f0f0;
}

.enter-dis-theme-citizen {
  font-size: 13px;
  position: fixed;
  bottom: 10px;
  color: #454545;
}

.buttons {
  display: flex;
  position: fixed;
  bottom: 10px;
  right: 20px;
  gap: 20px;
}

.search-results-theme-admin {
  position: absolute;
  top: 340px;
  right: 20px;
  width: 380px;
  height: 370px;
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

.search-results-theme-citizen {
  position: absolute;
  top: 340px;
  right: 20px;
  width: 380px;
  height: 370px;
  background: #f4f0f0;
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

.search-results-header-theme-citizen{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(69, 69, 69, 0.2);
  z-index: 2000;
}

.search-results-header-theme-admin {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 2000;
}

.search-results-header-theme-admin h2 {
  margin: 0;
  font-size: 15px;
  color: #f4f0f0;
}

.search-results-header-theme-citizen h2 {
  margin: 0;
  font-size: 15px;
  color: #454545;
}

.result-list {
  height: 320px;
  overflow-y: auto;
}

.poi-item-theme-citizen {
  padding: 10px;
  border-bottom: 1px solid rgba(69, 69, 69, 0.2);
  cursor: pointer;
}

.poi-item-theme-admin {
  padding: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
}

.poi-item-theme-citizen:last-child,
.poi-item-theme-admin:last-child {
  border-bottom: none;
}

.poi-item-theme-citizen:hover,
.poi-item-theme-admin:hover {
  background: rgba(51, 153, 255, 0.5);
}

.poi-name-theme-admin {
  font-weight: bold;
  font-size: 14px;
  color: #f4f0f0;
}

.poi-name-theme-citizen {
  font-weight: bold;
  font-size: 14px;
  color: #454545;
}

.poi-category-theme-admin {
  font-size: 12px;
  color: #ccc;
  margin: 3px 0;
}

.poi-category-theme-citizen {
  font-size: 12px;
  color: #454545;
  margin: 3px 0;
}

.poi-distance-theme-admin {
  font-size: 12px;
  color: #aaa;
}

.poi-distance-theme-citizen {
  font-size: 12px;
  color: #454545;
}

.no-result-theme-admin {
  text-align: center;
  padding: 20px;
  color: #aaa;
}

.no-result-theme-citizen {
  text-align: center;
  padding: 20px;
  color: #454545;
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