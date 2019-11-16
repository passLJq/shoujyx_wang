const ald = require('./utils/ald-stat')
const util = require('./utils/util')
// console.log(ald)
App({
  onLaunch: function() {
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // if (wx.getStorageSync('sessionId')){
    //   let header = {};
    //   header.Cookie = 'JSESSIONID=' + wx.getStorageSync('sessionId');
    //   this.header = header;
    // }
    wx.setStorage({
      key: 'cache',
      data: '',
    })
    this.login();
    if (wx.getSystemInfoSync().model.search('iPhone X') > -1) {
      this.iphoneX = true
    }
  },
  iphoneX: false,
  onShow() {
    console.log('app onshow')
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function() {
      wx.showModal({
        title: '更新提示',
        content: '新版本已准备好，是否重启应用？',
        success: function(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function() {
      // 新的版本下载失败
    })
  },
  //登录1
  login: function() {
    var _this = this;
    wx.login({
      success: res => {
        if (res.code) {
          _this.getOpenId(res.code)
        }
      }
    })
  },

  //获取用户信息3
  getUserInfo: function() {
    var _this = this;
    // 获取用户授权情况  authSetting授权信息
    wx.getSetting({
      success: (res) => {
        if (Object.values(res.authSetting).length == "0") {
          wx.getUserInfo({
            success: function(res2) {
              _this.setUserInfo(res2.rawData)
            },
            fail: function() {
              // wx.switchTab({
              //   url: '/pages/img/img'
              // })
            }
          });
        } else {
          if (res.authSetting["scope.userInfo"] == true) {
            wx.getUserInfo({
              success: function(res2) {
                _this.setUserInfo(res2.rawData)
              },
              fail: function() {
                // wx.switchTab({
                //   url: '/pages/img/img'
                // })
              }
            });
          } else {
            wx.openSetting({
              success: (res) => {
                if (res.authSetting["scope.userInfo"] == true) {
                  wx.getUserInfo({
                    success: function(res2) {
                      _this.setUserInfo(res2.rawData)
                    },
                    fail: function() {
                      wx.switchTab({
                        url: '/pages/img/img'
                      })
                    }
                  });
                } else {
                  wx.switchTab({
                    url: '/pages/img/img',
                  })
                }
              },
              fail: (res) => {

              }
            })
          }
        }

      }
    })
  },
  //设置缓存4
  setUserInfo: function(userInfo, fn) {
    wx.setStorage({
      key: "userInfo",
      data: userInfo
    })
    let userData = JSON.parse(userInfo)
    this.userInfo = userData;
    // 如果有传回调则执行
    fn && fn()
  },

  //获取openid-2
  getOpenId: function(code) {
    var _this = this;
    let url = this.domain2 + 'getOpenId';
    wx.request({
      url: url,
      data: {
        code: code
      },
      success: function(res) {
        if (res.statusCode == 200) {
          if (res.data.code == 0) {
            let header = {
              "Content-Type": "application/x-www-form-urlencoded"
            };
            header.Cookie = 'JSESSIONID=' + res.data.data.sessionId;
            _this.header = header;
            wx.setStorage({
              key: "sessionId",
              data: header,
            });
            if (res.data.data.isLogin) {
              _this.loginStatus = true;
              _this.getMemberData()
            } else {
              _this.loginStatus = false;
            }
          }
        }
      }
    });
  },
  // 获取用户信息
  getMemberData() {
    util.http({
      url: this.domain2 + 'app/session/getMemberData',
      headers: 1,
      method: 'post'
    }).then(ret => {
      if (ret && ret.code == 0) {
        let {
          data
        } = ret
        this.memberData = data
        let userInfo = {
          avatarUrl: data.portrait,
          nickName: data.user_name,
          sex: 0,
        }
        wx.setStorageSync('userId', data.user_id)
        wx.setStorageSync('user_rank', data.user_rank)
        this.setUserInfo(JSON.stringify(userInfo))
      }
    })
  },
  islogin: function(thiss = this) {
    var _this = this;
    var url = this.domain2 + 'app/validate';
    // return false;
    if (wx.getStorageSync('memberId')) {
      wx.request({
        url: url,
        header: wx.getStorageSync('memberId'),
        data: {},
        success: function(res) {
          if (res.statusCode == 200) {
            if (res.data.code == 0) {
              if (res.data.data.isLogin) {
                thiss.loginStatus = true;
                getApp().loginStatus = true;
              } else {
                thiss.loginStatus = false;
                getApp().loginStatus = false;
              }
            } else {}
          }
        }
      });
    }
  },
  checkLogin: function() {
    if (!this.loginStatus) {
      wx.navigateTo({
        url: '/pages/public/login/login',
      })
      return false
    }
  },
  memberData: '',
  userInfo: {
    avatarUrl: null,
    nickName: null,
    sex: 0,
  },
  loginStatus: false,
  worksShow: [],
  tagPage: 'img/img', //上传页面推出标记
  imgType: {
    id: '',
    name: '全部',
  },

  arrId: [], //列表Id
  domain: 'https://u.91sjyx.com/index.php/Home/Test/',
  domain1: 'https://wx.91sjyx.com/sunnet_flb/',
  domain2: 'https://v2.91sjyx.com/sunnet_flb/',
  // domain2: 'https://wx.91sjyx.com/sunnet_flb/',
  // domain2: 'http://v3.91sjyx.com:8080/',     // 测试
  test: 'https://u.91sjyx.com/index.php/home/test/',
  globalData: {},
  cloudAlbum: {
    all: 'http://image.91sjyx.com/sjyx/Icon/all.png',
    match: 'http://image.91sjyx.com/sjyx/Icon/match.png',
    video: 'http://image.91sjyx.com/sjyx/Icon/video.png',
    ispublic: 'http://image.91sjyx.com/sjyx/Icon/public.png',
    nopublic: 'http://image.91sjyx.com/sjyx/Icon/nopublic.png',
    del: 'http://image.91sjyx.com/sjyx/Icon/del.png',
    defaultImg: 'http://image.91sjyx.com/sjyx/Icon/defaultalbum.jpg',
    worksShow: 'http://image.91sjyx.com/sjyx/Icon/worksShow.jpg',
    defaultbackground: 'http://image.91sjyx.com/sjyx/Icon/defaultalbum.jpg',
  },
  worksData: '', // 新建图文时暂时保存的数据
  showLoading: function(str) {
    wx.showLoading({
      title: str ? str : '保存中....',
      mask: true,
    })
  },
  // 正式
  imgHolder: 'http://image.91sjyx.com/2019-10-16/1571192029040EIXU2w.png',
  idHolder: '1571192029040EIXU2w',
  // 测试
  // imgHolder: 'http://image.91sjyx.com/2019-10-16/1571191958532NAZ75w.png',
  // idHolder: '1571191958532NAZ75w',

  // 检查有没有包含占位的图片
  checkHolder: function(arrs) {
    let arr = arrs
    if (arr) {
      arr.forEach(i => {
        if (i.image.split('?')[0] == this.imgHolder) {
          i.image = ''
        }
      })
    }
    return arr
  },
  
})