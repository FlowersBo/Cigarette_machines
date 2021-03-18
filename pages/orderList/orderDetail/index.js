// pages/orderDetail/indx.js
import * as mClient from "../../../utils/requestUrl";
import * as api from "../../../config/api";
import * as util from "../../../utils/util";
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    // console.log(options)
    // let orderid = options.orderid;
    // console.log('订单号:' + orderid);
    // orderid = "1369223587663183872";
    // if (orderid) {
    //   that.setData({
    //     orderid: orderid
    //   })
    // }
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      console.log('订单号:' + data.orderid);
      that.setData({
        orderid: data.orderid
      })
      that.orderDetailFn(data.orderid);
    })
  },

  orderDetailFn: orderid => {
    let data = {
      orderid
    };
    mClient.wxGetRequest(api.OrderDetails, data)
      .then(res => {
        console.log('订单详情', res)
        if (res.data.code == '200') {
          let orderDetail = res.data.data;
          let GoodsCartList = res.data.data.tbOrderDetailsList;
          let tbOrderInfo = res.data.data.tbOrderInfo;
          if (tbOrderInfo.payDate) {
            tbOrderInfo.payDate = util.timestampToTimeLong(tbOrderInfo.payDate);
          };
          let orderIdList = [];
          let orderIdListWrap = [];
          for (const key in GoodsCartList) {
            if (GoodsCartList.hasOwnProperty(key)) {
              const element = GoodsCartList[key];
              element.selected = true;
              element.quan = element.quantity;
              orderIdList.push(element.id);
              orderIdListWrap.push(element.id);
              if (element.quantity <= 1) {
                element.isSub = 'isSub';
                element.isAdd = 'isAdd';
              } else {
                element.isSub = '';
                element.isAdd = 'isAdd';
              }
            }
          }
          that.setData({
            orderDetail: orderDetail,
            tbOrderInfo: tbOrderInfo,
            GoodsCartList: GoodsCartList,
            orderIdList: orderIdList,
            orderIdListWrap: orderIdListWrap
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
        console.log(rej)
      })
  },

  refundFn: () => {
    that.setData({
      showModalStatus: true
    })
    that.checkedProduct();
  },

  /**
   * 当前商品选中事件
   */
  selectList(e) {
    let id = e.currentTarget.dataset.id;
    console.log('选取', id);
    let selected = e.currentTarget.dataset.selected;
    console.log(selected);
    let GoodsCartList = that.data.GoodsCartList;
    for (const key in GoodsCartList) {
      if (GoodsCartList.hasOwnProperty(key)) {
        const element = GoodsCartList[key];
        if (element.id == id) {
          element.selected = !element.selected
        }
      }
    }
    that.setData({
      GoodsCartList: GoodsCartList,
    })



    // let orderIdList = that.data.orderIdList;
    // if (orderIdList.length > 0) {
    //   orderIdList.forEach(function (item, index, arr) {
    //     if (selected && item === id) {
    //       console.log('删除')
    //       orderIdList.splice(orderIdList.indexOf(id), 1);
    //     } else if (!selected && item != id) {
    //       console.log('内增加')
    //       orderIdList.push(id)
    //       orderIdList = Array.from(new Set(orderIdList))
    //       console.log('内部去重', orderIdList);
    //     }
    //   })
    // } else if (!selected) {
    //   console.log('增加')
    //   orderIdList.push(id)
    // }
    // that.setData({
    //   orderIdList: orderIdList
    // })
    // console.log('数组', that.data.orderIdList)
    // that.data.selectAllStatus = true;
    // // GoodsCartList[index].selected = !GoodsCartList[index].selected;
    // for (var i = GoodsCartList.length - 1; i >= 0; i--) {
    //   if (GoodsCartList[i].id === id) {
    //     GoodsCartList[i].selected = !GoodsCartList[i].selected;
    //   }
    //   if (!GoodsCartList[i].selected) {
    //     that.data.selectAllStatus = false;
    //     // break;
    //   }
    // }
    // that.setData({
    //   GoodsCartList: GoodsCartList,
    // selectAllStatus: that.data.selectAllStatus
    // })
    that.checkedProduct();
  },



  // +
  btn_add(e) {
    console.log('add');
    let id = e.currentTarget.dataset.id,
      quan = e.currentTarget.dataset.quan,
      GoodsCartList = that.data.GoodsCartList;
    let mark = 'add';
    quan++;
    for (const key in GoodsCartList) {
      if (GoodsCartList.hasOwnProperty(key)) {
        const element = GoodsCartList[key];
        if (id == element.id) {
          if (quan <= element.quantity) {
            element.quan = quan;
            element.isAdd = '';
            that.setData({
              GoodsCartList: GoodsCartList
            })
            that.checkedProduct();
          }
        }
      }
    }
    that.AddorSubFn(id, quan);

  },

  //-
  btn_minus(e) {
    console.log(e)
    let id = e.currentTarget.dataset.id;
    let quan = e.currentTarget.dataset.quan;
    console.log('当前数量', quan);
    let mark = 'sub';
    let GoodsCartList = that.data.GoodsCartList;
    if (quan > 1) {
      quan--;
      for (const key in GoodsCartList) {
        if (GoodsCartList.hasOwnProperty(key)) {
          const element = GoodsCartList[key];
          if (id == element.id) {
            element.quan = quan;
            element.isSub = '';
          }
        }
      }
      that.setData({
        GoodsCartList: GoodsCartList
      })
      that.checkedProduct();
    }
    that.AddorSubFn(id, quan);
  },

  AddorSubFn: (id, quan) => {
    let GoodsCartList = that.data.GoodsCartList;
    for (const key in GoodsCartList) {
      if (GoodsCartList.hasOwnProperty(key)) {
        const element = GoodsCartList[key];
        if (id == element.id) {
          if (quan < element.quantity && quan != 1) {
            element.isAdd = '';
            element.isSub = '';
          } else if (quan == element.quantity && element.quantity != 1) {
            element.isAdd = 'isAdd';
          } else if (quan == 1) {
            element.isSub = 'isSub';
          }
        }
        that.setData({
          GoodsCartList: GoodsCartList
        })
      }
    }
  },

  // 汇总   
  checkedProduct: () => {
    let GoodsCartList = that.data.GoodsCartList;
    let checked_ids = [];
    for (const key in GoodsCartList) {
      if (GoodsCartList.hasOwnProperty(key)) {
        const element = GoodsCartList[key];
        if (element.selected) {
          checked_ids.push(element.id + '-' + element.quan);
        }
      }
    }
    console.log('选取数组', checked_ids);
    that.setData({
      checked_ids: checked_ids
    })
    let data = {
      checked_ids: checked_ids
    };
    mClient.wxRequest(api.ProductPrice, data)
      .then(res => {
        console.log('返回金额', res);
        that.setData({
          allPrice: res.data.allPrice
        })
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


  gotobargainDetailFuns: function (e) {
    let status = e.currentTarget.dataset.status;
    if (status == 0) {
      if (that.data.allPrice > 0) {
        let data = {
          orderid: that.data.orderid,
          checked_ids: that.data.checked_ids
        };
        mClient.wxRequest(api.WxRefund, data)
          .then(res => {
            console.log('退款', res);
            if (res.code == 200) {
              wx.showToast({
                title: res.message,
                icon: 'none',
                duration: 2000
              })
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 1500)

            } else {
              wx.showToast({
                title: res.message,
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
          })
      } else {
        wx.showToast({
          title: '退款金额不能小于1元',
          icon: 'none',
          duration: 2000
        })
      }
    }
    this.util('close', status);
  },
  // 模态动画
  util: function (currentStatu, status) {
    console.log('模态动画');
    /* 动画部分 */
    // 第1步：创建动画实例
    var animation = wx.createAnimation({
      duration: 300, //动画时长
      timingFunction: "linear", //线性
      delay: 0 //0则不延迟
    });
    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;
    // 第3步：执行第一组动画
    animation.opacity(0).step();
    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function () {
      // 执行第二组动画
      animation.opacity(1).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })
      //关闭
      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false
        });
        this.triggerEvent('statusNumber', {
          status: status
        });
      } else if (currentStatu == "open") {
        this.setData({
          showModalStatus: true
        });
      }
    }.bind(this), 300)
    // 显示
    // if (currentStatu == "open") {

    // }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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