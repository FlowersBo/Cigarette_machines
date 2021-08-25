// pages/user/index.js
import * as util from '../../utils/util';
import * as mClient from '../../utils/requestUrl';
import * as api from '../../config/api';
let app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: true,
    userInfo: '',
    AccountSharingProportion: '',
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    btnTop: 0,
    btnLeft: 0,
    windowHeight: '',
    windowWidth: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    // console.log(num.toFixed(2))
    // let a=[3,4]
    // let b=[6,7]
    // let arr = [1,2,3]
    // function f(a,...arr) {
    // console.log(a)
    // console.log(arr)
    // }
    // f(a,b,arr)
    this.mask = this.selectComponent('#mask');
    let date = util.customFormatTime(new Date());
    that.userInfoFn();
    // console.log(that.userInfoFn())
    // mClient.myPromiseall(a, b).then(v => {
    //   console.log(v) //
    // }).catch(e => {
    //   console.log(e)
    // })
  },


  bindLogOut: function () {
    this.mask.util('open');
  },
  // mask模态框
  statusNumberFn: (e) => {
    if (e.detail.status === '0') {
      try {
        wx.clearStorageSync()
        wx.reLaunch({
          url: '../login/index'
        })
      } catch (e) {
        // Do something when catch error
      }
    }
  },

  userInfoFn: () => {
    let url = '',
      data = '';
    if (wx.getStorageSync('clerkId')) {
      url = api.Info;
      data = {
        clerkId: wx.getStorageSync('clerkId'),
        username: wx.getStorageSync('username'),
      }
    } else {
      url = api.MerchantInfo;
      data = {
        clerkId: wx.getStorageSync('clerkId'),
        merchantId: wx.getStorageSync('info').merchantId,
      }
    }

    mClient.wxGetRequest(url, data)
      .then(resp => {
        console.log('我的返回', resp);
        if (resp.data.code == 200) {
          that.setData({
            userInfo: resp.data.data.myPageMessage,
          });
          wx.setStorageSync('pointName', resp.data.data.myPageMessage.pointName);
          wx.setStorageSync('pointId', resp.data.data.myPageMessage.pointId);
        } else {
          wx.showToast({
            title: resp.data.message,
            icon: 'none',
            duration: 2000
          })
        }
        wx.hideLoading();
      });
  },

  openPhone: function (e) {
    const itemList = [];
    itemList.push(e.currentTarget.dataset.phone);
    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        wx.makePhoneCall({
          phoneNumber: e.currentTarget.dataset.phone,
          success: function () {
            console.log("拨打电话成功！")
          },
          fail: function () {
            console.log("拨打电话失败！")
          }
        })
        if (!res.cancel) {
          console.log(res.tapIndex) //console出了下标
        }
      }
    });
  },

  topic_preview: (e) => {
    let previewImgArr = [];
    previewImgArr.push(e.currentTarget.dataset.url);
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: previewImgArr
    })
  },


  // 刷新
  refresh() {
    that.setData({
      'pull.isLoading': true,
      'pull.loading': '../../resource/img/pull_refresh.gif',
      'pull.pullText': '正在刷新',
      'push.pullText': '',
    })
    that.userInfoFn();
    setTimeout(() => {
      that.setData({
        'pull.loading': '../../resource/img/finish.png',
        'pull.pullText': '刷新完成',
        'pull.isLoading': false
      })
    }, 1500)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // const query = wx.createSelectorQuery().in(this)
    // query.selectAll('.custom').boundingClientRect(function (res) {
    //   const customHeight = res[0].height;
    //   that.setData({
    //     customHeight: customHeight
    //   })
    // }).exec()
  },

  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      console.log('Tabbar列表', app.globalData.list);
      this.getTabBar().setData({
        selected: 2
      })
    }

    //瀑布流的效果
    setTimeout(function () {
      app.sliderightupshow(this, 'slide_up1', 110, 165, 1)
    }.bind(this), 500);
    setTimeout(function () {
      app.sliderightupshow(this, 'slide_up2', 160, -135, 1)
    }.bind(this), 200);
    setTimeout(function () {
      app.sliderightupshow(this, 'slide_up3', -220, 50, 1)
    }.bind(this), 800);
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //还原动画
    setTimeout(function () {
      app.sliderightupshow(this, 'slide_up1', -10, -15, 0)
    }.bind(this), 1);
    setTimeout(function () {
      app.sliderightupshow(this, 'slide_up2', -15, 105, 0)
    }.bind(this), 1);
    setTimeout(function () {
      app.sliderightupshow(this, 'slide_up3', 200, -50, 0)
    }.bind(this), 1);
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})