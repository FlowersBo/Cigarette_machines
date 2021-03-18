// component/dateModal/index.js
const common = require("../../utils/calender.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isshowDatemodal:{
      type: [Boolean],
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    timearr:[],
    DateData:{},
    selectIndex:0,
    selectTime:"00:00",
    dateCycle: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  },
  lifetimes:{
    attached: function() {
      // 在组件实例进入页面节点树时执行
      let timearr = []
      for(let i = 0; i< 24; i++) {
      if (i < 10) {
        i = "0" + i
      }
      timearr.push(i + ":00")
      timearr.push(i + ":30")
    }



    this.setData({
      timearr: timearr,
      DateData: common.GetDateMonthDay(new Date())
    })
    //console.log(common.GetDateMonthDay(new Date()))
    },
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
  show() {
     
    }



    },

  /**
   * 组件的方法列表
   */
  methods: {
    touchmove(e) {
      return false 
    },
    //关闭日期
    closeDateBtn(){
      this.setData({
        isshowDatemodal:false
      })
    },
    //时间选择
    selectTimeBtn(e){
      let time=this.data.timearr[e.detail.value[0]]
      //console.log(time)
      this.setData({
        selectTime:time
      })

    },
    //日期选择
    selectDateBtn(e) {
      let index = e.currentTarget.dataset.index
      let month=e.currentTarget.dataset.month
      let year=e.currentTarget.dataset.year
        if (index >= this.data.DateData.today||this.data.DateData.ymarr[0].month!=month) {
          this.data.DateData.selectday = index
          this.data.DateData.selectmonth = month
          this.data.DateData.selectyear = year
          this.setData({
            DateData: this.data.DateData
          })
         
        }
    },
    //即时入住 
    nowDateBtn(e){
      //console.log(this.data.DateData.selectdate)
      let times = common.getNowTimes()
      let today = this.data.DateData.selectdate
      this.triggerEvent('todayEven', { today, times})
      this.closeDateBtn();
    },
    //确认日期
    ortherDateBtn(e) {
      let date=this.data.DateData
      let selectTime=this.data.selectTime
      this.triggerEvent('dateModalData', {
        datetime: date.selectyear + "年" + date.selectmonth + "月" + date.selectday + "日 ",
        times: selectTime
      })
      this.closeDateBtn();
     
    }
  }
})