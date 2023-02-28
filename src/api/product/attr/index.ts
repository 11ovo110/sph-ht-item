import request from "@/utils/request";

enum API {
  category1 = '/admin/product/getCategory1',
  category2 = '/admin/product/getCategory2/',
  category3 = '/admin/product/getCategory3/',
  addCategory = '/admin/product/saveAttrInfo',
  getCategory = '/admin/product/attrInfoList/'
}

export const reqGetcategory1 = () => request.get(API.category1);

export const reqGetcategory2 = (c1Id: any) => request.get(API.category2 + c1Id);

export const reqGetcategory3 = (c2Id: any) => request.get(API.category3 + c2Id);

export const reqAddCategory = (data: any)  => request.post(API.addCategory, data);

export const reqGetCategory = (c1Id: any, c2Id: any, c3Id: any) => request.get(API.getCategory + `${c1Id}/${c2Id}/${c3Id}`);

