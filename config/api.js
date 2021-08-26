const ApiRootUrl = 'https://w3.morninggo.cn/'; //测试
// const ApiRootUrl = 'https://api.morninggo.cn/';
// const ApiRootUrl = 'http://192.168.126.248:8080/app-http/';
module.exports = {
    RefreshAuth: ApiRootUrl + 'tobaccos/user/v2/refresh_auth', //刷新授权
    Login: ApiRootUrl + 'tobaccos/user/v2/auth', //登录授权
    merchantLogn: ApiRootUrl + 'tobaccos/user/v2/merchant', //运营商登录
    VerificationCode: ApiRootUrl + 'tobaccos/user/v2/smscode', //验证码

    Info: ApiRootUrl + 'tobaccos/user/v2/info', //用户信息
    MerchantInfo: ApiRootUrl + 'tobaccos/user/v2/merchantInfo', //运营商信息

    DeviceList: ApiRootUrl + 'tobaccos/product/deviceList', //设备列表

    GoodsRoad: ApiRootUrl + 'tobaccos/product/v2/goodsRoad', //货道列表
    Tobaccos: ApiRootUrl + 'tobaccos/product/addOrSubOne', //商品增减
    ProductTen: ApiRootUrl + 'tobaccos/product/tpoUpProduct', //加10

    GoodsRoadProductList: ApiRootUrl + 'tobaccos/product/goodsRoadProductList', //货道列表
    GoodsRoadChangeProduct: ApiRootUrl + 'tobaccos/product/goodsRoadChangeProduct', //货道商品切换

    OrderList: ApiRootUrl + 'tobaccos/order/orderList', //订单列表
    OrderDetails: ApiRootUrl + 'tobaccos/payment/orderDetails',

    ProductPrice: ApiRootUrl + 'tobaccos/order/checkedProductPrice', //退款选择后计算金额
    WxRefund: ApiRootUrl + 'tobaccos/order/wx_refund', //退款
    ManualShipment: ApiRootUrl + 'tobaccos/rder/manual_shipment', //手动退货

    QuantityTotal: ApiRootUrl + 'tobaccos/report/history/total', //时间段销售总额
    Historylist: ApiRootUrl + 'tobaccos/report/history/list', //时间段点位销售列表

    Todaytotal: ApiRootUrl + '/tobaccos/report/today/total', //今日销售总额
    TodayRankingList: ApiRootUrl + 'tobaccos/report/today/list', //今日点位销售列表
}