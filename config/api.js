// const ApiRootUrl = 'https://w3.morninggo.cn/'; //晨购
// const ApiRootUrl = 'https://api.morninggo.cn/';
const ApiRootUrl = 'http://192.168.126.247:8080/morninggo_app_http_war/';
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
}