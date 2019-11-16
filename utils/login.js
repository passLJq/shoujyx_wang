function isLogin(_this) {
  var thiss = this
  var url = getApp().domain2 + 'app/validate';
  // return false;
  if (wx.getStorageSync('memberId')) {
    wx.request({
      url: url,
      header: wx.getStorageSync('memberId'),
      data: {},
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          if (res.data.code == "0") {
            if (res.data.data.memberId) {
              _this.loginStatus = true;
              getApp().loginStatus = true;
              console.log('aa')
            } else {
              _this.loginStatus = false;
              getApp().loginStatus = false;
              console.log('bbbb')
            }
          } else {
            console.log('cccc')
            getApp().login(_this)
          }
        }

      }
    })
  }
}

//登录1
function login() {
  var _this = this;
  wx.login({
    success: res => {
      if (res.code) {
        console.log(res.code)
        _this.getUserInfo(res.code)
      }
    }
  })
}

//获取用户信息2
function getUserInfo(code) {
  var _this = this;
  wx.getSetting({
    success: (res) => {
      if (Object.values(res.authSetting).length == "0") {
        wx.getUserInfo({
          success: function (res2) {
            _this.setUserInfo(res2.rawData, code)
          },
          fail: function () {
          }
        });
      } else {
        if (res.authSetting["scope.userInfo"] == true) {
          wx.getUserInfo({
            success: function (res2) {
              _this.setUserInfo(res2.rawData, code)
            },
            fail: function () {
            }
          });
        } else {
          wx.openSetting({
            success: (res) => {
              if (res.authSetting["scope.userInfo"] == true) {
                wx.getUserInfo({
                  success: function (res2) {
                    _this.setUserInfo(res2.rawData, code)
                  },
                  fail: function () {
                  }
                });
              }
            }
          })

        }
      }

    }
  })
}
//设置缓存3
function setUserInfo(userInfo, code) {
  wx.setStorage({
    key: "userInfo",
    data: userInfo
  });
  let userData = JSON.parse(userInfo)
  getApp().userInfo.nickName = userData.nickName;
  getApp().userInfo.avatarUrl = userData.avatarUrl;
  getApp().userInfo.sex = userData.gender;
  this.getOpenId(code)
}

//获取openid 4
function getOpenId(code) {
  console.log('openId')
  console.log(code)
  var _this = this;
  // let url = "https://v1.91sjyx.com/sunnet_flb/app/getOpenId";
  let url = getApp().domain2 + 'getOpenId';
  console.log(url);
  wx.request({
    url: url,
    data: { code: code },
    success: function (res) {

      console.log(res)
      if (res.statusCode == 200) {
        if (res.data.code == 0) {
          console.log(res.data.data.memberId)
          let header = {};
          header.Cookie = 'JSESSIONID=' + res.data.data.memberId;
          console.log(header)
          wx.setStorage({
            key: "memberId",
            data: header,
          });
          if (res.data.data.isLogin) {
            _this.loginStatus = true;
            getApp().loginStatus=true;
          } else {
            _this.loginStatus = false;
            getApp().loginStatus = false;
          }
        }
      }
    }
  });
}



module.exports = {
  isLogin:isLogin,
  getOpenId: getOpenId,
  setUserInfo: setUserInfo,
  getUserInfo: getUserInfo,
  login: login,
}
