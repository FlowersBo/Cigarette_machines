// custom-tab-bar/index.js
const app = getApp();
Component({
  data: {
    selected: null,
    list: []
  },
  // 生命周期
  attached(){

  },
  
  ready() {
    let role = wx.getStorageSync('role');
    let list = this.data.list;
    if (role != 'merchant') {
      list = [{
          pagePath: "/pages/index/index",
          text: "商品",
          iconPath: "/assets/tabbar/baobiao.png",
          selectedIconPath: "/assets/tabbar/baobiao-h.png"
        },
        {
          pagePath: "/pages/orderList/index",
          text: "订单",
          iconPath: "/assets/tabbar/dingdan.png",
          selectedIconPath: "/assets/tabbar/dingdan-h.png"
        },
        {
          pagePath: "/pages/user/index",
          text: "我的",
          iconPath: "/assets/tabbar/menu-mine.png",
          selectedIconPath: "/assets/tabbar/menu-mine-h.png"
        }
      ]
    } else {
      list = [{
          pagePath: "/pages/statement/index",
          text: "报表",
          iconPath: "/assets/tabbar/statement.png",
          selectedIconPath: "/assets/tabbar/statement-h.png"
        },
        {
          pagePath: "/pages/orderList/index",
          text: "订单",
          iconPath: "/assets/tabbar/dingdan.png",
          selectedIconPath: "/assets/tabbar/dingdan-h.png"
        },
        {
          pagePath: "/pages/user/index",
          text: "我的",
          iconPath: "/assets/tabbar/menu-mine.png",
          selectedIconPath: "/assets/tabbar/menu-mine-h.png"
        }
      ]
    };
    console.log('当前TabBar', list);
    this.setData({
      list
    })
  },
  methods: {
    //切换tabbar
    switchTab(e) {
      const data = e.currentTarget.dataset;
      app.globalData.selected = data.index;
      // this.setData({
      //   selected: data.index
      // })
      const url = data.path
      wx.switchTab({
        url
      })
    }
  }
})