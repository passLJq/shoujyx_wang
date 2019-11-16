const ratepx = 750.0 / wx.getSystemInfoSync().windowWidth;
/// 获取canvas转化后的rpx
const rate = function(rpx) {
  return rpx / ratepx
}
const app = getApp()
const util = require('../../utils/util.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showCanvas: {
      type: Boolean,
      value: false,
    },
    worksData: {
      type: Object,
      value: {},
      observer: function(newVal, oldVal) {
        // console.log(newVal)
        if (newVal != null && newVal != '') {
          // let isUser = false
          // if (newVal.user_id == wx.getStorageSync('userId')) {
          //   isUser = true
          // }
          this.setData({
            data: newVal,
            // isUser
          })
        }
      }
    },
    worksId: {
      type: Number,
      value: {},
      observer: function (newVal, oldVal) {
        // console.log(newVal)
        if (newVal != null && newVal != '') {
          this.setData({
            id: newVal,
            // isUser: true
          })
        }
      }
    },
    // 赛事数据
    matchData: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        // console.log(newVal)
        if (newVal != null && newVal != '') {
          this.setData({
            data: newVal,
            isMatch: true
          })
        }
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    showPost: false,
    height: 0,
    data: '',
    id: '',
    isIphoneX: false,
    isMatch: false    //  是否赛事
    // isUser: false
  },
  ready() {
    let isIphoneX = app.iphoneX
    this.setData({
      // height: Number((wx.getSystemInfoSync().windowWidth / 0.622) + rate(250)).toFixed(2),
      isIphoneX
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      this.triggerEvent('close', 0)
    },
    markCard() {
      // console.log(this.data.data)
      app.showLoading('生成海报...')
      this.setData({
        showPost: true
      }, () => {
        // 生成赛事海报
        if (this.data.isMatch) {
          this.getQrCode({
            page: `pages/activity/matchdetail/matchdetail`,
            scene: `id=${this.data.data.match_id}&status=${this.data.data.status}`
          }).then(qrcode => {
            let img = this.data.data.posterurl || this.data.data.match_img
            this.getImgSize(img).then(ret => {
              this.drawMatch(qrcode, ret)
            })
          })
          return
        } 
        this.getWorksData(() => {
          this.getQrCode({
            page: `pages/worksShow/worksDetails/worksDetails`,
            scene: `id=${this.data.data.works_id}`
          }).then(qrcode => {
            let d = this.data.data
            // console.log(d)
            let g = this.getImgSize
            let arr = []
            d.imgList.forEach(item => {
              item.image = item.image.split('?')[0]
              if (item.image != app.imgHolder) {
                item.scale = item.iwidht / item.iheight
                arr.push(item)
              }
            })
            let imgArr = arr.sort(this.compare('scale'))
            g(imgArr[0].image).then(ret => {
              // console.log(ret)
              if (ret.errMsg == "getImageInfo:ok") {
                this.draw(qrcode, ret)
              } else {
                wx.hideLoading()
                util.tips('生成失败')
              }
            })
          })
        })
      })
    },
    // 获取图文详情
    getWorksData(fn) {
      if (!this.data.data) {
        util.http({
          url: app.domain2 + 'worksShowDetail',
          headers: 1,
          data: {
            worksShowId: this.data.id
          },
          hideLoading: false
        }).then(ret => {
          if (ret.code == 0) {
            let data = ret.data
            this.setData({
              data
            }, () => {
              fn && fn()
            })
          }
        })
      } else {
        fn && fn()
      }
    },
    // 生成图文海报
    draw(qrcode, imgArr) {
      console.log('开始生成')
      let p = this.p
      // 开始绘画
      Promise.all([
        p(this.data.data.HeadImg),
        p('https://image.91sjyx.com/sjyx/Icon/logo.png'),
        p(qrcode),
        p('https://image.91sjyx.com/sjyx/worksData/headzz.png'),
      ]).then(ret => {
        // console.log(ret)
        new Promise((resolve, reject) => {
          wx.createSelectorQuery().in(this).select('#canvas-container').boundingClientRect(function(rect) {
            resolve(rect)
          }).exec()
        }).then(rect => {
          // console.log(rect)
          let d = this.data.data // 贺卡数据
          var ctx = wx.createCanvasContext('cc', this)
          // 计算宽高比例
          var width = Number(rect.width) // 画布宽度
          var scale = 750 / 915
          scale = imgArr.scale > scale ? imgArr.scale : scale
          var imgH = Number(width / scale)   /** 图片高度 */
          var height = imgH + rate(420)             /** 整体海报高度 */
          var imageH = Number(width / imgArr.scale)
          
          this.setData({
            height
          }, () => {
            // 白色背景
            ctx.setFillStyle('#fff');
            ctx.fillRect(0, 0, width, height);
            // 封面图片
            // ctx.drawImage(imgArr.path, 0, 0, width, (imgH / ()), 0, 0, width, imgH)
            if (imgArr.scale < scale) {
              ctx.drawImage(imgArr.path, 0, 0, imgArr.width, (imgArr.width / scale), 0, 0, width, imgH)
            } else {
              ctx.drawImage(imgArr.path, 0, 0, width, imgH)
            }
            // 文字
            this.drawCenterText({
              ctx,
              str: this.data.data.title,
              // str: '睡觉奥你手机掉啊撒旦教昂首洒大地阿打算都撒旦撒旦撒地',
              maxWidth: rate(400),
              x: rate(44),
              y: imgH + rate(85),
              lineHeight: rate(46),
              style: '#333',
              fontSize: rate(32)
            })
            // 用户头像
            this.circleImg({
              ctx,
              // path: ret[0],
              path: ret[0],
              x: rate(46),
              y: Number(imgH) + rate(195),
              width: rate(60)
            })
            // 莫名其妙不能画圆 所以用个白图遮住伪装成圆 ( • ̀ω•́ )✧
            ctx.drawImage(ret[3], rate(46), Number(imgH) + rate(195), rate(60), rate(60))
            // 用户名称
            ctx.setFillStyle('#333')
            ctx.setFontSize(rate(30))
            ctx.fillText(this.data.data.user_name, rate(125), Number(imgH) + rate(235))
            // logo与logo文字
            ctx.drawImage(ret[1], rate(46), Number(imgH) + rate(316), rate(180), rate(43))
            // 二维码与文字
            ctx.drawImage(ret[2], rate(480), Number(imgH) + rate(100), rate(220), rate(220))
            ctx.setFillStyle('#999')
            ctx.setFontSize(rate(28))
            ctx.fillText('长按识别查看全文', rate(475), Number(imgH) + rate(355))
            // end
            setTimeout(() => {
              ctx.draw(false, () => {
                wx.canvasToTempFilePath({
                  canvasId: 'cc', //canvasId和标签里面的id对应
                  success: (res) => {
                    // console.log(res)
                    let imgPath = res.tempFilePath
                    this.seeImg(imgPath)
                  },
                  fail: () => {
                    console.log('fail')
                  }
                }, this)
              })
            }, 500)
          })
        })
      })
    },
    // 生成赛事海报
    drawMatch(qrcode, imgArr) {
      let p = this.p
      // let userInfo = JSON.parse(wx.getStorageSync('userInfo'))

      // 开始绘画
      Promise.all([
        p(qrcode),
        p('http://image.91sjyx.com/sjyx/activity/icon/down.png'),
        // p('https://image.91sjyx.com/sjyx/Icon/logo.png'),
      ]).then(ret => {
        // console.log(ret)
        new Promise((resolve, reject) => {
          wx.createSelectorQuery().in(this).select('#canvas-container').boundingClientRect(function (rect) {
            resolve(rect)
          }).exec()
        }).then(rect => {
          // console.log(rect)
          let d = this.data.data // 贺卡数据
          var ctx = wx.createCanvasContext('cc', this)
          // 计算宽高比例
          var width = Number(rect.width)      // 画布宽度
          var scale = imgArr.scale
          var imgH = Number(width / scale)    /** 图片高度 */
          var height = imgH + rate(484)       /** 整体海报高度 */

          this.setData({
            height
          }, () => {
            // 白色背景
            ctx.setFillStyle('#fff');
            ctx.fillRect(0, 0, width, height);
            // 封面图片
            // ctx.drawImage(imgArr.path, 0, 0, imgArr.width, (imgArr.width / scale), 0, 0, width, imgH)
            ctx.drawImage(imgArr.path, 0, 0, width, imgH)
            // 文字
            this.drawCenterText({
              ctx,
              str: this.data.data.match_name,
              // str: '睡觉奥你手机掉啊撒旦教昂首洒大地阿打算都撒旦撒旦撒地',
              maxWidth: rate(552),
              x: Number(width / 2),
              y: imgH + rate(65),
              lineHeight: rate(50),
              style: '#222',
              align: 'center',
              fontSize: rate(36)
            })
            // 三角形
            ctx.drawImage(ret[1], rate(360), Number(imgH) + rate(140), rate(30), rate(25))
            // logo与logo文字
            // ctx.drawImage(ret[0], rate(46), Number(imgH) + rate(266), rate(180), rate(43))
            // 二维码与文字
            ctx.drawImage(ret[0], rate(265), Number(imgH) + rate(180), rate(220), rate(220))
            ctx.setFillStyle('#999')
            ctx.setFontSize(rate(28))
            ctx.setTextAlign('center')
            ctx.fillText('扫描或长按识别小程序参赛', rate(375), Number(imgH) + rate(450))
            // end
            setTimeout(() => {
              ctx.draw(false, () => {
                wx.canvasToTempFilePath({
                  canvasId: 'cc', //canvasId和标签里面的id对应
                  success: (res) => {
                    // console.log(res)
                    let imgPath = res.tempFilePath
                    this.seeImg(imgPath)
                  },
                  fail: () => {
                    console.log('fail')
                  }
                }, this)
              })
            }, 500)
          })
        })
      })
    },
    p(url) {
      // console.log(url)
      return new Promise((resolve, reject) => {
        wx.downloadFile({
          url: url.toString().replace('http:', 'https:'),
          success: res => {
            if (res.statusCode === 200) {
              resolve(res.tempFilePath)
            } else {
              wx.hideLoading()
              setTimeout(() => {
                util.tips('图片下载失败')
              }, 500)
            }
          }
        })
      })
    },
    getQrCode(data) {
      let d = this.data.data
      // console.log(d)
      return new Promise((resolve, reject) => {
        util.http({
          url: app.domain2 + 'qrcode',
          data,
          hideLoading: false
        }).then(ret => {
          resolve(ret.data)
        })
      })
    },
    // 预览图片
    seeImg(imgPath) {
      // console.log(imgPath)
      var that = this
      wx.previewImage({
        current: imgPath,
        urls: [imgPath], // 需要预览的图片http链接列表
        success: function() {
          wx.hideLoading();
          wx.saveImageToPhotosAlbum({
            filePath: imgPath,
            success: () => {
              util.tips('已保存到相册')
            }
          })
          that.close()
        }
      })
    },
    // 获取中间图片的宽高
    getImgSize(urls) {
      let url = urls.replace('http://', 'https://')
      return new Promise((resolve, reject) => {
        wx.getImageInfo({
          src: url,
          success: res => {
            res.scale = res.width / res.height
            resolve(res)
          },
          fail: () => {
            wx.hideLoading()
            util.tips('生成失败')
          }
        })
      })
    },
    // 绘制圆形图片
    circleImg(options) {
      let ctx = options.ctx
      var r = options.width / 2 /** 半径 */
      var d = 2 * r; /** 直径 */
      var cx = options.x + r;
      var cy = options.y + r;
      // console.log(r,d,cx,cy)
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2, false);
      ctx.clip()
      ctx.drawImage(options.path, options.x, options.y, d, d);
      ctx.restore()
    },
    // 贺卡中间的字
    drawCenterText(options) {
      let ctx = options.ctx
      // 设置颜色
      ctx.setFillStyle(options.style ? options.style : '#F9EDB0')
      /// 设置字体大小
      ctx.setFontSize(options.fontSize ? options.fontSize : rate(28));
      // 设置文字方向
      if (options.align) ctx.setTextAlign(options.align)
      var s2 = []

      var arr = options.str.split('')
      var s = ''

      for (let i = 0; i < arr.length; i++) {
        s += arr[i]
        // 有换行符就直接塞入数组
        if (/\n/g.test(arr[i])) {
          s2.push(s)
          s = ''
          continue
        } else if (ctx.measureText(s).width > options.maxWidth) {
          var ss = s.split('')
          if (s2.length >= 1) {
            let temp = ss.splice(0, ss.length - 1).join('')
            temp = temp.substring(0, temp.length-1) + '...'
            s2.push(temp)
            break;
          } else {
            s2.push(ss.splice(0, ss.length - 1).join(''))
            s = ss[ss.length - 1]
          }
        }
        if (i == arr.length - 1) {
          s2.push(s)
        }
      }
      // console.log(s2)
      let y = options.y
      if (s2.length > 2) {
        s2 = [s2[0], s2[1]]
      }
      // 如果是赛事海报 且名称短只有一行就下移一点
      if (this.data.isMatch && s2.length == 1) {
        y += (options.lineHeight / 2)
      }
      // console.log(s2)
      s2.forEach(item => {
        console.log(y)
        ctx.fillText(item, options.x, y);
        y += options.lineHeight
      })
    },
    compare(p) {
      return function (a, b) {
        var value1 = a[p]
        var value2 = b[p]
        return value1 - value2;
      }
    }
  },
})