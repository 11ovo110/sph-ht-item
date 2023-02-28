import request from "@/utils/request";

enum API {
  category1 = '/admin/product/getCategory1',
  category2 = '/admin/product/getCategory2/',
  category3 = '/admin/product/getCategory3/',
  getCategory = '/admin/product/attrInfoList/',
  addCategory = '/admin/product/saveAttrInfo',
  deleCategory = '/admin/product/deleteAttr/'
}

export const reqCategory1 = () => request.get(API.category1);

export const reqCategory2 = (category1Id: any) => request.get(API.category2 + category1Id);

export const reqCategory3 = (category2Id: any) => request.get(API.category3 + category2Id);

export const reqGetCategory = (c1Id: any, c2Id: any, c3Id: any) => request.get(API.getCategory + `${c1Id}/${c2Id}/${c3Id}`);

export const reqAddCategoryOrUpdate = (data: any) => request.post(API.addCategory, data);

export const reqDeleteCategory = (attrId: any) => request.delete(API.deleCategory + attrId);