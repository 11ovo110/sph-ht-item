import request from "@/utils/request";

enum API {
  getAttrInfo = '/admin/product/',
  AllattrList = '/admin/product/baseSaleAttrList',
  imgList = '/admin/product/spuImageList/',
  OwnattrList = '/admin/product/spuSaleAttrList/',
  AllTrademark = '/admin/product/baseTrademark/getTrademarkList'
}

export const reqgetAttrInfo = (page: number, limit: number, c3Id: number | string) => request.get(API.getAttrInfo + `${page}/${limit}?category3Id=${c3Id}`);

export const reqAllattrList = () => request.get(API.AllattrList);
export const reqAllTrademark = () => request.get(API.AllTrademark);
export const reqOwnattrList = (spuId: number | string) => request.get(API.OwnattrList + spuId);
export const reqimgList = (spuId: number | string) => request.get(API.imgList + spuId);