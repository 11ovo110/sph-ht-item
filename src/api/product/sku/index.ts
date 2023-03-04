import request from "@/utils/request";

enum API {
  AllSku = '/admin/product/list/',
  cancelSku = '/admin/product/cancelSale/',
  onSaleSku = '/admin/product/onSale/',
  deleteSku = '/admin/product/deleteSku/',
  getSku = '/admin/product/getSkuById/'
}

export const reqgetAllSku = (page: number, limit: number) => request.get(API.AllSku + `${page}/${limit}`);

export const reqCancelSku = (skuId: number | string) => request.get(API.cancelSku + skuId);

export const reqOnSaleSku = (skuId: number | string) => request.get(API.onSaleSku + skuId);

export const reqDeleteSku = (skuId: number | string) => request.delete(API.deleteSku + skuId);

export const reqgetSku = (skuId: number | string) => request.get(API.getSku + skuId);