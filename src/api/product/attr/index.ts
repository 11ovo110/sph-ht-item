import request from "@/utils/request";

enum API {
  category1 = '/admin/product/getCategory1',
  category2 = '/admin/product/getCategory2/',
  category3 = '/admin/product/getCategory3/',
  AddCategory = '/admin/product/saveAttrInfo',
  getCategory = '/admin/product/attrInfoList/'
}

export const reqCategory1 = () => request.get(API.category1);

export const reqCategory2 = (c2Id: any) => request.get(API.category2 + c2Id);

export const reqCategory3 = (c3Id: any) => request.get(API.category3 + c3Id);

export const reqAddOrUpdateCategory = (data: any) => request.post(API.AddCategory, data);

export const reqGetCategory = (c1Id: any, c2Id: any, c3Id: any) => request.get(API.getCategory + `${c1Id}/${c2Id}/${c3Id}`);