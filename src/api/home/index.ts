import mockRequest from '@/utils/mockRequest';
import request from '@/utils/request';

// 获取可视化数据
export const reqData = () => mockRequest.get('/data');

// 获取用户数据
export const reqUser = (page: number, limit: number) => request.get(`/admin/user/${page}/${limit}`);