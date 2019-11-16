// pages/my/wallet/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'app/session/moneyDetail'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '订单详情'
    });
    this.setData({
      id: options.pid,
      payType: options.payType
    })
    this.getDetail();
  },
  //弹窗提示
  Prompt: function (content) {
    wx.showToast({
      title: content,
      icon: 'none',
      duration: 2000
    });
  },
  //获取数据
  getDetail: function () {
    let id = this.data.id;
    let code = this.data.payType;
    var _this = this;
    let url = getApp().domain2 + this.data.url;
    wx.request({
      url: url,
      method: "POST",
      dataType: "json",
      data: { operationType: code,id:id},
      header: getApp().header,
      success: function (res) {
        if (res.data.code == 0) {
          _this.setData({
            moneyData:res.data.data
          })

        } else {
          _this.Prompt(res.data.message);
        }
      }
    })
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