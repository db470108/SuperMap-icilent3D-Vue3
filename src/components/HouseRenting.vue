<script setup>
  import {useUserStore} from "@/store/user.js";
  import {usePanelStore} from "@/store/panel.js";
  import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

  const userStore = useUserStore();
  const panelStore = usePanelStore();

  // 关闭面板
  function closePanel() {
    panelStore.closePanel();
  }

  // 房屋源信息
  const housesInfo = [
    {
      img:"/HousePhotos/万源昌花园.jpg",
      name: "万源昌花园",
      district: "武昌",
      price: "2500",
      area: "99.14",
      orientation: "南 北",
      room: "2室1厅1卫",
      longitude_X:114.304627,
      latitude_Y:30.557844,
      id:8310,
      link:"https://wh.zu.ke.com/zufang/c3711099417430/?sug=%E4%B8%87%E6%BA%90%E6%98%8C",
    },
    {
      img:"/HousePhotos/万科城.jpg",
      name: "万科城",
      district: "江汉",
      price: "2600",
      area: "109.81",
      orientation: "南 北",
      room: "3室2厅1卫",
      longitude_X:114.230696,
      latitude_Y:30.629325,
      id:104022,
      link:"https://wh.zu.ke.com/zufang/c3711063295147/?sug=%E4%B8%87%E7%A7%91%E5%9F%8E",
    },
    {
      img:"/HousePhotos/东方名都.jpg",
      name: "东方名都",
      district: "江汉",
      price: "2700",
      area: "102.79",
      orientation: "南",
      room: "3室2厅2卫",
      longitude_X:114.232509,
      latitude_Y:30.625768,
      id:796,
      link:"https://wh.zu.ke.com/zufang/c3711056444568/?sug=%E4%B8%9C%E6%96%B9%E5%90%8D%E9%83%BD",
    },
    {
      img:"/HousePhotos/中城国际.jpg",
      name: "中城国际",
      district: "江岸",
      price: "3600",
      area: "79.28",
      orientation: "西南",
      room: "2室1厅1卫",
      longitude_X:114.293348,
      latitude_Y:30.597272,
      id:104424,
      link:"https://wh.zu.ke.com/zufang/c3711060003923/?sug=%E4%B8%AD%E5%9F%8E%E5%9B%BD%E9%99%85",
    },
    {
      img:"/HousePhotos/丽岛柳园(南区).jpg",
      name: "丽岛柳园",
      district: "洪山",
      price: "700",
      area: "125.87",
      orientation: "北",
      room: "5室1厅2卫",
      longitude_X:114.333053,
      latitude_Y:30.509279,
      id:13065,
      link:"https://wh.zu.ke.com/zufang/c3711058434195/?sug=%E4%B8%BD%E5%B2%9B%E6%9F%B3%E5%9B%AD",
    },
    {
      img:"/HousePhotos/丽水康城.jpg",
      name: "丽水康城",
      district: "硚口",
      price: "2800",
      area: "134.78",
      orientation: "南",
      room: "3室2厅2卫",
      longitude_X:114.214064,
      latitude_Y:30.583714,
      id:104563,
      link:"https://wh.zu.ke.com/zufang/c3711058780519/?sug=%E4%B8%BD%E6%B0%B4%E5%BA%B7%E5%9F%8E",
    },
    {
      img:"/HousePhotos/保利·香槟国际.jpg",
      name: "保利·香槟国际",
      district: "硚口",
      price: "1400",
      area: "38.71",
      orientation: "南",
      room: "1室1厅1卫",
      longitude_X:114.217767 ,
      latitude_Y:30.591648 ,
      id:104762,
      link:"https://wh.zu.ke.com/zufang/c3711058857750/?sug=%E4%BF%9D%E5%88%A9%E9%A6%99%E6%A7%9F%E5%9B%BD%E9%99%85",
    },
    {
      img:"/HousePhotos/八大家花园.jpg",
      name: "八大家花园",
      district: "青山",
      price: "2500",
      area: "81.07",
      orientation: "南",
      room: "2室2厅1卫",
      longitude_X:114.376659 ,
      latitude_Y:30.626853 ,
      id:109398,
      link:"https://wh.zu.ke.com/zufang/c3720029686658814/?sug=%E5%85%AB%E5%A4%A7%E5%AE%B6%E8%8A%B1%E5%9B%AD",
    },
    {
      img:"/HousePhotos/凤凰世纪家园.jpg",
      name: "凤凰世纪家园",
      district: "武昌",
      price: "1800",
      area: "34.50",
      orientation: "南",
      room: "1室1厅1卫",
      longitude_X:114.306309 ,
      latitude_Y:30.558039 ,
      id:8311,
      link:"https://wh.zu.ke.com/zufang/c3711099394561/?sug=%E5%87%A4%E5%87%B0%E4%B8%96%E7%BA%AA%E5%AE%B6%E5%9B%AD",
    },
    {
      img:"/HousePhotos/南湖山庄·半岛花园.jpg",
      name: "南湖山庄·半岛花园",
      district: "洪山",
      price: "2000",
      area: "96.28",
      orientation: "南",
      room: "2室2厅1卫",
      longitude_X:114.340944 ,
      latitude_Y:30.490147 ,
      id:105196,
      link:"https://wh.zu.ke.com/zufang/c3711059907238/?sug=%E5%8D%8A%E5%B2%9B%E8%8A%B1%E5%9B%AD",
    },
    {
      img:"/HousePhotos/友谊国际沙湖苑.jpg",
      name: "友谊国际沙湖苑",
      district: "武昌",
      price: "4000",
      area: "119.03",
      orientation: "南",
      room: "3室2厅2卫",
      longitude_X:114.307094 ,
      latitude_Y:30.559396 ,
      id:105252,
      link:"https://wh.zu.ke.com/zufang/c3711099436657/?sug=%E5%8F%8B%E8%B0%8A%E5%9B%BD%E9%99%85%E6%B2%99%E6%B9%96%E8%8B%91",
    },
    {
      img:"/HousePhotos/广电·兰亭荣荟.jpg",
      name: "广电·兰亭荣荟",
      district: "硚口",
      price: "2000",
      area: "66.38",
      orientation: "南",
      room: "2室1厅1卫",
      longitude_X:114.210804 ,
      latitude_Y:30.607348 ,
      id:2639,
      link:"https://wh.zu.ke.com/zufang/c3711063192446/?sug=%E5%B9%BF%E7%94%B5%E5%85%B0%E4%BA%AD%E8%8D%A3%E8%8D%9F",
    },
    {
      img:"/HousePhotos/怡博苑.jpg",
      name: "怡博苑",
      district: "武昌",
      price: "2500",
      area: "64.95",
      orientation: "南 北",
      room: "2室1厅1卫",
      longitude_X:114.309966 ,
      latitude_Y:30.548848 ,
      id:106099,
      link:"https://wh.zu.ke.com/zufang/c3711059749096/?sug=%E6%80%A1%E5%8D%9A%E8%8B%91",
    },
    {
      img:"/HousePhotos/江汉经发公寓.jpg",
      name: "江汉经发公寓",
      district: "江汉",
      price: "4300",
      area: "176.83",
      orientation: "南",
      room: "4室2厅2卫",
      longitude_X:114.232461,
      latitude_Y:30.627872 ,
      id:780,
      link:"https://wh.zu.ke.com/zufang/c3715054772932057/?sug=%E7%BB%8F%E5%8F%91%E5%85%AC%E5%AF%93",
    },
    {
      img:"/HousePhotos/竹叶新村.jpg",
      name: "竹叶新村",
      district: "江岸",
      price: "1300",
      area: "84.19",
      orientation: "南 北",
      room: "2室1厅1卫",
      longitude_X:114.277083 ,
      latitude_Y:30.625492 ,
      id:108556,
      link:"https://wh.zu.ke.com/zufang/c3711060422021/?sug=%E7%AB%B9%E5%8F%B6%E6%96%B0%E6%9D%91",
    },
    {
      img:"/HousePhotos/紫御公馆.jpg",
      name: "紫御公馆",
      district: "江岸",
      price: "1900",
      area: "68.60",
      orientation: "南",
      room: "2室1厅1卫",
      longitude_X:114.282157 ,
      latitude_Y:30.635029 ,
      id:108578,
      link:"https://wh.zu.ke.com/zufang/c3711056476531/?sug=%E7%B4%AB%E5%BE%A1%E5%85%AC%E9%A6%86",
    },
    {
      img:"/HousePhotos/紫荆嘉苑.jpg",
      name: "紫荆嘉苑",
      district: "汉阳",
      price: "1800",
      area: "84.40",
      orientation: "南",
      room: "2室2厅1卫",
      longitude_X:114.215862 ,
      latitude_Y:30.559589 ,
      id:8081,
      link:"https://wh.zu.ke.com/zufang/c3711099431396/?sug=%E7%B4%AB%E8%8D%86%E5%98%89%E8%8B%91",
    },
    {
      img:"/HousePhotos/蓝湾俊园.jpg",
      name: "蓝湾俊园",
      district: "武昌",
      price: "2900",
      area: "96.14",
      orientation: "南 北",
      room: "1室1厅1卫",
      longitude_X:114.299684 ,
      latitude_Y:30.562230 ,
      id:108888,
      link:"https://wh.zu.ke.com/zufang/c3711060339909/?sug=%E8%93%9D%E6%B9%BE%E4%BF%8A%E5%9B%AD",
    },
    {
      img:"/HousePhotos/金色世家.jpg",
      name: "金色世家",
      district: "汉阳",
      price: "2400",
      area: "100.80",
      orientation: "南",
      room: "3室2厅1卫",
      longitude_X:114.214171 ,
      latitude_Y:30.559291 ,
      id:8027,
      link:"https://wh.zu.ke.com/zufang/c3711060619069/?sug=%E9%87%91%E8%89%B2%E4%B8%96%E5%AE%B6",
    },
    {
      img:"/HousePhotos/阳城景园.jpg",
      name: "阳城景园",
      district: "汉阳",
      price: "3000",
      area: "152.98",
      orientation: "南 北",
      room: "4室2厅2卫",
      longitude_X:114.215367 ,
      latitude_Y:30.561782 ,
      id:109341,
      link:"https://wh.zu.ke.com/zufang/c3711060289034/?sug=%E9%98%B3%E5%9F%8E%E6%99%AF%E5%9B%AD",
    },
  ]

  const emit = defineEmits(['flyToHouse'])
  // 飞向房屋
  function flyToHouse(house) {
    emit('flyToHouse', house)
  }

  // 打开房屋对应的贝壳找房网页
  function goToLink(house) {
    window.open(house.link, '_blank')
  }
