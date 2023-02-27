//引入createRouter:用于创建路由器对象(全局守卫)
//引入createWebHistory:创建history模式
import { createRouter, createWebHistory } from 'vue-router';
//路由器管理的全部路由
import { staticRoutes } from '@/router/routes';
//创建路由器对象
const router = createRouter({
  //模式的设置
	history: createWebHistory(),
  //路由器管理的路由对象
	routes: staticRoutes,
  //路由跳转滚动行为
  scrollBehavior() {
    return { top: 0, left: 0}
  },
})

// 导出路由
export default router;