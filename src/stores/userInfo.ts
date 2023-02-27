//创建用户相关的小仓库
import { defineStore } from "pinia";
import type { loginData, loginResponseData, userInfoResponseData } from '../api/acl/model/user';
//引入请求函数
import { reqLogin, reqUserInfo, reqLogout } from "@/api/acl";
//引入持久化存储token方法
import { setToken, getToken, removeToken } from "@/utils/token-utils";
//仓库存储全部路由,因为左侧菜单组件需要这个数组
import { staticRoutes } from "@/router/routes";
import type { UserInfoState } from './interface/index'
//对外暴露可以获取小仓库的方法
export const useUserInfoStore = defineStore('userInfo', {
  //小仓库存储数据地方
  state: (): UserInfoState => ({
    token: getToken(),//从本地存储获取token
    name: '',//用户名字
    avatar: '',//用户头像
    menuRoutes: [],//layout一级路由组件|左侧菜单组件需要用数据
  }),
  //书写小仓库方法的地方
  actions: {
    //登录方法
    //如果登录请求:登录成功，第一次遇见token
    async login(username: string, password: string) {
      //登录请求接口 登录需要携带参数
      let data: loginData = { username, password };
      //需要配置代理跨域
      let result: loginResponseData = await reqLogin(data);
      //pinia仓库存储一份
      this.token = result.token;
      //本地存储存储一份
      setToken(result.token);
    },
    //获取用户信息
    //全局守卫:在调用获取用户信息
    async getInfo() {
      //获取用户信息:请求拦截器携带token公共参数
      let result: userInfoResponseData = await reqUserInfo();
      //用户信息包含:用户名字、用户头像、按钮权限数组、当前用户路由权限数组、账号职位数组
      this.name = result.name;
      this.avatar = result.avatar;
      //小仓库存储项目全部路由
      this.menuRoutes = staticRoutes;//包含meta:title+icon路由会在左侧菜单显示
    },
    //退出登录
    async reset() {
      //退出登录请求
      await reqLogout();
      //清除pinia仓库数据
      this.token = '';
      this.name = '';
      this.avatar = '';
      this.menuRoutes = [];
      //本地存储
      removeToken();
    }
  }
});

