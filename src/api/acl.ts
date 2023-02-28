import request from "@/utils/request";
import type {loginData, userInfoResponseData, loginResponseData } from '@/api/model/user';

enum API {
  LOGIN = '/admin/acl/index/login',
  userInfo = '/admin/acl/index/info',
  LOGOUT = '/admin/acl/index/logout',
}

export const reqLogin = (data: loginData) => request.post<any, loginResponseData>(API.LOGIN, data);

export const reqGetInfo = () => request.get<any, userInfoResponseData>(API.userInfo);

export const reqLogout = () => request.post(API.LOGOUT);

