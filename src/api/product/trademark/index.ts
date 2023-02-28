import request from "@/utils/request";
import type { trademark, responseTrademarkData  } from "./model/index";

enum API {
  TradeMark = '/admin/product/baseTrademark/',
  AddTradeMark = '/admin/product/baseTrademark/save',
  UpdateTradeMark = '/admin/product/baseTrademark/update',
  DeleteTradeMark = '/admin/product/baseTrademark/remove'
}

export const reqTradeMark = (page: string, limit: string) => request.get<any, responseTrademarkData>(API.TradeMark + `${page}/${limit}`);

export const reqAddTradeMark = (data: trademark) => {
  if(data.id) {
    return request.put<any, any>(API.UpdateTradeMark, data);
  }else {
    return request.post<any, any>(API.AddTradeMark, data);
  }
}

export const reqDeleteTradeMark = (id: string) => request.delete<any, any>(API.DeleteTradeMark + `/${id}`);