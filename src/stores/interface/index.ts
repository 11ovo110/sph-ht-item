import type { RouteRecordRaw } from "vue-router";

// 用户信息包括权限数据
export interface UserInfoState {
  token: string | null;
	avatar: string;
	name: string;

  menuRoutes: RouteRecordRaw[] | string // 用于生成导航菜单的路由列表
}




