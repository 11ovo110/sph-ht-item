import request from "@/utils/request";

enum API {
  TradeMark = '/admin/product/baseTrademark/',
  AddTradeMark = '/admin/product/baseTrademark/save',
  UpdateTradeMark = '/admin/product/baseTrademark/update',
  DeleteTradeMark = '/admin/product/baseTrademark/remove'
}

export const reqTradeMark = (page: any, limit: any) => request.get(API.TradeMark + `${page}/${limit}`);

export const reqAddTradeMark = (data: any) => {
  if(data.id) {
    return request.put(API.UpdateTradeMark, data);
  }else {
    return request.post(API.AddTradeMark, data);
  }
}

export const reqDeleteTradeMark = (id: string) => request.delete(API.DeleteTradeMark + `/${id}`);