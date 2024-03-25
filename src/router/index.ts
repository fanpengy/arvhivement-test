import { useGlobalStore } from "@/store/main";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
    // {
    //     path: '',
    //     name: 'Home',
    //     meta: {
    //         title: '首页',
    //         requireAuth: false,
    //         keepAlive: false
    //     },
    //     component: () => import('@/views/home/home.vue')
    // },
    {
        path: '',
        name: 'Test',
        meta: {
            title: '测试',
            requireAuth: false,
            keepAlive: false
        },
        component: () => import('@/views/home/homenew.vue')
    },
    //登入
    // {
    //     path: "/login",
    //     name: "Login",
    //     meta: {
    //         title: '登入',
    //         requireAuth: false,
    //         keepAlive: false
    //     },
    //     component: () => import('@/views/login/loginnew.vue'),
    // },
    //未匹配路由404
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/404.vue'),

    }

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});


router.beforeEach((to, from, next) => {
    const globalStore = useGlobalStore()
    globalStore.globalData.router.currentRouter = to.path
    // if(to.path !== "/login"){
    //     let  userInfo = useUserStore();
    //     if (userInfo.userInfoData.id == 0 ){
    //         ElMessage({
    //             message: '请先登入',
    //             type: 'error',
    //         })
    //         next({name : "Login"})
    //         return
    //     }
    // }

    next()
})

export default router;