</script>

<template>
  <transition name="fade-slide" mode="out-in">
    <div
        v-if="panelStore.activePanel === 'houseRenting'"
        :class="[
            'house-renting-panel',
            userStore.currentUser === 'admin'
            ? 'theme-admin'
            : 'theme-citizen']"
    >
      <div class="panel-header">
        <h2>租房中心</h2>
        <div class="panel-header-info">
          <span>
            以下房源信息来自
            &nbsp;
            <a href="https://wh.zu.ke.com/zufang/" target="_blank">贝壳找房</a>
            &nbsp;
            仅供参考，请以实际为准
          </span>

        </div>

        <button class="close-btn" @click="closePanel">
          <font-awesome-icon icon="xmark"/>
        </button>
      </div>

      <el-scrollbar height="555px">
        <div
            class="house-item"
            v-for="(house, index) in housesInfo"
            :key="index"
        >

          <img :src="house.img" :alt="house.name">
          <div class="house-info">
            <div class="house-title">
              <span>{{ house.name }}</span>
              <span class="house-price">{{ house.price}}元/月</span>
            </div>

            <div class="house-detail">
              <span>{{ house.district }} / </span>
              <span>{{ house.area }}㎡ / </span>
              <span>{{ house.orientation }} / </span>
              <span>{{ house.room }}</span>
            </div>

            <div class="btn-row">
              <div class="flt-to-location-btn">
                <el-button type="success" @click="flyToHouse(house)">
                  查看位置
                </el-button>
              </div>

              <div class="detail-btn">
                <el-button type="primary" :title="'前往贝壳找房'" @click.stop="goToLink(house)">了解详情</el-button>
              </div>
            </div>

          </div>

        </div>
      </el-scrollbar>

    </div>
  </transition>

