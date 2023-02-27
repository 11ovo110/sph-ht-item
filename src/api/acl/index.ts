//引入人家已经封装好的axios
import request from '@/utils/request';
import type { loginData, loginResponseData, userInfoResponseData } from './model/user';
//枚举书写用户相关的接口
enum API {
    LOGIN = "/admin/acl/index/login",//登录接口
    USERINFO = "/admin/acl/index/info",//获取用户信息
    LOGOUT = '/admin/acl/index/logout'//退出登录接口
}
//分别暴露登录接口
export const reqLogin = (data: loginData) => request.post<any, loginResponseData>(API.LOGIN, data);
//获取用户信息
export const reqUserInfo = () => request.get<any, userInfoResponseData>(API.USERINFO);
//退出登录接口
export const reqLogout = () => request.post<any, any>(API.LOGOUT); 