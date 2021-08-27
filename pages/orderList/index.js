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
    loading: true,
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
    orderStatus: '',
    ballList: [{
      name: 0
    }, {
      name: 1
    }, {
      name: 2
    }, {
      name: 3
    }, {
      name: 4
    }, {
      name: 5
    }],
    isBindBall: false
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
  dateModalData: function (e) {
    wx.showToast({
      icon: 'none',
      title: e.detail.datetime + e.detail.times,
    })
  },
  //即时入驻
  todayEven: function (e) {
    wx.showToast({
      icon: 'none',
      title: e.detail.today + e.detail.times,
    })
  },


  claendarHidden: () => {

  },


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

    // 获取配置参数
    wx.getSystemInfo({
      success(res) {
        let isIpx = res;
        console.log('配置参数', isIpx);
        that.setData({
          isIpx
        })
        // 获取屏幕的大小
        let windowHeight = wx.getSystemInfoSync().windowHeight;
        let windowWidth = wx.getSystemInfoSync().windowWidth;
        console.log(windowWidth, windowHeight);

        wx.createSelectorQuery().selectAll('.custom').boundingClientRect(function (rect) {
          console.log(rect);
          let customHeight = rect[0].height;
          that.setData({
            customHeight
          })
        }).exec()
        let btnTop = isIpx ? windowHeight - 134 : windowHeight - 100;
        let btnLeft = windowWidth - 45;
        that.setData({
          windowHeight,
          windowWidth,
          btnLeft,
          btnTop
        })
      }
    })
  },


  // 悬浮球开始移动
  buttonStart(e) {
    // console.log('获取起始点', e)
    this.setData({
      startPoint: e.touches[0]
    })
  },

  // 悬浮球
  buttonMove(e) {
    let {
      startPoint,
      btnTop,
      btnLeft,
      windowWidth,
      windowHeight,
      isIpx
    } = that.data;
    // console.log('悬浮球元素', e);
    // 获取结束点
    let endPoint = e.touches[e.touches.length - 1]
    // 计算移动距离相差
    let translateX = endPoint.clientX - startPoint.clientX;
    let translateY = endPoint.clientY - startPoint.clientY;
    if (that.data.isBindBall && (endPoint.clientX != startPoint.clientX || endPoint.clientY != startPoint.clientY)) {
      that.takeback();
      that.setData({
        isBindBall: false,
        isShow: false
      })
    }
    // console.log(that.data.isBindBall);
    // 初始化
    startPoint = endPoint
    // 赋值
    btnTop = btnTop + translateY
    btnLeft = btnLeft + translateX

    // 临界值判断
    if (btnLeft + 45 >= windowWidth) {
      btnLeft = windowWidth - 45;
    }
    if (btnLeft <= 0) {
      btnLeft = 0;
    }
    if (that.data.isBindBall && btnLeft <= 45) {
      btnLeft = 50
    }
    if (that.data.isBindBall && btnLeft + 95 >= windowWidth) {
      btnLeft = windowWidth - 95
    }

    // 根据屏幕匹配临界值
    let topSpace = 100
    if (isIpx) {
      topSpace = 134
    } else {
      topSpace = 100
    }
    if (btnTop + topSpace >= windowHeight) {
      btnTop = windowHeight - topSpace
    }
    // 顶部tab临界值
    if (btnTop <= that.data.customHeight + 4) {
      btnTop = that.data.customHeight + 4
    }
    if (that.data.isBindBall && btnTop <= that.data.customHeight + 50) {
      btnTop = that.data.customHeight + 54
    }
    if (that.data.isBindBall && btnTop >= windowHeight - (topSpace + 30)) {
      btnTop = windowHeight - 184
    }
    // console.log(btnLeft, btnTop);
    that.setData({
      btnTop,
      btnLeft,
      startPoint
    })
  },


  // 点击弹出选项
  bindBall: function (e) {
    that.showOrHide();
    that.buttonMove(e);
  },


  // 动画
  showOrHide: function () {
    if (this.data.isShow) {
      //缩回动画
      this.takeback();
      this.setData({
        isShow: false
      })
    } else {
      //弹出动画
      this.popp();
      this.setData({
        isShow: true
      })
    }
  },

  //弹出动画
  popp: function () {
    let ballList = that.data.ballList;

    //计算菜单旋转出去的坐标
    function getPoint(Xr, deg) {
      var x = Math.round(Xr * Math.sin(deg * Math.PI / 180));
      var y = Math.round(Xr * Math.cos(deg * Math.PI / 180));
      return {
        x,
        y
      }
    };
    for (const key in ballList) {
      const element = ballList[key];
      let ballAnimation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
        // transformOrigin: '50% 50% 0' //缩放倍数
      })
      // parseFloat
      element.itemAnimation = ballAnimation.translate(getPoint(50, -key * 60).x, getPoint(-50, key * 60).y).rotate(720).opacity(1).step({delay: 50 * key});
    }
    that.setData({
      ballList: ballList,
      isBindBall: true
    })
  },

  //缩回动画
  takeback: function () {
    let ballList = that.data.ballList;
    for (const key in ballList) {
      const element = ballList[key];
      let ballAnimation = wx.createAnimation({
        timingFunction: 'ease'
      })
      element.itemAnimation = ballAnimation.translate(0, 0).rotate(360).opacity(0).step({duration: 300});
    }
    that.setData({
      ballList: ballList,
      isBindBall: false
    })
  },

  //解决滚动穿透问题
  myCatchTouch: function () {
    return
  },


  buttonEnd: function (e) {

  },



  // 订单列表
  orderListFn: (pageIndex, searchDate, orderStatus) => {
    that.setData({
      isFlag: false
    })
    let role = wx.getStorageSync('role');
    let data = {};
    if (role != 'merchant') {
      data = {
        pageSize: that.data.pageSize,
        pageIndex,
        pointId: wx.getStorageSync('pointId'),
        searchDate,
        orderStatus
      }
    } else {
      data = {
        pageSize: that.data.pageSize,
        pageIndex,
        merchantId: wx.getStorageSync('merchantId'),
        searchDate,
        orderStatus
      }
    }
    mClient.wxGetRequest(api.OrderList, data)
      .then(res => {
        console.log("订单列表数据", res);
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
            loading: false
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
          isFlag: true,
          loading: false
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
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
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