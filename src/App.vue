<template>
  <!-- 全局loading -->
  <div class="parcel">
    <el-scrollbar ref="scrollbarRef" height="100%" @scroll="handleScroll">
      <div ref="mianRef" :class="{ 'global-loading': true, 'rolling': global.globalData.loading.loading }"
        v-loading="global.globalData.loading.loading" :element-loading-text="global.globalData.loading.loadingText"
        :element-loading-svg="global.globalData.loading.loadingSvg"
        :element-loading-svg-view-box="global.globalData.loading.loadingSvgViewBox"
        :element-loading-background="global.globalData.loading.loadingBackground">
        <router-view />
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useGlobalStore } from "./store/main";

const route = useRoute()
const global = useGlobalStore();
const mianRef = ref()
const scrollbarRef = ref()

//滚动事件
const handleScroll = (e: any) => {
  global.setScroll(e.scrollLeft, e.scrollTop)
}

let watchsScroll: any

onMounted(() => {
  //设置最大宽不超过屏幕高度
  mianRef.value.style.maxWidth = screen.width + "px"
  //路由刷新回到顶部
  watchsScroll = watch(() => route.path, async () => {
    scrollbarRef.value.setScrollTop(0)
    global.setScroll(0, 0)
  }, { immediate: true, deep: true })

})


onUnmounted(() => {
  //销毁监听
  watchsScroll()
})



</script>
<style lang="scss">
@import "@/style.scss";

:deep(.el-scrollbar__view) {
  min-height: 100vh;
}
</style>
