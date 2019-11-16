// pages/my/wallet/wallet.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myWalletUrl:'app/session/myWallet',
    walletData:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的钱包'
    });
    //this.getwallet();
  },

  getwallet:function(){
    var _this = this;
    let url = getApp().domain2 + this.data.myWalletUrl;
    wx.request({
      url: url,
      method: "POST",
      dataType: "json",
      data: {},
      header: getApp().header,
      success: function (res) {
        if (res.data.code == 200) {
          _this.setData({
            walletData: res.data.result
          })
        }else{
          _this.Prompt(res.data.message);
        }

      }
    })
  },



  onlist:function(e){
    var code = e.currentTarget.dataset.code;
    wx.navigateTo({
      url: '/pages/my/wallet/payList/payList?code='+ code,
    })
  },
  onrecharge:function(){
    wx.navigateTo({
      url: '/pages/my/wallet/recharge/recharge',
    })
  },

  //弹窗提示
  Prompt: function (content) {
    wx.showToast({
      title: content,
      icon: 'none',
      duration: 2000
    });
  },


  oncash:function(){
    wx.navigateTo({
      url: '/pages/my/wallet/explain/explain',
    })
    //this.Prompt('提现功能请前往APP操作')
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getwallet();
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})