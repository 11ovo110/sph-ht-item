//vue-router:提供的路由的tsleixing
import type { RouteRecordRaw } from 'vue-router';
/**
 * 路由meta对象参数说明
 * meta: {
 *      title:          菜单栏及 tagsView 栏、菜单搜索名称（国际化）
 *      hidden：        是否隐藏此路由
 *      icon：          菜单、tagsView 图标，阿里：加 `iconfont xxx`，fontawesome：加 `fa xxx`
 * }
 */

/**
 * 静态路由（默认路由）
 */

//login|404
export const staticRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',//路由路径
    name: 'Login',//命名路由
    component: () => import('@/views/login/index.vue'),//加载路由组件
    //路由元信息
    meta: {
      hidden: true,//路由元信息hidden决定次路由在首页左侧导航是否隐藏
    }
  },
  {
    path: '/404',//路由路径
    name: '404',//命名路由
    component: () => import('@/views/error/404.vue'),//路由懒加载
    meta: {
      hidden: true
    }
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    children: [{
      path: 'home',//首页二级路由
      name: 'Home',//命名路由
      component: () => import('@/views/home/index.vue'),//路由懒加载
      meta: {
        title: '首页',//决定次路由在菜单与导航显示文字 
        icon: 'ele-ChromeFilled',//决定次路由组件在左侧菜单展示图标 [element-plus里面图标]
        hidden: false//能决定次路由在左侧菜单是都显示
      }
    }]
  },
  {
    path: "/product",//路径
    component: () => import('@/layout/index.vue'),//人家提供的layout结构
    name: 'Product',
    meta: {//路由元信息
      title: '商品管理',
      icon: 'ele-Goods'
    },
    redirect:'/product/trademark',
    children: [
      {
        path: 'trademark',
        component: () => import('@/views/product/trademark/index.vue'),
        name: "Trademark",
        meta: {
          title: '品牌管理',
          icon: 'ele-SwitchFilled'
        }
      },
      {
        path: 'attr',
        component: () => import('@/views/product/attr/index.vue'),
        name: "Attr",
        meta: {
          title: '平台属性管理',
          icon: 'ele-ElementPlus'
        }
      },
      {
        path: 'spu',
        component: () => import('@/views/product/spu/index.vue'),
        name: "Spu",
        meta: {
          title: 'spu管理',
          icon: 'ele-Lollipop'
        }
      },
      {
        path: 'sku',
        component: () => import('@/views/product/sku/index.vue'),
        name: "Sku",
        meta: {
          title: 'sku管理',
          icon: 'ele-Operation'
        }
      }
    ]
  },
  /* 匹配任意的路由 必须最后注册 */
  {
    path: '/:pathMatch(.*)',
    name: 'Any',
    redirect: '/404',
    meta: {
      hidden: true
    }
  }
];


