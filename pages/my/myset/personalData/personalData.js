const app = getApp();
const util = require("../../../..//utils/util.js");
Page({
    data: {
        indicatorDots: true,
        autoplay: true,
        interval: 1000,
        duration: true,
        getMemberUrl: "app/session/getMemberInfo", //关注列表url
    },
    onLoad: function (options) {
      
    },
    getMemberAjax: function() {
        var thiss = this;
        wx.request({
            url: app.domain2 + this.data.getMemberUrl,
            data: {},
            header:getApp().header,
            success: function(res) {
              if(res.data.code==0){
                thiss.setData({
                  userInfo: res.data.data,
                  grade:res.data.data.user_rank
                })
              }
            }
        });
    },
    onPullDownRefresh() {
      var self = this;
      wx.showNavigationBarLoading();
      setTimeout(() => {
        this.getMemberAjax();
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading()
      }, 1000);
    },

    //上拉触底监听
    onReachBottom: function() {

    },
    /**
     * 生命周期函数--监听页面显示
    */
    onShow: function () {
      this.getMemberAjax();
    },

});