<template>
    <!-- 展示区，范围：整个网页-->
    <div class="web-container">
      <router-view>
      </router-view>
    </div>
</template>

<script setup>
  import WelcomePage from "@/pages/WelcomePage.vue";
</script>

<style scoped>
  .web-container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>
