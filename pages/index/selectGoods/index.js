// pages/index/selectGoods/index.js
let that;
import * as mClient from '../../../utils/requestUrl';
import * as api from '../../../config/api';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageSize: '30',
    pageIndex: '1',
    goodsNav: ['商品编码', '商品名称', '售价'],
    goodsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    const eventChannel = that.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      let result = data.data;
      console.log(result)
      that.setData({
        goodsRoadId: result.id,
        deviceId: result.deviceId,
        cardCur: result.cardCur
      })
    })
    let pageIndex = '1';
    that.goodsListFn(pageIndex);
  },

  goodsListFn: (pageIndex, searchStr) => {
    const data = {
      pageSize: that.data.pageSize,
      pageIndex,
      searchStr,
      merchantId: wx.getStorageSync('merchantId')
    }
    mClient.wxGetRequest(api.GoodsRoadProductList, data)
      .then(res => {
        console.log("商品列表", res);
        if (res.data.code == "200") {
          let goodsList = res.data.data.productList;
          let count = res.data.data.count;
          goodsList = that.data.goodsList.concat(goodsList);
          console.log(Boolean(pageIndex * that.data.pageSize >= count));
          if (pageIndex * that.data.pageSize >= count) {
            let selectDetail = {
              barcode: 0,
              productname: '请选择商品',
              price: 0,
              id: 0
            }
            // goodsList.unshift(selectDetail);
            goodsList.push(selectDetail);
          }
          if (goodsList.length >= 30) {
            const pullText = '- 上拉加载更多 -'
            that.setData({
              'push.pullText': pullText,
            })
          } else {
            const pullText = ''
            that.setData({
              'push.pullText': pullText,
            })
          }
          if (goodsList.length <= 0) {
            that.setData({
              isFlag: true
            })
          }
          that.setData({
            goodsList: goodsList,
            count: count
          });
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

  bindPointSerch: e => {
    let searchStr = e.detail.value;
    let pageIndex = '1';
    that.setData({
      goodsList: []
    })
    if(that.data.goodsList.length<=0){
      that.goodsListFn(pageIndex, searchStr);
    }
  },

  selectGoods: e => {
    let id = e.currentTarget.dataset.id;
    const data = {
      productId: id,
      goodsRoadId: that.data.goodsRoadId
    }
    mClient.wxGetRequest(api.GoodsRoadChangeProduct, data)
      .then(res => {
        console.log("选择商品", res);
        if (res.data.code == "200") {
          const eventChannel = that.getOpenerEventChannel();
          eventChannel.emit('acceptDataFromOpenedPage', {
            data: {
              deviceId: that.data.deviceId,
              cardCur: that.data.cardCur
            }
          });
          wx.switchTab({
            url: '/pages/index/index'
          })
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
      })
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
  refresh() {
    that.setData({
      pageIndex: '1',
      goodsList: []
    })
    if (that.data.goodsList.length <= 0) {
      that.setData({
        'pull.isLoading': true,
        'pull.loading': '../../resource/img/pull_refresh.gif',
        'pull.pullText': '正在刷新',
        'push.pullText': '',
      })
      that.goodsListFn(that.data.pageIndex);
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
    let count = that.data.count;
    let pageIndex = that.data.pageIndex;
    console.log('加载', that.data.goodsList.length);
    if (that.data.goodsList.length < count) {
      that.setData({
        'push.isLoading': true,
        'push.pullText': '正在加载',
        'push.loading': '../../../resource/img/pull_refresh.gif',
      })
      pageIndex++;
      console.log(pageIndex)
      count = String(pageIndex);
      console.log(pageIndex)
      that.goodsListFn(pageIndex);
      setTimeout(() => {
        that.setData({
          pageIndex: pageIndex,
          'push.isLoading': false,
          'push.pullText': '- 上拉加载更多 -',
          'push.loading': '../../../resource/img/finish.png',
        })
      }, 1500)
    } else if (that.data.goodsList.length > 0 && (pageIndex * that.data.pageSize) >= that.data.count) {
      that.setData({
        'push.isLoading': false,
        'push.pullText': '- 我也是有底线的 -'
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})