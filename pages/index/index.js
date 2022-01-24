import * as mClient from '../../utils/requestUrl';
import * as api from '../../config/api';
let that;
Page({
  data: {
    // navState: 0, //导航状态
    cardCur: 0,
    pageIndex: '1',
    pageSize: '60',
    deviceId: '',
    selectGoodsDeviceId: false, //选择返回
    goodsNavTitle: ['货道', '商品名称', '设备库存', '门店库存'],
    goodsRoadList: [],
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
    ballList: [{
      name: 'C柜'
    }, {
      name: '蒸包'
    }],
  },

  bindBallFn(e) {
    console.log('当前选项', e.detail);
    wx.showToast({
      title: `当前选项${e.detail}`,
      icon: 'none',
      duration: 2000
    })
  },

  //监听滑块
  cardSwiper(e) {
    console.log(e)
    let deviceId = e.detail.currentItemId;
    that.setData({
      cardCur: e.detail.current,
      deviceId: deviceId,
      goodsRoadList: [],
      pageIndex: '1',
      selectGoodsDeviceId: false
    })
    that.goodsRoadFn(that.data.pageIndex, deviceId);
  },


  onLoad: function () {
    that = this;
    that.facilityFn();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onReady')
    const query = wx.createSelectorQuery().in(this)
    query.selectAll('.custom').boundingClientRect(function (res) {
      const customHeight = res[0].height;
      that.setData({
        customHeight: customHeight
      })
    }).exec()
    that.selectComponent = that.selectComponent('#countdown');
  },

  facilityFn: () => {
    const data = {
      pointId: wx.getStorageSync('pointId')
    }
    mClient.wxGetRequest(api.DeviceList, data)
      .then(res => {
        console.log("设备列表", res);
        if (res.data.code == "200") {
          let deviceList = res.data.data.deviceList;
          for (const key in deviceList) {
            if (deviceList.hasOwnProperty(key)) {
              const element = deviceList[key];
              if (element.isOnline === "1") {
                element.isOnline = '在线',
                  element.lineStateColor = 'on_lineState'
              } else {
                element.isOnline = '离线',
                  element.lineStateColor = 'lineStateColor'
              }
            }
          }
          that.setData({
            deviceList: deviceList,
            pointName: wx.getStorageSync('pointName'),
            deviceId: deviceList[0].deviceId
          });
          that.goodsRoadFn(that.data.pageIndex, deviceList[0].deviceId);
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000
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

  goodsRoadFn: (pageIndex, deviceId) => {
    const data = {
      pageSize: '60',
      pageIndex,
      deviceId
    };
    mClient.wxGetRequest(api.GoodsRoad, data)
      .then(res => {
        console.log("商品列表", res);
        if (res.data.code == "200") {
          let goodsRoadList = res.data.data.goodsRoadList;
          if (goodsRoadList) {
            for (const key in goodsRoadList) {
              if (goodsRoadList.hasOwnProperty(key)) {
                const element = goodsRoadList[key];
                // if (element.stock > 10) {
                //   element.isAdd = 'isAdd';
                // } else {
                //   element.isAdd = '';
                // }
                if (element.stock <= 0) {
                  element.isSub = 'isSub';
                } else {
                  element.isSub = '';
                }
                if (element.productId === '0') {
                  element.productName = '空',
                    element.productColor = 'grayness',
                    element.isAdd = 'isAdd'
                } else {
                  element.productColor = '',
                    element.isAdd = ''
                }
                // element.showNo = element.showNo.slice(-1);
              }
            }
          }
          // goodsRoadList = that.data.goodsRoadList.concat(goodsRoadList);
          // function compare(property) {//排序
          //   return function (a, b) {
          //     var value1 = a[property];
          //     var value2 = b[property];
          //     return value1 - value2;
          //   }
          // }
          // goodsRoadList.sort(compare('showNo'));
          // if (goodsRoadList.length >= 60) {
          //   const pullText = '- 上拉加载更多 -'
          //   that.setData({
          //     'push.pullText': pullText,
          //   })
          // } else {
          //   const pullText = ''
          //   that.setData({
          //     'push.pullText': pullText,
          //   })
          // }
          if (goodsRoadList.length <= 0) {
            that.setData({
              isFlag: true
            })
          }
          that.setData({
            goodsRoadList: goodsRoadList,
            count: res.data.data.count
          });
          if (goodsRoadList.length > 9 && that.data.selectGoodsDeviceId) {
            let scrollTopNum = that.data.scrollTopNum;
            console.log(scrollTopNum)
            that.selectComponent.ready(scrollTopNum);
          }
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000
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

  //+10
  productTenFn(e) {
    let id = e.currentTarget.dataset.id;
    const data = {
      id
    };
    mClient.wxGetRequest(api.ProductTen, data)
      .then(res => {
        console.log("+10", res);
        if (res.data.code == "200") {
          let goodsRoadList = that.data.goodsRoadList;
          for (const key in goodsRoadList) {
            if (goodsRoadList.hasOwnProperty(key)) {
              const element = goodsRoadList[key];
              if (element.id === id) {
                element.stock = res.data.data.stock;
                element.isSub = '';
                // element.isAdd = 'isAdd';
              }
            }
          }
          that.setData({
            goodsRoadList: goodsRoadList
          });
        } else if (res.data.code == "2005") {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
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

  //增减
  edit_cart(id, mark, quan) {
    const data = {
      id,
      mark
    };
    mClient.wxGetRequest(api.Tobaccos, data)
      .then(res => {
        console.log("增减", res);
        if (res.data.code == "200") {
          let goodsRoadList = that.data.goodsRoadList;
          for (const key in goodsRoadList) {
            if (goodsRoadList.hasOwnProperty(key)) {
              const element = goodsRoadList[key];
              if (element.id === id) {
                element.stock = res.data.data.stock;
                // if (res.data.data.stock >= 10) {
                //   element.isAdd = 'isAdd';
                // } else {
                //   element.isAdd = '';
                // }
                if (res.data.data.stock <= 0) {
                  element.isSub = 'isSub';
                } else {
                  element.isSub = '';
                }
              }
            }
          }
          that.setData({
            goodsRoadList: goodsRoadList
          });
        } else if (res.data.code == "2005") {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
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

  // 数量减 
  btn_sub(e) {
    console.log('sub');
    let id = e.currentTarget.dataset.id;
    let quan = e.currentTarget.dataset.quan;
    let mark = e.currentTarget.dataset.mark;
    if (quan > 0) {
      quan--;
      that.edit_cart(id, mark, quan);

    } else {
      return;
    }
  },

  // 数量增
  btn_add(e) {
    console.log('add');
    let id = e.currentTarget.dataset.id;
    let quan = e.currentTarget.dataset.quan;
    let mark = e.currentTarget.dataset.mark;
    let isadd = e.currentTarget.dataset.isadd;
    quan++;
    that.edit_cart(id, mark, quan);
  },

  selectGoodsFn: (e) => {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/index/selectGoods/index',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data) {
          let result = data.data;
          console.log('返回的', result);
          // let selectGoodsDeviceId = result.deviceId;
          that.setData({
            selectGoodsDeviceId: true
          })
          let e = {
            detail: {
              currentItemId: '',
              current: ''
            }
          }
          e.detail.currentItemId = result.deviceId;
          e.detail.current = result.cardCur;
          that.goodsRoadFn(that.data.pageIndex, result.deviceId);
          // that.cardSwiper(e);


          // let scrollHeight = that.data.scrollHeight;
          // setTimeout(function () {
          //   console.log('高度', that.data.scrollHeight);
          //   wx.pageScrollTo({
          //     scrollTop: -1000,
          //     selector: '#index-nav',
          //     complete: e => {
          //       console.log(e)
          //     }
          //   })
          // }, 5000)
        },
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: {
            id: id,
            deviceId: that.data.deviceId,
            cardCur: that.data.cardCur
          }
        })
      }
    })

  },

  scrollTopFn(e) {
    // console.log(e.detail.scrollTop);
    if (e.detail.scrollTop > 0) {
      that.setData({
        scrollTopNum: e.detail.scrollTop
      })
    }
  },


  refresh() {
    that.setData({
      pageIndex: '1',
      goodsRoadList: []
    })
    if (that.data.goodsRoadList.length <= 0) {
      that.setData({
        'pull.isLoading': true,
        'pull.loading': '../../resource/img/pull_refresh.gif',
        'pull.pullText': '正在刷新',
        'push.pullText': '',
      })
      that.goodsRoadFn(that.data.pageIndex, that.data.deviceId);
      setTimeout(() => {
        that.setData({
          'pull.loading': '../../resource/img/finish.png',
          'pull.pullText': '刷新完成',
          'pull.isLoading': false
        })
      }, 1500)
    }
  },

  // toload() {
  //   let count = that.data.count;
  //   let pageIndex = that.data.pageIndex;
  //   console.log('加载', that.data.goodsRoadList.length);
  //   if (that.data.goodsRoadList.length < count) {
  //     that.setData({
  //       'push.isLoading': true,
  //       'push.pullText': '正在加载',
  //       'push.loading': '../../resource/img/pull_refresh.gif',
  //     })
  //     pageIndex++;
  //     console.log(pageIndex)
  //     count = String(pageIndex);
  //     console.log(pageIndex)
  //     that.goodsRoadFn(pageIndex, that.data.deviceId);
  //     setTimeout(() => {
  //       that.setData({
  //         pageIndex: pageIndex,
  //         'push.isLoading': false,
  //         'push.pullText': '- 上拉加载更多 -',
  //         'push.loading': '../../resource/img/finish.png',
  //       })
  //     }, 1500)
  //   } else if (that.data.goodsRoadList.length > 0 && (pageIndex * that.data.pageSize) >= that.data.count) {
  //     that.setData({
  //       'push.isLoading': false,
  //       'push.pullText': '- 我也是有底线的 -'
  //     })
  //   }
  // },


  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
    // console.log('onShow')
    // setTimeout(function(){
    //   wx.pageScrollTo({
    //     scrollTop: -100,
    //     selector: '#index-nav',
    //     complete: e => {
    //       console.log(e)
    //     }
    //   })
    // },2000)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {

  },

})