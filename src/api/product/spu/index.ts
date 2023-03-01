import request from "@/utils/request";

enum API {
  getSpuData = '/admin/product/'
}

export const reqgetSPUDate = (page: number, limit: number, category3Id: number | string) => request.get(API.getSpuData + `${page}/${limit}?category3Id=${category3Id}`); 