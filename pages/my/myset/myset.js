Page({
  /**
   * 页面的初始数据
   */
  data: {
    userProtocolUrl:'https://i.91sjyx.com/contractus.jsp', //用户协议
    aboutUrl:'https://i.91sjyx.com/content/gywm.jsp',  //关于我们
    helpUrl:'https://mp.weixin.qq.com/s/01VTGGs9o3lr4ehpD3-5fg', //帮助中心
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '设置'
    });
  },
  onfeedback:function(){
    wx.navigateTo({
      url: './feedback/feedback?memberId=' + this.data.memberId,
    })
  },
  userInfo:function(){
    wx.navigateTo({
      url: 'personalData/personalData?memberId=' + this.data.memberId,
    })
  },

  //用户协议
  ondata:function(){
    wx,wx.navigateTo({
      url: 'data/data?dataUrl=' + this.data.userProtocolUrl,
    })
  },
  //关于我们
  onabout:function(){
    wx.navigateTo({
      url: 'data/data?dataUrl=' + this.data.aboutUrl,
    })
  },
  onhelp:function(){
    wx.navigateTo({
      url: 'data/data?dataUrl=' + this.data.helpUrl,
    })
  },
  changeUser:function(){
    wx.navigateTo({
      url: '/pages/public/changeUser/changeUser',
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
  // onShareAppMessage: function () {
    
  // }
})