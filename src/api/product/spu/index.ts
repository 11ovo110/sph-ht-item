import request from "@/utils/request";

enum API {
  getSpuData = '/admin/product/',
  getTrademarkList = '/admin/product/baseTrademark/getTrademarkList',
  getSpuImage = '/admin/product/spuImageList/',
  getSaleAttr = '/admin/product/spuSaleAttrList/',
  getAllAttr = '/admin/product/baseSaleAttrList',
  saveSpu = '/admin/product/saveSpuInfo',
  updateSpu = '/admin/product/updateSpuInfo'
}

export const reqgetSPUDate = (page: number, limit: number, category3Id: number | string) => request.get(API.getSpuData + `${page}/${limit}?category3Id=${category3Id}`); 

// 获取所有品牌的请求
export const reqgetTrademarkList = () => request.get(API.getTrademarkList);

// 获取某一个照片墙的接口
export const reqgetSpuImageList = (spuId: any) => request.get(API.getSpuImage + spuId);

// 获取某一个已有的SPU销售属性的接口
export const reqgetSaleAttr = (spuId: any) => request.get(API.getSaleAttr + spuId);

// 获取所有的销售属性
export const reqgetAllAttr = () => request.get(API.getAllAttr);

export const reqSaveOrUpdateSpu = (data: any) => {
  if(data.id) {
    return request.post(API.updateSpu, data);
  }else {
    return request.post(API.saveSpu, data);
  }
}


