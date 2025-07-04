<script setup>
  // 父组件BannerBar传来的visible
  defineProps({
      visible: Boolean,
  })

  // 声明函数emit，将select事件发送出去
  const emit = defineEmits(["select"])

  // //当用户点击某个图层选项
  function selectLayer(type) {
    emit("select", type);
  }

</script>

<template>
  <div class="layer-popup" v-if="visible">
    <h3>图层选择</h3>
    <ul>
      <li @click="selectLayer('raster')">卫星地图</li>
      <li @click="selectLayer('vector')">矢量地图</li>
      <li @click="selectLayer('scene3D')">3D 模型</li>
    </ul>
  </div>
</template>

<style scoped>
.layer-popup {
  position: fixed;
  top: 70px;
  right: 30px;
  width: 220px;
  padding: 20px;
  border-radius: 16px;
  backdrop-filter: blur(12px);  /*毛玻璃效果*/
  background: rgba(10, 20, 40, 0.6);  /*半透明背景*/
  box-shadow: 0 0 15px rgba(0, 227, 255, 0.2);  /*发光边框*/
  color: #e0f4ff;
  z-index: 9999;
  border: 1px solid rgba(0, 227, 255, 0.3);
}

.layer-popup h3 {
  margin: 0 0 12px;
  font-size: 16px;
  color: #00ccff;
}

.layer-popup ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.layer-popup li {
  padding: 8px 12px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.layer-popup li:hover {
  background: rgba(0, 227, 255, 0.2);
  color: #00ccff;
}
</style>