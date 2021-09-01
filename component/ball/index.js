// component/ball/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ballList: {
      type: Array,
      value: 0
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // ballList: [{
    //   name: 0
    // }, {
    //   name: 1
    // }, {
    //   name: 2
    // }, {
    //   name: 3
    // }, {
    //   name: 4
    // }, {
    //   name: 5
    // }],
    isBindBall: false
  },

  observers: { //监听数据的更改
    "a"(data) {
      data === this.data.a //这里不要写this.setData({})
    },
  },

  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
    ready: function () {
      //在组件在视图层布局完成后执行
      // 获取配置参数
      let that = this;
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
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 悬浮球开始移动
    buttonStart(e) {
      // console.log('获取起始点', e)
      this.setData({
        startPoint: e.touches[0]
      })
    },

    // 悬浮球
    buttonMove(e) {
      let that = this;
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
      let that = this;
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
      let that = this;
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
        element.itemAnimation = ballAnimation.translate(getPoint(50, -key * (360/ballList.length)).x, getPoint(-50, key * (360/ballList.length)).y).rotate(720).opacity(1).step({
          delay: 50 * key
        });
      }
      that.setData({
        ballList: ballList,
        isBindBall: true
      })
    },

    //缩回动画
    takeback: function () {
      let that = this;
      let ballList = that.data.ballList;
      for (const key in ballList) {
        const element = ballList[key];
        let ballAnimation = wx.createAnimation({
          timingFunction: 'ease'
        })
        element.itemAnimation = ballAnimation.translate(0, 0).rotate(360).opacity(0).step({
          duration: 300
        });
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

    callSomeFun(e) {
      let that = this;
      let index = e.currentTarget.dataset.index;
      console.log('当前点击项', index);
      that.triggerEvent('bindBallFn', index)
    },
  }
})