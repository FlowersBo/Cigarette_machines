import * as mClient from '../../utils/requestUrl';
import * as api from '../../config/api';
import * as util from '../../utils/util';
import {
  OrderDetails,
  OrderList
} from '../../config/api';
let that;

Page({
  data: {
    loadText: '加载中...',
    dateRangeText: [
      '今日', '昨日', '近7天', '近30天'
    ],
    reportTotal: {
      '销售额（元）': 0,
      '订单量（单）': 0,
      '销售量（盒）': 0
    },
    reportDetail: {
      titles: ['门店', '销售额', '订单量', '销售量'],
      titleUrls: ['', '../../assets/img/arrow.png', '../../assets/img/arrow.png', '../../assets/img/arrow.png'],
    },
    dateRange: 0,
    pageIndex: 1,
    pageSize: 10,
    pointDetaillyDate: '', //日期
    isSaleAmountSort: false,
    isSaleCountSort: false,
    isMarketSort: false,
    pointTotal: 0,
    serchContent: '',
    pointsData: [], //列表
    isFlag: false,
  },

  //组件监听选项
  bindBallFn(e) {
    console.log('当前选项', e.detail);
    wx.showToast({
      title: `当前选项${e.detail}`,
      icon: 'none',
      duration: 2000
    })
  },


  // 点击显示
  merchantOff(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    let pointsData = that.data.pointsData;
    for (const key in pointsData) {
      if (Object.hasOwnProperty.call(pointsData, key)) {
        const element = pointsData[key];
        if (key == index) {
          element.isHidden = !element.isHidden
        }else{
          element.isHidden = false
        }
      }
      that.setData({
        pointsData: pointsData
      })
    }
  },

  merachartOn() {
    let pointsData = that.data.pointsData;
    for (const key in pointsData) {
      if (Object.hasOwnProperty.call(pointsData, key)) {
        const element = pointsData[key];
        element.isHidden = false
      }
    }
    that.setData({
      pointsData: pointsData
    })
  },

  onLoad: function () {
    that = this;
    let dateRange = that.data.dateRange;
    this.renderTransactionSummation(dateRange);
    this.renderReport(dateRange);
  },

  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
  },


  selectedReportGenres: function (e) {
    let that = this;
    setTimeout(function () {
      wx.createSelectorQuery().select('.tabTit').boundingClientRect(function (res) {
        const tabTitTop = res.top;
        console.log('距离顶部距离', tabTitTop)
        that.setData({
          tabTitTop: tabTitTop
        })
      }).exec()
    }, 400)
    let dateRange = e.currentTarget.dataset.index;
    // let reportDetail = that.data.reportDetail;
    // reportDetail.titleUrls[1] = '../../assets/img/arrow.png';
    // reportDetail.titleUrls[2] = '../../assets/img/arrow.png';
    this.setData({
      dateRange: dateRange,
      'push.pullText': '',
      serchContent: '',
      // reportDetail: reportDetail,
    });
    this.renderTransactionSummation(dateRange);
    this.renderReport(dateRange);
  },

  selectedDateRange: function (e) {
    let that = this;
    setTimeout(function () {
      wx.createSelectorQuery().select('.tabTit').boundingClientRect(function (res) {
        const tabTitTop = res.top;
        console.log('距离顶部距离', tabTitTop)
        that.setData({
          tabTitTop: tabTitTop
        })
      }).exec()
    }, 400)
    let dateRange = e.currentTarget.dataset.index;
    this.setData({
      dateRange: dateRange,
      'push.pullText': '',
      serchContent: '',
    });
    this.renderTransactionSummation(dateRange); //计算日期
    this.renderReport(dateRange);
  },

  renderTransactionSummation: function (dateRange = 0) {
    let pointReportDate = new Date();
    let pointSummationReportDate = new Date();
    this.setData({
      loadText: '加载中...',
    })
    if (dateRange === 0) {
      pointReportDate.setDate(pointReportDate.getDate());
      let startDate = util.customFormatTime(pointReportDate);
      let endDate = util.customFormatTime(pointReportDate);
      let pointDetaillyDate = util.customFormatOnlyMonthDay(pointReportDate);
      this.setData({
        pointDetaillyDate: pointDetaillyDate,
        startDate: startDate,
        endDate: endDate
      });
    }

    if (dateRange === 1) {
      pointReportDate.setDate(pointReportDate.getDate() - 1);
      let startDate = util.customFormatTime(pointReportDate);
      let endDate = util.customFormatTime(pointReportDate);

      let pointDetaillyDate = util.customFormatOnlyMonthDay(pointReportDate);
      this.setData({
        pointDetaillyDate: pointDetaillyDate,
        startDate: startDate,
        endDate: endDate
      });
    }

    if (dateRange === 2) {
      pointReportDate.setDate(pointReportDate.getDate() - 1);
      let endDate = util.customFormatTime(pointReportDate);
      let pointDetaillyEndDate = util.customFormatOnlyMonthDay(pointReportDate);

      pointReportDate.setDate(pointReportDate.getDate() - 7);
      let startDate = util.customFormatTime(pointReportDate);
      let pointDetaillyStartDate = util.customFormatOnlyMonthDay(pointReportDate);

      let pointDetaillyDate = pointDetaillyStartDate + '~' + pointDetaillyEndDate;
      this.setData({
        pointDetaillyDate: pointDetaillyDate,
        startDate: startDate,
        endDate: endDate
      });
    }

    if (dateRange === 3) {
      pointReportDate.setDate(pointReportDate.getDate() - 1);
      let endDate = util.customFormatTime(pointReportDate);
      let pointDetaillyEndDate = util.customFormatOnlyMonthDay(pointReportDate);

      pointReportDate.setDate(pointReportDate.getDate() - 30);
      let startDate = util.customFormatTime(pointReportDate);
      let pointDetaillyStartDate = util.customFormatOnlyMonthDay(pointReportDate);

      let pointDetaillyDate = pointDetaillyStartDate + '~' + pointDetaillyEndDate;
      this.setData({
        pointDetaillyDate: pointDetaillyDate,
        startDate: startDate,
        endDate: endDate
      });
    }
  },

  renderReport: function (dateRange = 0, serchContent = '', pageIndex = 1, pointsData = []) {
    let that = this;
    let pageSize = that.data.pageSize;
    let pointTotal = that.data.pointTotal;
    let reportTotal = that.data.reportTotal;
    let data = {
      pageNum: pageIndex,
      pageSize: pageSize,
      startDate: that.data.startDate,
      endDate: that.data.endDate,
      merchantId: wx.getStorageSync('merchantId'),
      sort: that.data.sort,
      sortBy: that.data.sortBy,
      pointName: serchContent,
    };
    let apiUrl = '';
    let apiListUrl = '';
    if (dateRange === 0) {
      apiUrl = api.Todaytotal;
      apiListUrl = api.TodayRankingList;
    } else if (dateRange === 1) {
      apiUrl = api.QuantityTotal;
      apiListUrl = api.Historylist;
    } else if (dateRange === 2) {
      apiUrl = api.QuantityTotal;
      apiListUrl = api.Historylist;
    } else if (dateRange === 3) {
      apiUrl = api.QuantityTotal;
      apiListUrl = api.Historylist;
    }
    that.QuantityTotalFn(apiUrl);
    mClient.wxGetRequest(apiListUrl, data)
      .then(resp => {
        if (resp.data.code == 0) {
          console.log('列表', resp);
          pointsData = pointsData.concat(resp.data.data.list); //列表
          for (const key in pointsData) {
            pointsData[key].isHidden = false;
            pointsData[key].rentalRate = parseFloat(pointsData[key].rentalRate).toFixed(2)
          }
          if (pointsData.length <= 0) {
            that.setData({
              isFlag: true
            })
          } else {
            that.setData({
              isFlag: false
            })
          }
          pointTotal = resp.data.data.total;
          this.setData({
            pointsData: pointsData,
            pageIndex: pageIndex + 1,
            pointTotal: pointTotal,
          });
        } else {
          that.setData({
            isFlag: false
          })
          wx.showToast({
            title: resp.data.message,
            duration: 2000,
            icon: 'none'
          })
        }
      })
      .catch(rej => {
        that.setData({
          isFlag: true
        })
      })
  },

  //销量
  async QuantityTotalFn(apiUrl) {
    let reportTotal = that.data.reportTotal;
    let data = {
      merchantId: wx.getStorageSync('merchantId'),
      startDate: that.data.startDate,
      endDate: that.data.endDate,
    };
    let result = await (mClient.wxGetRequest(apiUrl, data));
    console.log('测试总销量', result);
    if (result.data.code == 0) {
      reportTotal['销售额（元）'] = result.data.data.orderAmount;
      reportTotal['订单量（单）'] = result.data.data.orderCount;
      reportTotal['销售量（盒）'] = result.data.data.ProductCount;
      that.setData({
        reportTotal: reportTotal
      })
    }
  },

  bindPointSerch: function (e) {
    var query = wx.createSelectorQuery().in(this);
    query.selectViewport().scrollOffset()
    query.select("#sales").boundingClientRect();
    query.exec(function (res) {
      // var miss = res[0].scrollTop + res[1].top - 10;
      var miss = 0;
      wx.pageScrollTo({
        scrollTop: miss,
        duration: 300
      });
    });
    let dateRange = that.data.dateRange;
    let serchContent = e.detail.value;
    that.setData({
      'push.pullText': '',
      serchContent: serchContent
    })
    let pageIndex = 1,
      pointsData = [];
    that.renderReport(dateRange, serchContent, pageIndex, pointsData);
  },


  //排序
  bindPointSort: function (e) {
    let that = this;
    var query = wx.createSelectorQuery().in(this);
    query.select("#sales").boundingClientRect();
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      // res[0].top       // #sales节点的上边界坐标
      // res[1].scrollTop // 显示区域的竖直滚动位置
      console.log(res[0].top, res[1].scrollTop);
      // var miss = res[0].top + res[1].scrollTop-10;
      var miss = 0;
      wx.pageScrollTo({
        scrollTop: miss,
        duration: 300
      });
    });

    let isSaleAmountSort = that.data.isSaleAmountSort;
    let isSaleCountSort = that.data.isSaleCountSort;
    let isMarketSort = that.data.isMarketSort;
    let index = e.currentTarget.dataset.index;
    let dateRange = that.data.dateRange;
    let reportDetail = that.data.reportDetail;
    if (index === 1) {
      reportDetail.titleUrls[2] = '../../assets/img/arrow.png';
      reportDetail.titleUrls[3] = '../../assets/img/arrow.png';
      if (isSaleAmountSort === false) {
        reportDetail.titleUrls[index] = '../../assets/img/arrow-h.png';
        this.setData({
          isSaleAmountSort: true,
          isSaleCountSort: false,
          isMarketSort: false,
          sortBy: 'asc',
          sort: 'orderAmount',
          marketSort: '',
          reportDetail: reportDetail
        })
      } else {
        reportDetail.titleUrls[index] = '../../assets/img/arrow-l.png';
        this.setData({
          isSaleAmountSort: false,
          isSaleCountSort: false,
          isMarketSort: false,
          sortBy: 'desc',
          sort: 'orderAmount',
          marketSort: '',
          reportDetail: reportDetail
        })
      }
    } else if (index === 2) {
      reportDetail.titleUrls[1] = '../../assets/img/arrow.png';
      reportDetail.titleUrls[3] = '../../assets/img/arrow.png';
      if (isSaleCountSort === false) {
        reportDetail.titleUrls[index] = '../../assets/img/arrow-h.png';
        this.setData({
          isSaleCountSort: true,
          isSaleAmountSort: false,
          isMarketSort: false,
          sortBy: 'asc',
          sort: 'orderCount',
          reportDetail: reportDetail
        })
      } else {
        reportDetail.titleUrls[index] = '../../assets/img/arrow-l.png';
        this.setData({
          isSaleCountSort: false,
          isSaleAmountSort: false,
          isMarketSort: false,
          sortBy: 'desc',
          sort: 'orderCount',
          reportDetail: reportDetail
        })
      }
    } else if (index === 3) {
      reportDetail.titleUrls[1] = '../../assets/img/arrow.png';
      reportDetail.titleUrls[2] = '../../assets/img/arrow.png';
      if (isMarketSort === false) {
        reportDetail.titleUrls[index] = '../../assets/img/arrow-h.png';
        this.setData({
          isMarketSort: true,
          isSaleAmountSort: false,
          isSaleCountSort: false,
          sortBy: 'asc',
          sort: 'ProductCount',
          reportDetail: reportDetail
        })
      } else {
        reportDetail.titleUrls[index] = '../../assets/img/arrow-l.png';
        this.setData({
          isMarketSort: false,
          isSaleAmountSort: false,
          isSaleCountSort: false,
          sortBy: 'desc',
          sort: 'ProductCount',
          reportDetail: reportDetail
        })
      }
    } else {
      return;
    }
    let pageIndex = 1,
      pointsData = [];
    that.renderReport(dateRange, '', pageIndex, pointsData);
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
    let pointsData = that.data.pointsData;
    let pageIndex = that.data.pageIndex;
    let pageSize = that.data.pageSize;
    let dateRange = that.data.dateRange;
    let pointTotal = that.data.pointTotal;
    let serchContent = that.data.serchContent;
    console.log('下一页', pageIndex);
    if (pointsData.length < pointTotal) {
      console.log('正在加载')
      // that.setData({
      //   'push.isLoading': true,
      //   'push.pullText': '正在加载',
      //   'push.loading': '../../resource/img/pull_refresh.gif',
      // })
      that.renderReport(dateRange, serchContent, pageIndex, pointsData);
      // setTimeout(() => {
      that.setData({
        'push.isLoading': true,
        'push.pullText': '- 上拉加载更多 -',
        'push.loading': '../../resource/img/finish.png',
      })
      // }, 1500)
    } else if (pointsData.length >= 10 && (pointTotal / pageSize) < pageIndex && pointTotal > 0) {
      that.setData({
        'push.isLoading': true,
        'push.pullText': '- 我也是有底线的 -',
        'push.loading': '',
      })
    }
  },
})