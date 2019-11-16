
function message(_this,message) {
  wx.showToast({
    title: message,
    icon: 'none',
    duration: 2000
  })
}
//获取输入手机号码的值
function getPhone(_this,e) {
  console.log(e.detail.value)
  _this.setData({
    verifyPhoneNum: e.detail.value,
  })
}

//获取输入的验证码
function getVerify(_this,e) {
  console.log(e.detail.value)
  _this.setData({
    verifyCode: e.detail.value,
  })
}

//获取验证码
function getVerifyCode(_this) {

  var phone = _this.data.verifyPhoneNum;
  var verifyCode = _this.data.verifyCode;
  if (!(/^1[34578]\d{9}$/.test(phone))) {
    _this.message('请输入正确手机号码');
    return false;
  }

  _this.setData({
    verifyTime: 60
  })
  var interval = setInterval(function () {
    if (_this.data.verifyTime > 0) {
        _this.setData({
          verifyTime: _this.data.verifyTime - 1
        })
      }else{
        clearInterval(interval)
      }
    }, 1000);
    let data = {
      phone: phone,
      code:1
    };
    let url = getApp().domain2 + 'app/getVerify';

    wx.request({
      url: url,
      data: { phonenumber: phone, code:1},
      header: getApp().header,
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 0) {
            _this.message('验证码发送成功');
          }else{
            _this.message('验证码发送失败');
          }
        }
      }
    })
}

//取消绑定手机号码
function verifyCancel(_this,e) {
  wx.switchTab({
    url: '/pages/img/img',
  })
}
//提交
function verifyConfirm(_this, callback) {

  if (!_this.data.verifyPhoneNum || !_this.data.verifyCode){
    _this.message('验证码和手机号码不能为空');
  }
  var data = [];
  data.phone = _this.data.verifyPhoneNum;
  data.verifyCode = _this.data.verifyCode;
  data.memberId = wx.getStorageSync('sessionId');
  let userInfo = getApp().userInfo;
  data.nickName = userInfo.nickName;
  data.avatarUrl = userInfo.avatarUrl;
  data.sex = userInfo.gender;
  let url = getApp().domain2 + 'app/register';
  wx.request({
    url: url,
    data: data,
    header: wx.getStorageSync('sessionId'),
    success: function (res) {
      if (res.statusCode == 200){
        if(res.data.code==0){
          if(res.data.data.memberId){
            getApp().loginStatus = true;
            _this.message('绑定成功');
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/my/my'
              })
            }, 2000)
            callback()
          }else{
            _this.message(res.data.msg);
          }

        }else{
          _this.message(res.data.msg);
        }
      }
    }
  })
  
}
module.exports = {
message:message,
verifyConfirm: verifyConfirm,
verifyCancel: verifyCancel,
getVerifyCode: getVerifyCode,
getVerify: getVerify,
getPhone: getPhone
}