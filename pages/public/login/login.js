Page({

  data: {
    isRegister: false,
    protocol: true
  },
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '手机号绑定'
    });
    if (getApp().loginStatus) {
      wx.navigateTo({
        url: '/pages/img/img',
      })
    }
  },

  protocol: function() {
    this.setData({
      protocol: !this.data.protocol
    })
  },

  isLogin: function() {
    var thiss = this
    var url = getApp().domain2 + 'validate';
    // return false;
    if (wx.getStorageSync('memberId')) {
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
              } else {}
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
            let isRegister = res.data.data.isRegister;
            _this.setData({
              isRegister: isRegister
            })
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
    wx.switchTab({
      url: '/pages/img/img'
    })
  },

  //提交
  verifyConfirm: function(e) {
    var data = [];
    let isRegister = this.data.isRegister;
    let userInfo = undefined;
    if (!isRegister) {
      userInfo = e.detail.userInfo;
      if (userInfo == undefined) {
        this.message('请授权小程序获取你的头像信息')
        return false;
      }
      data.nickName = userInfo.nickName;
      data.avatarUrl = userInfo.avatarUrl;
      data.sex = userInfo.gender;
    }


    let _this = this;
    if (!_this.data.verifyPhoneNum || !_this.data.verifyCode) {
      _this.message('验证码和手机号码不能为空');
      return false;
    }

    if (!this.data.protocol) {
      _this.message('请选择同意手机影像相关协议');
      return false;
    }

    data.phone = _this.data.verifyPhoneNum;
    data.verifyCode = _this.data.verifyCode;
    let url = getApp().domain2 + 'app/register';
    wx.request({
      url: url,
      data: data,
      header: getApp().header,
      success: function(res) {
        if (res.statusCode == 200) {
          if (res.data.code == 0) {
            if (res.data.data.memberId) {
              getApp().loginStatus = true;
              let header = {
                "Content-Type": "application/x-www-form-urlencoded"
              };
              header.Cookie = 'JSESSIONID=' + res.data.data.sessionId;
              getApp().header = header;
              wx.setStorage({
                key: "sessionId",
                data: header,
              });
              _this.message('绑定成功');
              setTimeout(function() {
                wx.navigateBack({
                  delta: 1
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
  },

  // 查看用户协议
  protocolInfo: function() {
    let url = 'https://i.91sjyx.com/contractus.jsp';
    wx.navigateTo({
      url: '/pages/activity/contestInfo/contestInfo?matchRule=' + url,
    })
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