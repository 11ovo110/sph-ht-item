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
        icon: 'ele-Eleme',//决定次路由组件在左侧菜单展示图标 [element-plus里面图标]
        hidden: false//能决定次路由在左侧菜单是都显示
      }
    }]
  }
];

// 异步路由
export const asyncRoutes = [
  {
    name: 'Acl',
    path: '/acl',
    component: () => import('@/layout/index.vue'),
    redirect: '/acl/user/list',
    meta: { title: '权限管理', icon: 'ele-Setting' },
    children: [
      {
        name: 'User',
        path: '/acl/user/list',
        component: () => import('@/views/acl/user/index.vue'),
        meta: { title: '用户管理' }
      },
      {
        name: 'Role',
        path: '/acl/role/list',
        component: () => import('@/views/acl/role/index.vue'),
        meta: {
          title: '角色管理',
        },
      },
      {
        name: 'RoleAuth',
        path: '/acl/role/auth',
        component: () => import('@/views/acl/role/roleAuth.vue'),
        meta: {
          title: '角色管理',
          hidden: true,
          activeMenu: '/acl/role/list',
        },
      },
      {
        name: 'Permission',
        path: '/acl/permission/list',
        component: () => import('@/views/acl/permission/index.vue'),
        meta: {
          title: '菜单管理',
        }
      }
    ]
  },
  {
    path: '/product',
    name: 'Product',
    component: () => import('@/layout/index.vue'),
    meta: {
      title: '商品管理',
      icon: 'ele-ShoppingBag'
    },
    redirect: '/product/trademark',
    children: [
      {
        path: 'trademark',
        name: 'Trademark',
        component: () => import('@/views/product/trademark/trademark.vue'),
        meta: {
          title: '品牌管理',
          icon: 'ele-Present',
        }
      },
      {
        path: 'attr',
        name: 'Attr',
        component: () => import('@/views/product/attr/attr.vue'),
        meta: {
          title: '平台属性管理',
          icon: 'ele-CollectionTag',
        }
      },
      {
        path: 'spu',
        name: 'Spu',
        component: () => import('@/views/product/spu/spu.vue'),
        meta: {
          title: 'spu管理',
          icon: 'ele-Ship',
        }
      },
      {
        path: 'sku',
        name: 'Sku',
        component: () => import('@/views/product/sku/sku.vue'),
        meta: {
          title: 'sku管理',
          icon: 'ele-WindPower',
        }
      }
    ]
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('@/layout/index.vue'),
    meta: {
      title: '测试模块',
      icon: 'ele-Plus'
    },
    children: [
      {
        path: 'demo',
        name: 'Test1',
        component: () => import('@/views/Test/demo/index.vue'),
        meta: {
          title: '测试模块1',
          icon: 'ele-Edit',
        }
      },
      {
        path: 'demo1',
        name: 'Test2',
        component: () => import('@/views/Test/demo1/index.vue'),
        meta: {
          title: '测试模块2',
          icon: 'ele-infoFilled',
        }
      }
    ]
  },                                                     
]


/* 匹配任意的路由 必须最后注册 */
export const anyRoute = {
  path: '/:pathMatch(.*)',
  name: 'Any',
  redirect: '/404',
  meta: {
    hidden: true
  }
}


