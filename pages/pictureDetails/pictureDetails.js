const app = getApp();
var verify = require('../../pages/public/verify/verify.js');
var touchDot = 0; //触摸时的原点  
var time = 0; // 时间记录，用于滑动时且时间小于1s则执行左右滑动  
var interval = ""; // 记录/清理时间记录  
var touchMove = 0; //移动坐标

const ratepx = 750.0 / wx.getSystemInfoSync().windowWidth;

/// 获取canvas转化后的rpx
const rate = function(rpx) {
  return rpx / ratepx
};

Page({
  data: {
    loginStatus: true,
    indicatorDots: true,
    autoplay: true,
    interval: 1000,
    duration: true,
    complaintUrl: "app/session/complaint", //举报
    workDetailsUrl: "getWorksDetail", //商品详情url
    pictureCommentUrl: "app/getWorksComment", //评论信息url
    userCommentUrl: "app/session/userComment", //二级评论
    changeFollowStatusUrl: "app/session/changeFollowStatus", //关注状态修改
    pictureComment: null, //保存评论信息
    pictureCommentPage: 1, //评论页数
    pictureCommentNum: 1, //code==-1时评论最多调用5次
    pictureCommentPageTotal: 1, //评论页数
    pictureCommentCommentPush: null, //评论缓存
    pictureCommentStop: false, //上拉加载flag
    pictureCommentStateActive: "",
    pictureDetailsPositionImageComment: "/images/01-pictureDetail-07.png",
    pictureDetailsPositionImagelike: "/images/01-pictureDetail-08.png",
    pictureDetailsPositionImagelikeTrue: "/images/01-pictureDetail-0801.png",
    pictureDetailsPositionImagelikeFlag: false,
    pictureDetailsPositionImageCollection: "/images/01-pictureDetail-09.png",
    pictureDetailsPositionImageCollectionTrue: "/images/01-pictureDetail-0901.png",
    pictureDetailsPositionImageCollectionFlag: false,
    pictureDetailsPositionImageHome: "/images/home_bottom.png",
    likeUrl: "app/session/good", //点赞url
    collectionUrl: "app/session/collect", //收藏url
    rewardUrl: 'app/session/reward',
    memberWalletUrl: 'app/session/memberWallet',
    commentMessageActive: "", //评论模态框
    TotalMessageNum: 70, //限制字的数量
    TotalMessageNumLength: 0, //输入的子的数量
    usreCommentMessageLength: 0,
    commentMessageUrl: "app/session/comment", //评论url
    shareActive: "", //分享模态框
    attentionActive: "", //关注的class类
    qrCode: '', //分享的二维码
    posterImg: '',
    posertImgHeight: '', //海报图片高度
    posertImgHeight1: '', //海报图片长用这个高度

    hidden: false,
    commentStatus: false,
    descAll: false,
    reward: false,
    posterShareShow: false,
    posteBoxShow: false,
    myWallet: 0,
    cardInfo: {
      avater: "https://image.91sjyx.com/2019-07-02/201907021435432824518787.jpg", //需要https图片路径
      qrCode: "https://image.91sjyx.com/2019-06-28/1561690851870V0L2Sw.jpg?x-oss-process=image/resize,h_100", //需要https图片路径
      TagText: "小姐姐", //标签
      Name: '小姐姐', //姓名
      Position: "程序员鼓励师", //职位
      Mobile: "13888888888", //手机
      Company: "前海城市风貌和建筑特实打实大师的湿哒哒打打实打实大师的撒打算", //公司
    }
  },
  onLoad: function(options) {

    var arrId = getApp().arrId;

    if (options.scene) {
      let scene = decodeURIComponent(options.scene);

      //&是我们定义的参数链接方式

      let docid = scene.split("&")[0];
      let fileType = parseInt(scene.split('&')[1])
      //其他逻辑处理。。。。。
      this.setData({
        docid: docid,
        fileType: fileType == 1 ? 1 : 0, //0为图片 1为视频
      })
    } else {
      this.setData({
        docid: options.imgId,
        fileType: options.fileType == 1 ? 1 : 0, //0为图片 1为视频
      })
    }


    this.getCode()
    //调用图片详情
    this.getWorksDetails();

    //调用图片评论
    this.getPictureComments();

    // //禁止下拉刷新
    // wx.stopPullDownRefresh();
  },

  reward: function() {
    // this.setData({
    //   reward: !this.data.reward
    // })
    //检查是否登录
    if (!getApp().loginStatus) {
      wx.navigateTo({
        url: '/pages/public/login/login',
      })
      return false;
    }

    var _this = this;
    let url = getApp().domain2 + this.data.memberWalletUrl;
    wx.request({
      url: url,
      method: "POST",
      dataType: "json",
      data: {},
      header: getApp().header,
      success: function(res) {
        if (res.data.code == 0) {
          _this.setData({
            myWallet: res.data.data.myWallet,
            reward: !_this.data.reward,
            hidden: true
          })
        } else {
          _this.message(res.data.msg);
        }

      }
    })
  },

  onmatch: function(e) {
    let id = e.currentTarget.dataset.id;
    let status = e.currentTarget.dataset.status;
    // if (status == 1) {
    //   wx.navigateTo({
    //     url: '/pages/activity/examine/matchdetail/matchdetail?matchId=' + id,
    //   })
    // } else if (status == 2) {
    //   wx.navigateTo({
    //     url: '/pages/activity/activityend/matchdetail/matchdetail?matchId=' + id,
    //   })
    // } else {
    //   wx.navigateTo({
    //     url: '/pages/activity/matchdetail/matchdetail?id=' + id,
    //   })
    // }
    wx.navigateTo({
      url: '/pages/activity/matchdetail/matchdetail?id=' + id + '&status=' + status,
    })
  },
  //海报****************
  draw: function() {
    var that = this;
    wx.showLoading({
      title: '生成中...',
      mask: true,
    });
    return new Promise((resolve, reject) => {
      /// 获取大的图
      let promise1 = new Promise(function(resolve, reject) {
        let images = that.data.worksDetails.images.replace('http', 'https')

        wx.downloadFile({
          url: images, //头像图片路径
          success: function(res) {
            console.log(res)
            if (res.statusCode === 200) {

              resolve(res.tempFilePath);
            } else {
              reject(err);
            }
          }
        })
        // wx.getImageInfo({
        //   src: images,
        //   success: function(res) {
        //   },
        //   fail: function(fail) {
        //     resolve('');
        //   }
        // })
      });
      /// 获取头像图片
      let promise2 = new Promise(function(resolve, reject) {
        var user_portrait
        if (that.data.worksDetails.user_portrait.indexOf('https') == -1) {
          user_portrait = that.data.worksDetails.user_portrait.replace('http', 'https')

        } else {
          user_portrait = that.data.worksDetails.user_portrait
        }

        wx.downloadFile({
          url: user_portrait, //头像图片路径
          success: function(res) {
            if (res.statusCode === 200) {

              resolve(res.tempFilePath);
            } else {
              reject(err);
            }
          }
        })
      });
      /// 获取小程序码图片
      let promise3 = new Promise(function(resolve, reject) {
        let qrCode = that.data.qrCode.replace('http', 'https')

        wx.downloadFile({
          url: qrCode, //头像图片路径
          success: function(res) {
            if (res.statusCode === 200) {

              resolve(res.tempFilePath);
            } else {
              reject(err);
            }
          }
        })
      });
      /// 获取小程序码图片
      let promise4 = new Promise(function(resolve, reject) {
        wx.downloadFile({
          url: 'https://image.91sjyx.com/sjyx/static/sjyxlogo.png', //头像图片路径
          success: function(res) {
            if (res.statusCode === 200) {

              resolve(res.tempFilePath);
            } else {
              reject(err);
            }
          }
        })
      });
      /// 同步回调
      Promise.all(
        [promise1, promise2, promise3, promise4]
      ).then(res => {
        const ctx = wx.createCanvasContext('myCanvas'); //创建画布
        wx.createSelectorQuery().select('#canvas-container').boundingClientRect(function(rect) {
          // 计算宽高比例
          var Multiple = parseInt(that.data.worksDetails.iheight) / parseInt(that.data.worksDetails.iwidht)

          var width = rect.width; // 获取canvas实例的宽度 即当前屏幕宽度
          var imgHeight = rect.width * Multiple;  // 根据获取的宽度与比例计算图片高度
          // 白色背景
          ctx.setFillStyle('#fff');
          ctx.fillRect(0, 0, rect.width, imgHeight + rate(300));

          //图片
          if (res[0]) {
            ctx.drawImage(res[0], 0, 0, rect.width, imgHeight);
            ctx.setFontSize(rate(14));
            ctx.setFillStyle('#fff');
            ctx.setTextAlign('left');
          }

          // 描述
          if (that.data.worksDetails.describe) {

            that.drawText({
              ctx: ctx,
              str: that.data.worksDetails.describe,
              //str: cardInfo.Company,
              maxLine: 2,
              maxWidth: width / 2,
              x: rate(30),
              y: imgHeight + rate(53),
              height: rate(40),
              fontSize: rate(30)
            })
          }

          //  绘制头像
          if (res[1]) {
            ctx.save();
            var r = rate(24)
            var d = 2 * r;
            var cx = rate(30) + r;
            var cy = imgHeight + rate(127) + r;
            ctx.arc(cx, cy, r, 0, 2 * Math.PI);
            ctx.clip();
            ctx.drawImage(res[1], rate(30), imgHeight + rate(127), d, d);
            ctx.restore();
          }
          //姓名
          if (that.data.worksDetails.user_name) {
            ctx.setFontSize(rate(26));
            ctx.setFillStyle('#999');
            ctx.setTextAlign('left');
            ctx.fillText(that.data.worksDetails.user_name, rate(50) + rate(24) * 2, imgHeight + rate(163));

          }



          //  绘制二维码
          if (res[2]) {
            ctx.drawImage(res[2], width - (width / 4) - rate(40), imgHeight + rate(70), width / 4, width / 4)
            ctx.setFontSize(rate(20));
            ctx.setFillStyle('#d24e24');
            ctx.fillText("长按保存及查看详情", width - (width / 3) + rate(30), imgHeight + rate(50));
          }
          //  绘制图标
          if (res[3]) {
            ctx.drawImage(res[3], rate(30), imgHeight + rate(213), width / 3.4, width / 22)
          }

        }).exec()

        setTimeout(function() {
          //ctx.draw();
          ctx.draw(false, function() {
            wx.canvasToTempFilePath({
              canvasId: 'myCanvas', //canvasId和标签里面的id对应
              success: (res) => {
                var imgpath = res.tempFilePath;
                that.setData({
                  //将获取到的图片临时路径set到canvasSaveimg中
                  posterImg: imgpath
                })
                wx.previewImage({
                  current: imgpath,
                  urls: [imgpath], // 需要预览的图片http链接列表
                  success: function() {
                    wx.hideLoading();
                    // wx.showToast({
                    //   title: '长按保存海报',
                    //   icon :'none',
                    //   duration: 3000
                    // })
                  },
                  fail: function() {
                    wx.showToast({
                      title: '生成失败',
                      icon: 'none',
                      duration: 3000
                    })
                    wx.hideLoading();
                  }
                })
              }
            })
          });

        }, 1000)
      }, err => {
        //reject();
      })
    })
  },

  //获取二维码
  getCode: function() {
    var that = this
    var data = {
      // scene:'1562296714332KG6ZHw&0',
      scene: that.data.docid + '&' + that.data.fileType,
      page: 'pages/pictureDetails/pictureDetails',
    }

    wx.request({
      url: app.domain2 + 'qrcode',
      data: data,
      header: getApp().header,
      success: function(res) {
        if (res.statusCode == 200)
          that.setData({
            qrCode: res.data.data
          })
      }
    });
  },

  cancelPoster: function() {
    this.setData({
      posterShareShow: false,
      posteBoxShow: false
    })
  },
  setPoster: function() {
    var Multiple = parseInt(this.data.worksDetails.iheight) / parseInt(this.data.worksDetails.iwidht)
    var posertImgHeight = 750 * Multiple + 300;

    // if(posertImgHeight>1030){
    //   this.setData({
    //     // posertImgHeight1:posertImgHeight*0.8,
    //     posertImgHeight1:posertImgHeight,
    //     posteBoxShow: true,
    //     posertImgHeight:posertImgHeight,
    //   })
    // }else{

    // }
    this.setData({
      posteBoxShow: true,
      posertImgHeight: posertImgHeight,
      posertImgHeight1: posertImgHeight
    })
    this.draw()
  },
  showPoster: function() {
    this.setData({
      posterShareShow: true
    })
  },
  /*
  * 多行文字处理，每行显示数量

  */
  /// 绘制文本
  drawText: function(options) {
    console.log(options)
    /// 获取总行数
    var count

    /// 当前字符串的截断点
    var endPos = 0;
    /// 设置文字颜色
    options.ctx.setFillStyle(options.style ? options.style : '#353535');
    /// 设置字体大小
    options.ctx.setFontSize(options.fontSize ? options.fontSize : rate(20));
    /// 循环截断
    if (options.ctx.measureText(options.str).width > options.maxWidth) {
      count = 2
    } else {
      count = 1
    }
    for (var j = 0; j < count; j++) {
      /// 当前剩余的字符串
      var nowStr = options.str.slice(endPos),

        /// 每一行当前宽度
        rowWid = 0,
        /// 每一行顶部距离
        y = options.y + (count == 1 ? 0 : j * options.height);
      /// 如果当前的字符串宽度大于最大宽度，然后开始截取
      if (options.ctx.measureText(nowStr).width > options.maxWidth) {
        for (var m = 0; m < nowStr.length; m++) {
          /// 计算当前字符串总宽度
          rowWid += options.ctx.measureText(nowStr[m]).width;
          if (rowWid > options.maxWidth) {
            /// 如果是最后一行
            if (j === options.maxLine - 1) {
              options.ctx.fillText(nowStr.slice(0, m - 1) + '...', options.x, y);
            } else {
              options.ctx.fillText(nowStr.slice(0, m), options.x, y);
            }
            /// 保留下次截断点
            endPos += m;
            break;
          }
        }
      } else { /// 如果当前的字符串宽度小于最大宽度就直接输出
        options.ctx.fillText(nowStr.slice(0), options.x, y);
      }
    }
  },

  // ****************
  cancel: function() {
    this.setData({
      reward: false,
      hidden: false
    })
  },

  bkSelect: function(e) {
    var reward = e.currentTarget.dataset.kb;
    this.setData({
      kb: reward,
      inputMoney: false
    })
  },
  kbFocus: function() {
    this.setData({
      kb: 0
    })
  },
  kbInput: function(e) {
    this.setData({
      kb: e.detail.value,
    })
  },
  //其它金额
  onInput: function() {
    this.setData({
      inputMoney: true
    })
  },
  rewardSubmit: function() {
    var _this = this;
    var kb = this.data.kb;
    var docId = this.data.docid
    if (isNaN(kb)) {
      this.message('请输入正确金额');
      return false;
    }
    this.setData({
      isSubmit: true
    })
    let url = getApp().domain2 + this.data.rewardUrl;
    wx.request({
      url: url,
      method: "POST",
      dataType: "json",
      data: {
        kb: kb,
        docId: docId,
        code: 0
      },
      header: getApp().header,
      success: function(res) {
        if (res.data.code == 0) {
          _this.message('打赏成功');
        } else {
          _this.message(res.data.msg);
        }
        _this.setData({
          reward: false,
          isSubmit: false,
          hidden: false
        })
      }
    })
  },

  onRecharge: function() {
    wx.navigateTo({
      url: '/pages/my/wallet/recharge/recharge',
    })
  },

  //图片详情ajax
  getWorksDetails: function() {
    var _this = this;
    touchMove = 0;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.domain2 + this.data.workDetailsUrl,
      header: getApp().header,
      data: {
        docid: this.data.docid,
        fileType: this.data.fileType
      },
      success: function(res) {
        if (res.data.code == 0) {
          wx.getSystemInfo({
            success: (rest) => {
              _this.setData({
                iheight: res.data.data.iheight / res.data.data.iwidht * 750,
                iwidht: 750,
              })
            }
          });

          if (res.data.data.isGood) {
            _this.setData({
              pictureDetailsPositionImagelikeFlag: true
            })
          }
          if (res.data.data.isKeep) {
            _this.setData({
              pictureDetailsPositionImageCollectionFlag: true
            })
          }

          res.data.data.describe = res.data.data.describe ? res.data.data.describe : res.data.data.title;
          let imgType = {
            id: res.data.data.type_id,
            name: res.data.data.type_name
          }
          getApp().imgType = imgType;

          //数据赋值
          _this.setData({
            worksDetails: res.data.data,
            isMatchStatus: res.data.data.match.length
          })

          //调用设置标题函数
          _this.setTitle(res.data.data.title);
          _this.stars(res.data.data.rank)
          setTimeout(function() {
            wx.hideLoading()
          }, 1000)
        } else {

        }


      }
    });
  },
  //设置标题函数
  setTitle: function(title) {
    wx.setNavigationBarTitle({
      title: title
    })
  },

  descAll: function() {
    let code = this.data.descAll;
    code = code ? false : true;
    this.setData({
      descAll: code
    })
  },

  //图片评论
  getPictureComments: function() {
    var _this = this;
    wx.request({
      url: app.domain2 + this.data.pictureCommentUrl,
      header: getApp().header,
      data: {
        docid: this.data.docid,
        page: this.data.pictureCommentPage
      },
      success: function(res) {

        if (res.statusCode == 200) {
          //页面赋值
          if (res.data.code != '-1') {
            if (_this.data.pictureCommentPage > 1) {
              var pictureCommentComment = "pictureComment.comment"

              //评论信息缓存追加 循环
              for (var i = 0; i < res.data.data.comment.length; i++) {
                _this.data.pictureCommentCommentPush.push(res.data.data.comment[i]);
              }

              _this.setData({
                [pictureCommentComment]: _this.data.pictureCommentCommentPush,

              })
            } else {
              _this.setData({
                pictureComment: res.data.data,
                pictureCommentCommentPush: res.data.data.comment
              })
            }
          } else {
            _this.data.pictureCommentNum++
              if (_this.data.pictureCommentNum < 5) {
                setTimeout(function() {
                  _this.getPictureComments()
                }, 1000)
              }


          }
          //判断页码
          if (!res.data.data.comment.length) {
            _this.setData({
              pictureCommentStop: true,
              pictureCommentStateActive: "active",
              pictureCommentState: "没有更多评论信息"
            })
          }

        } else {

        }


      }
    });
  },
  onuser: function(e) {
    //检查是否登录
    if (!getApp().loginStatus) {
      // this.setData({
      //   loginStatus: false,
      // })
      wx.navigateTo({
        url: '/pages/public/login/login',
      })
      return false;
    }

    let userId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/userhome/userhome?userId=' + userId,
    })
  },

  //上拉触底监听
  onReachBottom: function() {
    var _this = this;

    if (!_this.data.pictureCommentStop) {
      //修改页码
      _this.setData({
        pictureCommentPage: _this.data.pictureCommentPage += 1
      })
      //重新调用图片评论请求
      this.getPictureComments();
    }
  },
  //评论信息下一页函数
  commentNext: function() {
    var _this = this;
    if (!_this.data.pictureCommentStop) {
      //修改页码
      _this.setData({
        pictureCommentPage: _this.data.pictureCommentPage += 1
      })
      //重新调用图片评论请求
      this.getPictureComments();
    }
  },
  //点赞事件
  like: function() {

    //检查是否登录
    if (!getApp().loginStatus) {
      wx.navigateTo({
        url: '/pages/public/login/login',
      })
      return false;
    }

    if (this.data.pictureDetailsPositionImagelikeFlag) {
      this.message('不能重复点赞');
      return false;
    }
    let url = app.domain2 + this.data.likeUrl;
    let data = {
      docid: this.data.docid,
    };
    var datakey = "worksDetails.good_num";
    var flag = "pictureDetailsPositionImagelikeFlag";
    //先点赞后增加数量， 后请求
    let good_num = this.data.worksDetails.good_num;
    good_num++;
    this.setData({
      [datakey]: good_num,
      [flag]: true
    })
    this.query(url, data, datakey, flag);
  },
  //数据请求
  query: function(url, data, datakey, flag) {
    var _this = this;
    wx.request({
      url: url,
      data: data,
      header: getApp().header,
      success: function(res) {
        if (res.statusCode == 200) {
          if (res.data.code == 0) {
            //赋值点赞数量
            _this.setData({
              [datakey]: res.data.data.num,
              [flag]: true
            })
          } else {
            _this.message(res.data.msg);
          }
        } else {
          _this.message();
        }

      }
    });
  },

  //消息提示
  message: function(message = '网络请求失败') {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    })
  },
  //收藏事件
  collection: function() {
    //检查是否登录
    if (!getApp().loginStatus) {
      // this.setData({
      //   loginStatus: false
      // })
      wx.navigateTo({
        url: '/pages/public/login/login',
      })
      return false;
    }

    if (this.data.pictureDetailsPositionImageCollectionFlag) {
      this.message('不能重复收藏');
      return false;
    }

    let url = app.domain2 + this.data.collectionUrl;
    let data = {
      docId: this.data.docid,
      collect: 1,
    }
    let datakey = "worksDetails.collect_num";
    let flag = "pictureDetailsPositionImageCollectionFlag";

    //先收藏后增加数量， 后请求
    let collect_num = this.data.worksDetails.collect_num;
    collect_num++;
    this.setData({
      [datakey]: collect_num,
      [flag]: true
    })

    this.query(url, data, datakey, flag);
  },
  onhome: function() {
    wx.reLaunch({
      url: '/pages/img/img'
    })
  },
  //进入更多点赞列表
  onUserList: function() {
    if (!getApp().loginStatus) {
      // this.setData({
      //   loginStatus: false
      // })
      wx.navigateTo({
        url: '/pages/public/login/login',
      })
      return false;
    }
    let docId = this.data.docid;
    wx.navigateTo({
      url: '/pages/my/myUserList/myUserList?code=4&docId=' + docId,
    })
  },

  //评论模态框取消注册事件
  commentCall: function(e) {

    //清空评论信息active值
    this.setData({
      commentMessageActive: "",
      Comment: "",
      TotalMessageNumLength: 0,
      hidden: false
    })
  },
  //总评论注册事件
  TotalComments: function() {
    //检查是否登录
    if (!getApp().loginStatus) {
      // this.setData({
      //   loginStatus: false
      // })
      wx.navigateTo({
        url: '/pages/public/login/login',
      })
      return false;
    }

    //设置评论信息active值
    this.setData({
      commentMessageActive: "active",
      hidden: true
    })
  },
  //总评价模态框delect注册事件
  commentMessageDelect: function() {
    //清空评论信息active值
    this.setData({
      commentMessageActive: ""
    })
  },
  //为总评价发布注册事件
  commentMessageRelease: function(e) {
    var commentMessage = this.data.getTotalMessage;

    this.setData({
      hidden: false
    })

    if (!commentMessage) {
      this.message('请输入评论内容')
      return false
    }
    if (!commentMessage.replace(/^\s+|\s+$/g, "")) {
      this.message('请输入评论内容')
      return false
    }
    this.commentMessageReleaseAjax();
  },
  //监听文本域值的改变
  getMessage: function(e) {
    this.setData({
      getTotalMessage: e.detail.value,
      TotalMessageNumLength: e.detail.value.length
    })

  },

  zoom: function(e) {
    let imgPath = e.currentTarget.dataset.img.toString().split('?')[0]
    wx.previewImage({
      current: imgPath,
      urls: [imgPath],
    })
    // wx.getSystemInfo({
    //   success: (res) => {
    //     var w = res.windowWidth;
    //     let img = e.currentTarget.dataset.img;
    //     let title = this.data.worksDetails.title;
    //     let imgh = this.data.worksDetails.iheight;
    //     let imgw = this.data.worksDetails.iwidht;
    //     let scale = imgh / imgw;
    //     let h = w * scale;
    //     wx.navigateTo({
    //       url: '/pages/public/main/main?title=' + title + '&w=' + w + '&h=' + h + '&img=' + img
    //     })

    //   }
    // });

  },

  stars: function(num) {
    var num = num.toString().substring(0, 1);
    var array = [];
    for (var i = 1; i <= 5; i++) {
      if (i <= num) {
        array.push(1);
      } else {
        array.push(0);
      }
    }
    this.setData({
      stars: array
    });
  },


  //二级评论
  cancelComment: function() {
    this.setData({
      userComment: 0,
      hidden: false
    })
  },
  reply: function(e) {
    // 检查是否登录
    if (!getApp().loginStatus) {
      // this.setData({
      //   loginStatus:false
      // })
      wx.navigateTo({
        url: '/pages/public/login/login',
      })
      return false;
    }

    this.setData({
      hidden: 1,
    });

    let userId = e.currentTarget.dataset.id;
    let commentId = e.currentTarget.dataset.commentid;
    let userName = '@' + e.currentTarget.dataset.name;

    this.setData({
      userComment: 1,
      userData: {
        userId: userId,
        userName: userName,
        commentId: commentId
      },
    });
  },

  getUserMessage: function(e) {
    this.setData({
      userCommentMessage: e.detail.value,
      usreCommentMessageLength: e.detail.value.length,
    })
  },

  submitUserReply: function() {
    let commentMessage = this.data.userCommentMessage;
    if (!commentMessage) {
      this.message('请输入评论内容')
      return false
    }
    if (!commentMessage.replace(/^\s+|\s+$/g, "")) {
      this.message('请输入评论内容')
      return false
    }
    let url = app.domain2 + this.data.userCommentUrl;
    let userId = this.data.userData.userId;
    let commentId = this.data.userData.commentId;

    this.setData({
      userComment: 0,
      hidden: false
    })
    let data = {
      comment: commentMessage,
      userId: userId,
      commentId: commentId
    }
    this.userCommentQuery(url, data);
  },
  //二级评论提交
  userCommentQuery: function(url, data) {
    console.log(11)
    var _this = this;
    wx.request({
      url,
      data: data,
      header: getApp().header,
      success: function(res) {
        if (res.statusCode == 200) {
          if (res.data.code == 0) {
            //评论成功重置page页，获取数据 
            _this.setData({
              pictureCommentPage: 1
            })
            _this.getPictureComments();
            _this.message('消息评论成功');
            _this.setData({
              userComment: 0,
              usreCommentMessageLength: 0,
              userCommentMessage: '',
              hidden: false,
            })
          } else {
            _this.message(res.data.msg)
          }
        } else {
          _this.message()
        }


      }
    });
  },

  //发布评论ajax请求函数
  commentMessageReleaseAjax: function() {

    this.setData({
      hidden: false,
      commentMessageActive: ''
    })
    var _this = this;
    wx.request({
      url: app.domain2 + this.data.commentMessageUrl,
      header: getApp().header,
      data: {
        docId: this.data.docid,
        comment: this.data.getTotalMessage,
      },
      success: function(res) {
        if (res.statusCode == 200) {
          if (res.data.code == 0) {
            _this.setData({
              pictureCommentPage: 1
            })
            var pictureComment = "pictureComment.comment_num";

            _this.getPictureComments();
            _this.message('消息评论成功');
            _this.setData({
              [pictureComment]: res.data.data.num,
              commentMessageActive: '',
              Comment: '',
              TotalMessageNumLength: 0,
              hidden: false,
            })
          } else if (res.data.code == 3 || res.data.code == 4) {
            _this.message(res.data.msg)
          } else {
            if (res.data.code < 0) {
              _this.message(res.data.msg)
              return false;
            }
            setTimeout(function() {
              _this.message(msg);
              wx.switchTab({
                url: '/pages/public/login/login',
              })
            }, 2000)
          }
        } else {
          _this.message();
        }

      },
      fail: function(res) {
        this.setData({
          hidden: false,
        })
      }
    });
  },

  //分享事件 
  onShareAppMessage: function() {
    this.cancelPoster()
    let _this = this

    return {
      title: this.data.worksDetails.title,
      // desc: this.data.worksDetails.describe,
      // imageUrl:this.data.worksDetails.images,
      path: '/pages/pictureDetails/pictureDetails?imgId=' + this.data.docid + '&fileType=' + this.data.fileType,
      success: function(res) {
        _this.message('分享成功')
      }
    }
  },
  //举报
  report: function() {
    //检查是否登录
    if (!getApp().loginStatus) {
      // this.setData({
      //   loginStatus: false
      // })
      wx.navigateTo({
        url: '/pages/public/login/login',
      })
      return false;
    }

    //修改shareActive的值
    this.setData({
      shareActive: "active",
      hidden: true
    })
  },

  //举报里面的删除事件
  shareDelect: function() {
    //修改shareActive的值
    this.setData({
      shareActive: "",
      hidden: false
    })
  },

  //提交举报信息
  onReportContent: function(e) {
    let content = e.currentTarget.dataset.content;
    let docId = this.data.docid;
    let _this = this;
    let url = getApp().domain2 + this.data.complaintUrl;
    wx.request({
      url: url,
      data: {
        docId: docId,
        msg: content
      },
      header: getApp().header,
      success: function(res) {
        if (res.statusCode == 200) {
          if (res.data.code == 0) {
            _this.message('举报成功');

          } else {
            _this.message(msg)
          }
        } else {
          _this.message()
        }
      },
      complete: function(res) {
        _this.setData({
          shareActive: "",
          hidden: false
        })
      }


    });
  },

  //关注事件
  attention: function(e) {
    //检查是否登录
    if (!getApp().loginStatus) {
      // this.setData({
      //   loginStatus: false
      // })
      wx.navigateTo({
        url: '/pages/public/login/login',
      })
      return false;
    }
    let _this = this;
    let url = app.domain2 + this.data.changeFollowStatusUrl;
    let status = e.currentTarget.dataset.status;
    let userId = this.data.worksDetails.member_id;
    status = (status == 1) ? 0 : 1;
    let worksDetails = this.data.worksDetails;
    wx.request({
      url: url,
      header: getApp().header,
      data: {
        code: status,
        userId: userId
      },
      success: function(res) {
        if (res.statusCode == 200) {
          if (res.data.code == 0) {
            worksDetails.is_follow = status;
            _this.setData({
              worksDetails: worksDetails
            })
          } else {
            if (res.data.code > 0) {
              _this.message(res.data.msg);
            } else {
              wx.navigateTo({
                url: '/pages/public/login/login',
              })
            }

          }
        } else {
          _this.message()
        }

      }
    });
  },
  onPullDownRefresh() {
    var self = this;
    wx.showNavigationBarLoading();
    this.getWorksDetails();
    setTimeout(() => {
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading()
    }, 1000);
  },

  bindload: function(e) {
    let imgW = e.detail.width,
      imgH = e.detail.height,
      ratio = imgW / imgH;
    var viewWidth = 750,
      viewHeight = 750 / ratio;
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          top: (res.windowHeight - viewHeight / 2) / 2
        })
      }
    });
    let imgSize = {
      viewWidth: viewWidth / 2,
      viewHeight: viewHeight / 2
    }
    this.setData({
      imgSize: imgSize
    })
  },


  // 触摸开始事件  
  touchStart: function(e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点  
    interval = setInterval(function() {
      time++;
    }, 500);
  },
  // 触摸移动事件  
  touchMove: function(e) {
    touchMove = e.touches[0].pageX;
  },
  // 触摸结束事件  
  touchEnd: function(e) {
    var arrId = getApp().arrId;
    var index = arrId.indexOf(this.data.docid);
    clearInterval(interval); // 清除setInterval  
    var size = (touchMove - touchDot);
    size = size * -1;
    if (touchMove < 1) {
      return false;
    }


    if (size < -80 && time < 1 && index > 0) {
      time = 0;
      this.setData({
        docid: arrId[index - 1]
      })
      this.getWorksDetails();
      this.getPictureComments();
    }
    if (size > 80 && time < 1 && index < arrId.length - 1) {
      time = 0;
      this.setData({
        docid: arrId[index + 1]
      })
      this.getWorksDetails();
      this.getPictureComments();
    }




  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {


  },





});