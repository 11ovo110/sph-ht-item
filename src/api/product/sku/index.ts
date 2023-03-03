import request from "@/utils/request";

enum API {
  skuAll = '/admin/product/list/',
  deleteSku = '/admin/product/deleteSku/',
  onSaleSku = '/admin/product/onSale/',
  cancelSku = '/admin/product/cancelSale/'
}

export const reqAllSku = (page: any, limit: any) => request.get(API.skuAll + `${page}/${limit}`);

export const reqdeleteSku = (skuId: number | string) => request.delete(API.deleteSku + skuId);

export const reqSaleSku = (skuId: number | string) => request.get(API.onSaleSku + skuId);

export const reqCancelSku = (skuId: number | string) => request.get(API.cancelSku + skuId);