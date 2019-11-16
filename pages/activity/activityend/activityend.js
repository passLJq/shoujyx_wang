var imglist = require('../../../utils/imglist.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityUrl: "app/getMatchList",
    page: 0,
    matchList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    imglist.getSystemInfo(this);
    this.loadImages();
    wx.setNavigationBarTitle({
      title: '历史活动'
    });
    // let imgType = {
    //   id: '',
    //   name: '全部'
    // }
    // getApp().imgType = imgType;
  },
  loadImages: function () {
    let url = app.domain2 + this.data.activityUrl;
    imglist.activity(url,2, this);
  },
  onmatch: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: './matchdetail/matchdetail?matchId=' + id,
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