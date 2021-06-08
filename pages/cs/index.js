let that;
Page({
  data: {
    maskHidden: true
  },
  onLoad: function () {
    that = this;
  },
  onReady: function () {

  },

  // 生成海报
  formSubmit: () => {
    that.setData({
      maskHidden: false
    })
    const query = wx.createSelectorQuery()
    query.select('#canvas_box')
      .fields({
        id: true,
        node: true,
        size: true
      })
      .exec(that.init.bind(this));
  },

  init(res) {
    console.log(res)
    const canvas = res[0].node
    const ctx = canvas.getContext('2d')
    const dpr = wx.getSystemInfoSync().pixelRatio
    //新接口需显示设置画布宽高；
    canvas.width = res[0].width * dpr
    canvas.height = res[0].height * dpr
    ctx.scale(dpr, dpr);
    this.setData({
      canvas,
      ctx
    });
    //向画布载入图片的方法
    this.canvasDraw(ctx);
    //向画布载入标题的方法
    this.title(ctx);
    this.name(ctx)
    this.code(ctx).then(rrr => {
      // 头像加载
      this.hande(ctx)
    })
  },
  // 封面图
  canvasDraw(ctx) {
    let img = this.data.canvas.createImage(); //创建img对象
    img.src = "../../resource/img/lisa.png";
    img.onload = () => {
      console.log(img.complete); //true
      this.data.ctx.drawImage(img, 0, 0, 260, 260);
    };

  },
  // 标题
  title(ctx) {
    // ctx.setFontSize(12)
    let text = '从前从前有个人爱你很久，但偏偏风渐渐把距离吹的好远'
    let moy = ' ———— 周杰伦《晴天》'
    ctx.font = 'normal bold 12px sans-serif';
    ctx.fillStyle = "rgba(60, 59, 59)";
    console.log('======,', text.length)
    if (text.length <= 19) {
      // 一行字
      ctx.fillText(text, 10, 275, 280)
      ctx.fillStyle = "rgba(0,0,0)";

    } else if (text.length <= 38) {
      // 两行字
      let firstLine = text.substring(0, 20); //第一行
      let secondLine = text.substring(20, 38); //第二行
      ctx.fillText(firstLine, 10, 275, 280)
      ctx.fillText(secondLine, 10, 290, 280)

    } else {
      // 超过两行省略多的加省略号
      let firstLine = text.substring(0, 20);
      let secondLine = text.substring(20, 38) + '...';
      ctx.fillText(firstLine, 10, 280, 280)
      ctx.fillText(secondLine, 10, 295, 280)

    }
    ctx.font = 'normal bold 16px sans-serif';
    ctx.fillStyle = "red";
    ctx.fillText(moy, 10, 320, 280)
  },
  // 头像
  hande(ctx) {
    let hande = this.data.canvas.createImage(); //创建img对象
    hande.onload = () => {
      console.log(hande.complete); //true
      // 绘制头像图片
      ctx.arc(30, 370, 40 / 2, 0, 2 * Math.PI) //画出圆
      ctx.clip(); //裁剪上面的圆形
      ctx.drawImage(hande, 10, 350, 40, 40)
      ctx.restore();
    };
    hande.src = "../../resource/img/lisa.png";
  },
  // 名字
  name(ctx) {
    ctx.fillStyle = "rgba(60, 59, 59)";
    ctx.font = 'normal bold 12px sans-serif';
    ctx.fillText('Lida', 60, 365, 280)
    ctx.fillStyle = "rgba(60, 59, 59)";
    ctx.font = 'normal bold 10px sans-serif';
    ctx.fillStyle = "#999";
    ctx.fillText('长按小程序跟我一起', 60, 380, 280)
  },
  // 二维码
  code(ctx) {
    return new Promise(rrr => {
      let code = this.data.canvas.createImage(); //创建img对象
      code.onload = () => {
        console.log(code.complete); //true
        this.data.ctx.drawImage(code, 180, 340, 60, 60);
      };
      code.src = "../../resource/img/lisa.png";
      setTimeout(() => {
        rrr(true)
      }, 100);
    })
  },

  bc() {
    // 保存到相册
    console.log('保存canvasId', this.data.canvas._canvasId)
    wx.canvasToTempFilePath({ //将canvas生成图片
      canvas: this.data.canvas,
      x: 0,
      y: 0,
      width: this.data._width,
      height: this.data._height,
      destWidth: this.data._width, //截取canvas的宽度
      destHeight: this.data._height, //截取canvas的高度
      success: function (res) {
        console.log('生成图片成功：', res)
        wx.saveImageToPhotosAlbum({ //保存图片到相册
          filePath: res.tempFilePath,
          success(res) {
            wx.showModal({
              content: '海报已保存到相册',
              showCancel: false,
              confirmText: '确定',
              confirmColor: '#333',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定');
                  /* 该隐藏的隐藏 */
                  that.setData({
                    maskHidden: true
                  })
                }
              },
              fail: function (res) {
                console.log(11111)
              }
            })
          }
        })

      },
    }, this)
  },
})