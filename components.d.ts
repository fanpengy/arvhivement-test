// generated by unplugin-vue-components
// We suggest you to commit this file into source control
// Read more: https://github.com/vuejs/core/pull/3399
import '@vue/runtime-core'

export {}

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    Card: typeof import('./src/components/homeVideoList/card.vue')['default']
    ElScrollbar: typeof import('element-plus/es')['ElScrollbar']
    ElSkeleton: typeof import('element-plus/es')['ElSkeleton']
    ElSkeletonItem: typeof import('element-plus/es')['ElSkeletonItem']
    RouterLink: typeof import('vue-router')['RouterLink']
    RouterView: typeof import('vue-router')['RouterView']
    SvgIcon: typeof import('./src/components/SvgIcon/index.vue')['default']
  }
  export interface ComponentCustomProperties {
    vInfiniteScroll: typeof import('element-plus/es')['ElInfiniteScroll']
    vLoading: typeof import('element-plus/es')['ElLoadingDirective']
  }
}
