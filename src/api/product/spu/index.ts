import request from "@/utils/request";

enum API {
  getAttrInfo = '/admin/product/',
  AllattrList = '/admin/product/baseSaleAttrList',
  AllTrademark = '/admin/product/baseTrademark/getTrademarkList',
  imgList = '/admin/product/spuImageList/',
  OwnattrList = '/admin/product/spuSaleAttrList/'
}

export const reqgetAttrInfo = (page: any, limit: any, c3Id: any) => request.get(API.getAttrInfo + `${page}/${limit}?category3Id=${c3Id}`);

export const reqAllattrList = () => request.get(API.AllattrList);

export const reqAllTrademark = () => request.get(API.AllTrademark);
export const reqgetimgList = (spuId: any) => request.get(API.imgList + spuId);
export const reqOwnattrList = (spuId: any) => request.get(API.OwnattrList + spuId);