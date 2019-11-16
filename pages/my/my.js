var verify = require('../../pages/public/verify/verify.js');
const util = require('../../utils/util.js')
const app = getApp();
Page({
  data: {
    getMemberDataUrl:'app/session/getMemberData',
    info:'',
    isLogin: false,
    stars: [0,0,0,0,0],    // 星星
    showDia: 0,            // 授权提示弹窗
  },

  onLoad: function (options) {
    // if (!getApp().loginStatus) {
    //   wx.navigateTo({
    //     url: '/pages/public/login/login',
    //   })
    // }
    
    console.log('tab会不会切换')
    let id = options.id;
    var thiss = this;
    wx.setNavigationBarTitle({
      title: '我的'
    });
    
    let url = app.domain2 + this.data.getMemberDataUrl
    this.query(url)

    let imgType = {
      id: '',
      name: '全部'
    }
    getApp().imgType = imgType;

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
    this.setData({stars:array});
  },
  //请求数据
  query: function (url,data) {
    console.log(url, data)
    let thiss = this;
    util.http({
      url: url,
      method: 'POST',
      data: data,
      headers: 1
    }).then(res => {
      console.log(res)
      if (res.code == 0) {
        this.stars(res.data.user_rank);
        res.data.background = res.data.background ? res.data.background : getApp().cloudAlbum.defaultbackground;
        thiss.setData({
          info: res.data
        })
        wx.setStorageSync("userId", res.data.user_id)
        wx.setStorageSync("memberId", res.data.user_id)
      }
    })
  },
  // 关闭授权弹窗
  closeDia() {
    this.setData({
      showDia: 0
    })
  },
  goLogin() {
    wx.navigateTo({
      url: '/pages/public/login/login'
    })
  },
  //我的收藏
  mycollection:function(){
    // 没有收藏则阻止
    if (this.data.info.total_collect_num <= 0) return
    wx.navigateTo({
      url: 'collection/collection',
    })
  },
  //设置
  onsset:function(){
    wx.navigateTo({
      url: './myset/myset?memberId=' + this.data.memberId,
    })
  },
  onmessage:function(){
    wx.navigateTo({
      url: 'message/message?memberId='+this.data.memberId,
    })
  },
  onreward:function(){
    console.log('我的打赏列表')
  },
  onUserList:function(e){
    var code = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/my/myUserList/myUserList?code=' + code
    })
  },
  onCollectionImg:function(e){
    let fileType = e.currentTarget.dataset.type;
      wx.navigateTo({
        url: '/pages/pictureDetails/pictureDetails' + '?imgId=' + e.currentTarget.dataset.id + '&fileType=' + fileType,
      })
  },
  onMycloud:function(){
    wx.navigateTo({
      url: 'cloudBase/cloudBase',
    })
  },
  worksShow:function(e){
    let code = e.currentTarget.dataset.code;
    wx.navigateTo({
      url: '/pages/worksShow/myShowList/myShowList?code='+code,
    })

  },
  onwallet:function(){
    wx.navigateTo({
      url: '/pages/my/wallet/wallet'
    })
  },

  onwallet1: function () {
    wx.navigateTo({
      url: '/pages/worksShow/worksList/worksList',
    })
  },
  //我的贺卡
  // myCare:function(){
  //   wx.navigateToMiniProgram({
  //     appId: 'wxc50118176f4a9525',
  //     path: 'pages/index/index',
  //     // extraData: {
  //     //   foo: 'bar'
  //     // },
  //     // envVersion: 'develop',
  //     success(res) {
  //       // 打开成功
  //     }
  //   })
  // },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() 
    this.setData({
      istype: 0,
      page: 1,
    });
    let url = app.domain2 + this.data.getMemberDataUrl;
    this.query(url);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
    
  },

  onPullDownRefresh() {
    var self = this;
    wx.showNavigationBarLoading();
    let url = app.domain2 + 'app/session/getMemberData';
    this.query(url);
    setTimeout(() => {
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading()
    }, 1000);
  },

  // aa:function(){
  //   wx.navigateTo({
  //     url: '/pages/worksShow/myShowList/myShowList?code=1',
  //   })
  // },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
    
  // },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    getApp().tagPage = 'my/my';
    // if (!getApp().loginStatus){
    //   wx.navigateTo({
    //     url: '/pages/public/login/login',
    //   })
    // }
    if (app.loginStatus) {
      let url = app.domain2 + this.data.getMemberDataUrl
      this.query(url)
    }
    this.setData({
      isLogin: getApp().loginStatus
    })
  },

  // //手机号码绑定
  // message: function (message) {
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



  // changeLoginStatus: function () {
  //   let url = app.domain2 + this.data.getMemberDataUrl;
  //   this.query(url);
  //   this.setData({
  //     loginStatus: getApp().loginStatus
  //   })
  // },
  // //确认
  // verifyConfirm: function () {
  //   verify.verifyConfirm(this, this.changeLoginStatus())
  // }






})