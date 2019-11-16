const app = getApp();
var imglist = require('../../utils/imglist.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:0,
    matchList:[],
    activityUrl:"getMatchList",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    imglist.getSystemInfo(this);
    this.loadImages();
    wx.setNavigationBarTitle({
      title: '当前活动'
    });
  },
  loadImages:function(){
    let url = app.domain2 + this.data.activityUrl;
    imglist.activity(url,1,this);
  },
  history:function(){
    wx.navigateTo({
      url: './activityend/activityend'
    })
  },
  onmatch: function (event){
    var id = event.currentTarget.dataset.id;
    var status = event.currentTarget.dataset.status;
    // if (status==1){
    //     wx.navigateTo({
    //       url: '/pages/activity/examine/matchdetail/matchdetail?matchId=' + id,
          
    //     })
    // } else if (status == 2){
    //     wx.navigateTo({
    //       url: '/pages/activity/activityend/matchdetail/matchdetail?matchId=' + id,
    //     })
    // }else{
    //   wx.navigateTo({
    //     url: '/pages/activity/matchdetail/matchdetail?id=' + id,
    //     // url: '/pages/activity/activityend/matchdetail/matchdetail?matchId=' + id,
    //   })
    // }
    wx.navigateTo({
      url: '/pages/activity/matchdetail/matchdetail?matchId=' + id + '&status=' + status,
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
    getApp().tagPage = 'activity/activity';
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
    getApp().tagPage = 'activity/activity';
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