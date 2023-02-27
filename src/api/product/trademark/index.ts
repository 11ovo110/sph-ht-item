//引入二次封装的axios
import request from '@/utils/request';

//枚举接口地址
enum API {
    //获取已有品牌的数据
    getTrademarkList="/admin/product/baseTrademark/",
    addTrademark = '/admin/product/baseTrademark/save',
    updateTrademark = '/admin/product/baseTrademark/update',
    deleTrademark = '/admin/product/baseTrademark/remove/'
}
//获取已有品牌的数据
export const reqTrademarkList = (page:number,limit:number)=>request.get(API.getTrademarkList+`${page}/${limit}`)

export const reqAddTrademark = (data: any) => {
    if(data.id) {
        request.put(API.updateTrademark, data);
    }else {
        request.post(API.addTrademark, data);
    }
}

export const reqDeleteTrademark = (id: any) => request.delete(API.deleTrademark + id)