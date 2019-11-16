Page({
  data: {
    showDia: 0
  },

  onLoad: function(options) {
    if (getApp().loginStatus) {
      this.setData({
        loginStatus: getApp().loginStatus
      })
    } else {
      // getApp().getUserInfo()
    }
    wx.setNavigationBarTitle({
      title: '手机号绑定'
    });

  },

  // 貌似无用
  isLogin: function() {
    var thiss = this
    var url = getApp().domain2 + 'validate';
    // return false;
    if (wx.getStorageSync('userId')) {
      wx.request({
        url: url,
        header: wx.getStorageSync('memberId'),
        data: {},
        success: function(res) {
          if (res.statusCode == 200) {
            if (res.data.code == "0") {
              if (res.data.data.isLogin) {
                wx.navigateBack({
                  delta: 1
                })
              } else {

              }
            } else {
              getApp().login(_this)
            }
          }

        }
      })
    }
  },




  message: function(message) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    })
  },

  //获取输入手机号码的值
  getPhone: function(e) {
    this.setData({
      verifyPhoneNum: e.detail.value,
    })
  },

  //获取输入的验证码
  getVerify: function(e) {
    this.setData({
      verifyCode: e.detail.value,
    })
  },

  //获取验证码
  getVerifyCode: function() {
    var _this = this;
    var phone = _this.data.verifyPhoneNum;
    var verifyCode = _this.data.verifyCode;
    if (!(/^1[3456789]\d{9}$/.test(phone))) {
      _this.message('请输入正确手机号码');
      return false;
    }

    _this.setData({
      verifyTime: 60
    })
    var interval = setInterval(function() {
      if (_this.data.verifyTime > 0) {
        _this.setData({
          verifyTime: _this.data.verifyTime - 1
        })
      } else {
        clearInterval(interval)
      }
    }, 1000);
    let data = {
      phone: phone,
      code: 1
    };
    let url = getApp().domain2 + 'app/getVerify';

    wx.request({
      url: url,
      data: {
        phonenumber: phone,
        code: 1
      },
      header: getApp().header,
      success: function(res) {
        if (res.statusCode == 200) {
          if (res.data.code == 0) {
            _this.message('验证码发送成功');
          } else {
            _this.message('验证码发送失败');
          }
        }
      }
    })
  },

  //取消绑定手机号码
  verifyCancel: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  // 获取用户信息
  bindUserInfo(e) {
    console.log(e)
    if (e.detail.errMsg == 'getUserInfo:ok') {
      getApp().setUserInfo(e.detail.rawData, this.verifyConfirm)
    }
  },
  //提交
  verifyConfirm: function() {
    let _this = this;
    if (!_this.data.verifyPhoneNum || !_this.data.verifyCode) {
      _this.message('验证码和手机号码不能为空');
      return false;
    }
    console.log('111111111')
    var data = [];
    // let userInfo = JSON.parse(res2.rawData);
    //     data.nickName = userInfo.nickName;
    //     data.avatarUrl = userInfo.avatarUrl;
    //     data.sex = userInfo.gender;
    data.phone = _this.data.verifyPhoneNum;
    data.verifyCode = _this.data.verifyCode;
    let url = getApp().domain2 + 'app/session/changeUser';
    console.log('22222222')
    // console.log('data是谁的值',res2)
    wx.request({
      url: url,
      data: data,
      header: getApp().header,
      success: function(res) {
        console.log('改变用户', res)
        if (res.statusCode == 200) {
          if (res.data.code == 0) {
            if (res.data.data.memberId) {
              getApp().loginStatus = true;
              let header = {};
              header.Cookie = 'JSESSIONID=' + res.data.data.sessionId;
              getApp().header = header;
              wx.setStorage({
                key: "sessionId",
                data: header,
              });
              _this.message('绑定成功');
              setTimeout(function() {
                wx.reLaunch({
                  url: '/pages/my/my?id=1'
                })
              }, 2000)
            } else {
              _this.message(res.data.msg);
            }
          } else {
            _this.message(res.data.msg);
          }
        }
      }
    })
    // wx.getUserInfo({
    //   success: function (res2) {
    //     let userInfo = JSON.parse(res2.rawData);
    //     data.nickName = userInfo.nickName;
    //     data.avatarUrl = userInfo.avatarUrl;
    //     data.sex = userInfo.gender;
    //     data.phone = _this.data.verifyPhoneNum;
    //     data.verifyCode = _this.data.verifyCode;
    //     let url = getApp().domain2 + 'app/session/changeUser';
    //     console.log('22222222')
    //     console.log('data是谁的值',res2)
    //     wx.request({
    //       url: url,
    //       data: data,
    //       header: getApp().header,
    //       success: function (res) {
    //         console.log('改变用户',res)
    //         if (res.statusCode == 200) {
    //           if (res.data.code == 0) {
    //             if (res.data.data.memberId) {
    //               getApp().loginStatus = true;
    //               let header = {};
    //               header.Cookie = 'JSESSIONID=' + res.data.data.sessionId;
    //               getApp().header = header;
    //               wx.setStorage({
    //                 key: "sessionId",
    //                 data: header,
    //               });
    //               _this.message('绑定成功');
    //               setTimeout(function () {
    //                 wx.reLaunch({
    //                   url: '/pages/my/my?id=1'
    //                 })
    //               }, 2000)
    //             } else {
    //               _this.message(res.data.msg);
    //             }
    //           } else {
    //             _this.message(res.data.msg);
    //           }
    //         }
    //       }
    //     })
    //   },
    //   fail: function () {
    //     console.log('33333333')
    //     wx.navigateBack({
    //       delta: 2
    //     })
    //   }
    // });



  },






  onReady: function() {

  },


  onShow: function() {

  },


  onHide: function() {

  },


  onUnload: function() {

  },


  onPullDownRefresh: function() {

  },


  onReachBottom: function() {

  },


  onShareAppMessage: function() {

  }
})