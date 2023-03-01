import request from "@/utils/request";

enum API {
  Category1 = '/admin/product/getCategory1',
  Category2 = '/admin/product/getCategory2/',
  Category3 = '/admin/product/getCategory3/',
  attrInfo = '/admin/product/attrInfoList/',
  addAttrOrUpdate = '/admin/product/saveAttrInfo',
  deletAttr = '/admin/product/deleteAttr/'
}

export const reqCategory1 = () => request.get(API.Category1);

export const reqCategory2 = (category1Id: any) => request.get(API.Category2 + category1Id);

export const reqCategory3 = (category2Id: any) => request.get(API.Category3 + category2Id);

export const reqAttrInfo = (c1Id: any, c2Id: any, c3Id: any) => request.get(API.attrInfo + `${c1Id}/${c2Id}/${c3Id}`);

export const reqAddattrOrUpdateAttr = (data: any) => request.post(API.addAttrOrUpdate, data);

export const reqDeleteAttr = (attrId: number | string) => request.delete(API.deletAttr + attrId);