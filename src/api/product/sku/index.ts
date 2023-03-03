import request from "@/utils/request";

enum API {
  SkuList = '/admin/product/list/',
  onSaleSku = '/admin/product/onSale/',
  cancelSku = '/admin/product/cancelSale/',
  deletSku = '/admin/product/deleteSku/'
}

export const reqgetSkuList = (page: number, limit: number) => request.get(API.SkuList + `${page}/${limit}`);

export const reqOnSaleSku = (skuId: number | string) => request.get(API.onSaleSku + skuId);

export const reqCancelSku = (skuId: number | string) => request.get(API.cancelSku + skuId);

export const reqdeleteSku = (skuId: number | string) => request.delete(API.deletSku + skuId);