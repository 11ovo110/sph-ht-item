//引入二次封装的axios
import request from '@/utils/request';

//枚举接口地址
enum API {
    //获取已有品牌的数据
    getTrademarkList="/admin/product/baseTrademark/",
    addTrademark = '/admin/product/baseTrademark/save',
    updateTrademark = '/admin/product/baseTrademark/update',
    deleteTrademark = '/admin/product/baseTrademark/remove/'
}
//获取已有品牌的数据
export const reqTrademarkList = (page:number,limit:number)=>request.get(API.getTrademarkList+`${page}/${limit}`)

export const AddTrademark = (data: any) => {
    if(data.id) {
        return request.put(API.updateTrademark, data);
    }else {
        return request.post(API.addTrademark, data);
    }
}

export const DeleteTrademark = (id: any) => request.delete(API.deleteTrademark + id);