</template>

<style scoped>
/* 公共布局 */
.house-renting-panel {
  position: absolute;
  top: 50px;
  right: 20px;
  width: 450px;
  border-radius: 12px;
  padding: 15px;
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

.panel-header h2 {
  margin: 0;
  font-size: 20px;
}

.panel-header-info {
  font-size: 11px;
}

.panel-header a {
  font-style: italic;
  color: #409EFF;
  font-size: 12px;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
}
.close-btn:hover svg {
  color: #e15151;
}

.house-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.house-item {
  display: flex;
  padding: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid transparent;
}
.house-item:hover {
  border-color: rgba(69, 69, 69, 0.2);
  box-shadow: 0 4px 12px rgba(69, 69, 69, 0.2);
  background-color: rgba(69, 69, 69, 0.2);
}

.house-item img {
  width: 140px;
  height: 110px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}

.house-info {
  flex: 1;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.house-title {
  font-size: 20px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.house-detail {
  font-size: 15px;
  opacity: 0.8;
  margin-bottom: 8px;
}

.house-price {
  font-size: 18px;
  font-weight: bold;
  color: #F56C6C;
}

.btn-row {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;
}

.flt-to-location-btn {
  display: flex;
}

.detail-btn {
  display: flex;
  justify-content: flex-end;
}

/* 主题样式 */
.theme-citizen {
  background: #f4f0f0;
  backdrop-filter: blur(12px);
  color: #454545;
}
.theme-citizen .panel-header {
  border-bottom-color: rgba(69, 69, 69, 0.2);
}
.theme-citizen .close-btn {
  color: #454545;
}

.theme-admin {
  background: rgba(5, 10, 25, 0.85);
  backdrop-filter: blur(12px);
  color: #f4f0f0;
}
.theme-admin .panel-header {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}
.theme-admin .close-btn {
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