// pages/my/wallet/explain/explain.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '提现说明'
    });
  },

  baocun: function (e) {
    wx.showModal({
      title: '提示',
      content: '保存图片到相册 ？',
      success: function (res) {
        if (res.confirm) {
          wx.getImageInfo({
            src: '/images/wxDown.png',
            success: function (res) {
              console.log(res);
              var path = res.path;
              wx.saveImageToPhotosAlbum({
                filePath: path,
              })
            }
          });
        } else if (res.cancel) {
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