// pages/orderList/index.js
const app = getApp();
let that;
import * as mClient from '../../utils/requestUrl';
import * as api from '../../config/api';
import * as util from '../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    pageIndex: '1',
    pageSize: '20',
    isFlag: false,
    pull: {
      isLoading: false,
      loading: '../../resource/img/pull_refresh.gif',
      pullText: '正在刷新'
    },
    push: {
      isLoading: false,
      loading: '../../resource/img/pull_refresh.gif',
      pullText: ''
    },
    date: '',
    priceSum: -1, //当日销售总额
    isshowDate: false,
    array: [{
      orderStatus: 2,
      text: '已完成'
    }, {
      orderStatus: 3,
      text: '出货失败'
    }, {
      orderStatus: 4,
      text: '已退款'
    }],
    selectarray: '请选择状态',
    orderStatus: ''
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    let index = e.detail.value;
    let array = that.data.array;
    let orderStatus = '';
    if (index == 0) {
      orderStatus = '2'
    } else if (index == 1) {
      orderStatus = '3'
    } else if (index == 2) {
      orderStatus = '4'
    }
    console.log('订单状态', orderStatus);
    that.setData({
      index: e.detail.value,
      pageIndex: '1',
      orderList: [],
      selectarray: array[e.detail.value].text,
      orderStatus: orderStatus
    })
    let pageIndex = '1';
    that.orderListFn(pageIndex, that.data.date, orderStatus);
  },

  //点击确认日期从组件上传来数据
  // dateModalData: function (e) {
  //   wx.showToast({
  //     icon: 'none',
  //     title: e.detail.datetime + e.detail.times,
  //   })
  // },
  // //即时入驻
  // todayEven: function (e) {
  //   wx.showToast({
  //     icon: 'none',
  //     title: e.detail.today + e.detail.times,
  //   })
  // },

  // claendarHidden: () => {
  //   that.setData({
  //     isShow: true
  //   })
  // },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      orderList: [],
      date: '',
      selectarray: '请选择状态'
    })
    let pageIndex = '1';
    that.orderListFn(pageIndex);
  },

  // 订单列表
  orderListFn: (pageIndex, searchDate, orderStatus) => {
    that.setData({
      isFlag: false
    })
    const data = {
      pageSize: that.data.pageSize,
      pageIndex,
      pointId: wx.getStorageSync('pointId'),
      searchDate,
      orderStatus
    }
    mClient.wxGetRequest(api.OrderList, data)
      .then(res => {
        console.log("订单列表", res);
        if (res.data.code == "200") {
          let orderList = res.data.data.orderList;
          // that.setData({
          //   priceSum: res.data.data.priceSum
          // })
          if (orderList) {
            orderList.forEach(element => {
              if (element.orderStatus === '2') {
                element.orderStatus = '已完成'
              } else if (element.orderStatus === '3') {
                element.orderStatus = '出货失败'
              } else if (element.orderStatus === '4') {
                element.orderStatus = '已退款'
              } else {
                element.orderStatus = '已取消'
              }
              element.createDate = util.timestampToTimeLong(element.createDate);
            });
          }
          orderList = that.data.orderList.concat(orderList);
          if (orderList.length >= 10) {
            const pullText = '- 上拉加载更多 -'
            that.setData({
              'push.pullText': pullText,
            })
          }
          if (orderList.length <= 0) {
            that.setData({
              isFlag: true
            })
          }
          console.log('修改后订单列表', orderList);
          that.setData({
            orderList: orderList,
            pageIndex: pageIndex,
            count: res.data.data.count,
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000
          })
          that.setData({
            isFlag: true
          })
        }
      })
      .catch(rej => {
        console.log('无法请求', rej);
        wx.showToast({
          title: '服务器忙，请稍后重试',
          icon: 'none',
          duration: 2000
        })
        that.setData({
          isFlag: true
        })
      })
  },

  //日期选择
  bindDateChange: (e) => {
    console.log(e);
    let date = e.detail.value;
    that.setData({
      date: date,
      'push.pullText': ''
    })
    let pageIndex = '1';
    that.setData({
      pageIndex: '1',
      orderList: []
    })
    that.orderListFn(pageIndex, date, that.data.orderStatus);
  },

  gotoOrderDetailFn: (e) => {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/orderList/orderDetail/index',
      events: {
        someEvent: function (data) {
          console.log(data)
          if (data) {
            let pageIndex = '1';
            that.setData({
              pageIndex: '1',
              orderList: []
            })
            that.orderListFn(pageIndex, that.data.date, that.data.orderStatus);
          }
        }
      },
      success: function (res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          orderid: id
        })
      }
    })
  },

  refresh() {
    let pageIndex = '1';
    // let date = util.customFormatTime(new Date());
    that.setData({
      pageIndex: '1',
      orderList: [],
      date: '',
      priceSum: -1,
      selectarray: '请选择状态',
      orderStatus: ''
    })
    if (that.data.orderList.length <= 0) {
      that.setData({
        'pull.isLoading': true,
        'pull.loading': '../../resource/img/pull_refresh.gif',
        'pull.pullText': '正在刷新',
        'push.pullText': '',
      })
      that.orderListFn(pageIndex);
      setTimeout(() => {
        that.setData({
          'pull.loading': '../../resource/img/finish.png',
          'pull.pullText': '刷新完成',
          'pull.isLoading': false
        })
      }, 1500)
    }
  },


  toload() {
    let pageIndex = that.data.pageIndex;
    let count = that.data.count;
    if (that.data.orderList.length < count) {
      that.setData({
        'push.isLoading': true,
        'push.pullText': '正在加载',
        'push.loading': '../../resource/img/pull_refresh.gif',
      })
      pageIndex++;
      console.log(pageIndex)
      pageIndex = String(pageIndex);
      console.log(pageIndex)
      that.orderListFn(pageIndex, that.data.date, that.data.orderStatus);
      setTimeout(() => {
        that.setData({
          pageIndex: pageIndex,
          'push.isLoading': false,
          'push.pullText': '- 上拉加载更多 -',
          'push.loading': '../../resource/img/finish.png',
        })
      }, 1500)
    } else if (that.data.orderList.length > 0 && (pageIndex * that.data.pageSize) > count) {
      that.setData({
        'push.isLoading': false,
        'push.pullText': '- 我也是有底线的 -'
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const query = wx.createSelectorQuery().in(this)
    query.selectAll('.custom').boundingClientRect(function (res) {
      const customHeight = res[0].height;
      that.setData({
        customHeight: customHeight
      })
    }).exec()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // that.setData({
    //   orderList: [],
    //   date: '',
    //   selectarray: '请选择状态'
    // })
    // let pageIndex = '1';
    // that.orderListFn(pageIndex);

    // let date = util.customFormatTime(new Date());
    // that.setData({
    //   date: date
    // })
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('触底了')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})