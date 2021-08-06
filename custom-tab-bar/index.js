// custom-tab-bar/index.js
const app =getApp();
Component({
  data: {
    selected: null,
    list: []
  },
  // 生命周期
  attached() {
    console.log(app.globalData.list)
    this.setData({
      list:app.globalData.list
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
      wx.switchTab({url})
    }
  }
})