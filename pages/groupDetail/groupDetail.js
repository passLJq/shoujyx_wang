const app = getApp();
var verify = require('../../pages/public/verify/verify.js');

Page({
    data: {
        loginStatus: true,
        autoplay: true,
        interval: 1000,
        duration: true,
        complaintUrl:"app/session/complaint", //举报
        workDetailsUrl: "app/groupDetail", //商品详情url
        pictureCommentUrl: "app/getWorksComment", //评论信息url
        userCommentUrl: "app/session/userComment", //二级评论
        changeFollowStatusUrl:"app/session/changeFollowStatus",//关注状态修改
        pictureComment: null, //保存评论信息
        pictureCommentPage: 1, //评论页数
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
        likeUrl: "app/good", //点赞url
        collectionUrl: "app/session/collect", //收藏url
        commentMessageActive: "", //评论模态框
        TotalMessageNum: 70, //限制字的数量
        TotalMessageNumLength: 0, //输入的子的数量
        usreCommentMessageLength:0, 
        commentMessageUrl: "app/session/comment", //评论url
        shareActive: "", //分享模态框
        attentionActive: "", //关注的class类
        hidden:false,
        commentStatus:false,
        descAll: false,

        imgList: [],
        indicatorDots: true,
        autoplay: false,
        interval: 5000,
        duration: 300,
        groupTag:false
    },
    
    onLoad: function (options) {
      console.log('aaa');
      this.setData({
        docid: options.imgId,
        fileType: options.fileType == 1 ? 1 : 0     //0为图片 1为视频
      })
      if(!wx.getStorageSync('status')){
        console.log("sssssssssssss")
        this.setData({
          groupTag:true
        })
        wx.setStorage({
          key: "status",
          data: true
        });
      }


        //调用图片详情
        this.getWorksDetails();
        console.log('1111111111111111')
        //调用图片评论
        this.getPictureComments();
        console.log('2222222222222222')
        // //禁止下拉刷新
        // wx.stopPullDownRefresh();


      this.getGroup();
      console.log('333333333333333333')
    },

    onImg:function(){
      this.setData({
        isgroup:true
      })
    },
    cancel:function(){
      this.setData({
        isgroup: false
      })
    },
    getGroup:function(){
      let _this = this;
      wx.request({
        url: 'https://u.91sjyx.com/index.php/home/test/zutu',
        data: {},
        header: getApp().header,
        success: function (res) {
          if (res.statusCode == 200) {
            if (res.data.code == 0) {

              let data = res.data.data;

              _this.setData({
                imgList: res.data.data
              })
            }
          }
        }
      });
    },


    //图片详情ajax
    getWorksDetails: function() {
      // console.log('aaa');
      // console.log(app.domain2 + this.data.workDetailsUrl)
      // console.log(this.data.docid);
      // console.log(this.data.fileType);
      // console.log(getApp().header);
      // console.log('yy')
      console.log('一点一刻')
        var _this = this;
        wx.request({
            url: app.domain2 + this.data.workDetailsUrl,
            header: getApp().header,
            data: {
                docid: this.data.docid,
                fileType: this.data.fileType
            },
            success: function(res) {
             
              console.log(res)
                if (res.data.code == 0) {
                    wx.getSystemInfo({
                      success: (rest) => {
                        _this.setData({
                          iheight: res.data.data.iheight / res.data.data.iwidht *750 ,
                          iwidht: 750,
                        })
                      }
                    });

                    if(res.data.data.isGood){
                      _this.setData({
                        pictureDetailsPositionImagelikeFlag:true
                      })
                    }
                    if (res.data.data.isKeep){
                      _this.setData({
                        pictureDetailsPositionImageCollectionFlag:true
                      })
                    }

                    res.data.data.describe = res.data.data.describe ? res.data.data.describe : res.data.data.title;
                    let imgType = {
                      id: res.data.data.type_id,
                      name:res.data.data.type_name
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
                } else {

                }


            }
        });
    },
    //设置标题函数
    setTitle: function(title) {
      console.log('一点一刻')
        wx.setNavigationBarTitle({
            title: title
        })
    },

    descAll: function () {
      console.log('aaaaaaaaaaaaaaa');
      let code = this.data.descAll;
      code = code ? false : true;
      this.setData({
        descAll:code
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
    onuser:function(e){
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
            console.log(123);
            //重新调用图片评论请求
            this.getPictureComments();
        }
    },
    //点赞事件
    like: function() {
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
      let good_num  = this.data.worksDetails.good_num;
      good_num++;
      this.setData({
        [datakey]: good_num,
        [flag]:true
      })
      this.query(url, data, datakey, flag);
    },
    //数据请求
    query: function (url, data, datakey, flag) {
        var _this = this;
        wx.request({
            url: url,
            data:data,
            header: getApp().header,
            success: function(res) {
              if (res.statusCode == 200){
                if (res.data.code == 0) {
                  //赋值点赞数量
                  _this.setData({
                    [datakey]: res.data.data.num,
                    [flag]: true
                  })
                }else{
                  _this.message(res.data.msg);
                }
              }else{
                _this.message();
              }

            }
        });
    },

    //消息提示
    message: function (message='网络请求失败'){
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

        if (this.data.pictureDetailsPositionImageCollectionFlag){
          this.message('不能重复收藏');
          return false;
        }

        let url = app.domain2 + this.data.collectionUrl;
        let data ={
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

        this.query(url, data, datakey,flag);
    },
    onhome:function(){
      wx.reLaunch({
        url: '/pages/img/img'
      })
    },
    //进入更多点赞列表
    onUserList:function(){
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
         url: '/pages/my/myUserList/myUserList?code=4&docId='+docId,
       })
    },

    //评论模态框取消注册事件
    commentCall: function(e) {

        //清空评论信息active值
        this.setData({
            commentMessageActive: "",
            Comment:"",
            TotalMessageNumLength:0,
            hidden:false
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
            hidden:true
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
          hidden:false
        })

        if (!commentMessage){
          this.message('请输入评论内容')
          return false
        }
        if(!commentMessage.replace(/^\s+|\s+$/g, "")){
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

    zoom:function(e){
      wx.getSystemInfo({
        success: (res) => {
          var w = res.windowWidth;
          let img = e.currentTarget.dataset.img;
          let title = this.data.worksDetails.title;
          let imgh = this.data.worksDetails.iheight;
          let imgw = this.data.worksDetails.iwidht;
          let scale = imgh / imgw;
          let h = w * scale;
          wx.navigateTo({
            url: '/pages/public/main/main?title=' + title + '&w=' + w + '&h=' + h + '&img=' + img
          })

        }
      });

    },

    stars: function (num) {
      var num = num.toString().substring(0, 1);
      var array = [];
      for (var i = 1; i <= 5; i++) {
        if (i <= num) {
          array.push(1);
        }
        else {
          array.push(0);
        }
      }
      this.setData({ stars: array });
    },


    //二级评论
    cancelComment:function(){
      this.setData({
        userComment:0,
        hidden: false
      })
    },
    reply:function(e){
      // 检查是否登录
      if (!getApp().loginStatus){
        // this.setData({
        //   loginStatus:false
        // })
        wx.navigateTo({
          url: '/pages/public/login/login',
        })
        return false;
      }

      this.setData({
        hidden:1,
      });

      let userId  = e.currentTarget.dataset.id;
      let commentId = e.currentTarget.dataset.commentid;
      let userName = '@'+e.currentTarget.dataset.name;
      
      this.setData({
        userComment: 1,
        userData: { userId: userId, userName: userName, commentId: commentId},
      });
    },

    getUserMessage:function(e){
      this.setData({
        userCommentMessage: e.detail.value,
        usreCommentMessageLength: e.detail.value.length,
      })
    },

    submitUserReply:function(){
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
      let data ={
        comment: commentMessage,
        userId: userId,
        commentId: commentId
      }
      this.userCommentQuery(url, data);
    },
  //二级评论提交
    userCommentQuery:function(url,data){
      var _this = this;
      wx.request({
        url: url,
        data: data,
        header: getApp().header,
        success: function (res) {
          if (res.statusCode == 200){
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
                hidden:false,
              })
            } else {
              _this.message(msg)
            }
          }else{
            _this.message()
          }


        }
      });
    },

    //发布评论ajax请求函数
    commentMessageReleaseAjax: function() {

      this.setData({
        hidden: false,
        commentMessageActive:''
      })
        var _this = this;
        wx.request({
          url: app.domain2 + this.data.commentMessageUrl,
          header:getApp().header,
            data: {
                docId: this.data.docid,
                comment: this.data.getTotalMessage,
            },
            success: function(res) {
              if (res.statusCode == 200){
                if (res.data.code == 0) {
                  _this.setData({
                    pictureCommentPage:1
                  })
                  var pictureComment = "pictureComment.comment_num";

                  _this.getPictureComments();
                  _this.message('消息评论成功');
                  _this.setData({
                    [pictureComment]: res.data.data.num,
                    commentMessageActive: '',
                    Comment: '',
                    TotalMessageNumLength: 0,
                    hidden:false,
                  })
                } else {
                  if (res.data.code <0 ){
                      _this.message(res.data.msg)
                      return false;
                  }
                  setTimeout(function () {
                    _this.message(msg);
                    wx.switchTab({
                      url: '/pages/public/login/login',
                    })
                  }, 2000)
                }
              }else{
                _this.message();
              }

            },
            fail: function (res){
              this.setData({
                 hidden:false,
              })
            }
        });
    },

    //分享事件 
    onShareAppMessage: function () {
      let _this = this
      return {
        title: this.data.worksDetails.title,
        desc: this.data.worksDetails.describe,
        success: function (res) {
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
    onReportContent:function(e){
      let content = e.currentTarget.dataset.content;
      let docId = this.data.docid;
      let _this = this;
      let url = getApp().domain2 + this.data.complaintUrl;
      wx.request({
        url: url,
        data: { docId: docId, msg: content},
        header: getApp().header,
        success: function (res) {
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
        complete:function(res){
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
        status = (status==1)?0:1;
        let worksDetails = this.data.worksDetails;
        wx.request({
          url: url,
          header: getApp().header,
          data: {code: status,userId:userId},
          success: function (res) {
            if (res.statusCode == 200) {
              if (res.data.code == 0) {
                worksDetails.is_follow = status;
                _this.setData({
                  worksDetails: worksDetails
                })
              } else {
                if(res.data.code > 0){
                  _this.message(res.data.msg);
                }else{
                  wx.navigateTo({
                    url: '/pages/public/login/login',
                  })
                }

              }
            }else{
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

    bindload: function (e) {
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


    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      // if (getApp().loginStatus) {
      //   this.setData({
      //     loginStatus: getApp().loginStatus
      //   })
      // } else {
      //   this.setData({
      //     loginStatus: false
      //   })
      //   if (!wx.getStorageSync('userInfo')) {
      //     getApp().getUserInfo()
      //   }
      // }

      // this.setData({
      //   loginStatus: getApp().loginStatus
      // })

    },


    // //手机号码绑定
    // getmessage: function (message) {
    //   verify.message(this, message)
    // },
    // //获取输入手机号码的值
    // getPhone: function (e) {
    //   verify.getPhone(this, e)
    // },
    // //获取输入的验证码
    // getVerify: function (e) {
    //   verify.getVerify(this, e)
    // },

    // //获取验证码
    // getVerifyCode: function () {
    //   verify.getVerifyCode(this)
    // },

    // //取消绑定手机号码
    // verifyCancel: function () {
    //   wx.switchTab({
    //     url: '/pages/img/img'
    //   })
    //   //verify.verifyCancel(this)
    // },


    // showUpload:function(){
    //   this.getWorksDetails();
    //   this.getPictureComments();
    // },

    // verifyConfirm: function () {
    //   verify.verifyConfirm(this, this.showUpload())
    // }





});