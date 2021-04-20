const ApiRootUrl = 'https://w3.morninggo.cn/'; //测试
// const ApiRootUrl = 'https://api.morninggo.cn/';
// const ApiRootUrl = 'http://192.168.126.229:8080/morninggo_app_http_war/';
// const ApiRootUrl = 'http://192.168.126.248:8080/app-http/';
module.exports = {
    RefreshAuth: ApiRootUrl + 'tobaccos/user/refresh_auth', //刷新授权
    Login: ApiRootUrl + 'tobaccos/user/auth', //登录授权
    VerificationCode: ApiRootUrl + 'tobaccos/user/smscode', //验证码

    Info: ApiRootUrl + 'tobaccos/user/info', //用户信息

    DeviceList: ApiRootUrl + 'tobaccos/product/deviceList', //设备列表

    GoodsRoad: ApiRootUrl + 'tobaccos/product/goodsRoad', //货道列表
    Tobaccos: ApiRootUrl + 'tobaccos/product/addOrSubOne', //商品增减
    ProductTen: ApiRootUrl + 'tobaccos/product/tpoUpProduct', //加10
    
    GoodsRoadProductList: ApiRootUrl + 'tobaccos/product/goodsRoadProductList', //货道列表
    GoodsRoadChangeProduct: ApiRootUrl + 'tobaccos/product/goodsRoadChangeProduct', //货道商品切换

    OrderList: ApiRootUrl + 'tobaccos/order/orderList', //订单列表
    OrderDetails: ApiRootUrl + 'tobaccos/payment/orderDetails',

    ProductPrice: ApiRootUrl + 'tobaccos/order/checkedProductPrice', //退款选择后计算机额
    WxRefund: ApiRootUrl + 'tobaccos/order/wx_refund', //退款
    ManualShipment: ApiRootUrl + 'tobaccos/order/manual_shipment', //手动退货
}