import { defineStore } from "pinia";
// 引入api
import { reqLogin, reqGetInfo, reqLogout } from "@/api/acl";
// 引入token函数
import { getToken, setToken, removeToken } from "@/utils/token-utils";
// 引入所有路由组件
import { staticRoutes, asyncRoutes, anyRoute } from "@/router/routes";
import type {UserInfoState} from './interface/index'; 
import type {loginData} from '@/api/model/user';
import cloneDeep from 'lodash/cloneDeep';
import router from "@/router";

function filterAsyncRoutes(asyncRoutes: any, routes: any) {
  return asyncRoutes.filter((item: { name: any; children: any; }) => {
    if(routes.includes(item.name)) {
      if(item.children && item.children.length) {
        item.children = filterAsyncRoutes(item.children, routes);
      }
      return true;
    }
  })
}

// 创建小仓库
export const useUserInfoStore = defineStore('userInfo', {
  state: ():UserInfoState => ({
    token: getToken(),  // 从本地获取token
    avatar: '',  // 头像
    name: '',    // 用户名
    menuRoutes: [],  //layout一级路由组件|左侧菜单组件需要用数据
    buttons: []
  }),
  actions: {
    // 登录业务逻辑
    async login(username: any, password: any) {
      // 获取请求参数，用户名，密码
      let data: loginData = {username, password};
      // 发送登录请求，获取token
      let result: any = await reqLogin(data);
      // state 存储token
      this.token = result.token;
      // 本地存储token
      setToken(result.token);
    },
    async getInfo() {
      // 获取用户信息逻辑
      // 发送用户请求
      let result: any = await reqGetInfo();
      // 仓库存储按钮权限
      this.buttons = result.buttons;
      // 仓库存储头像
      this.avatar = result.avatar;
      // 仓库存储用户名
      this.name = result.name;
      // 仓库存储路由组件
      let routes = result.routes;
      let userAsyncRoutes = filterAsyncRoutes(cloneDeep(asyncRoutes), routes);
      this.menuRoutes = [...staticRoutes, ...userAsyncRoutes, anyRoute];
      this.menuRoutes.forEach(item => router.addRoute(item));
    },
    async reset() {
      // 退出登录逻辑
      // 发送用户退出登录请求
      let result = await reqLogout();
      // 清空仓库的头像、姓名、token、路由组件数据
      this.avatar = '';
      this.name = '';
      this.token = '';
      // 清空本地存储的token
      removeToken();
      this.menuRoutes = '';

      let routes = router.getRoutes();
      routes.forEach((item: any) => router.removeRoute(item.name))
      staticRoutes.forEach(item => router.addRoute(item));
    }
  }
})