var imglist = require('../../../utils/imglist.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageListUrl:'app/session/messageList',
    systemMessageListUrl:'app/session/systemMessageList',
    onnum: 1,
    page:0,
    messageList:[]
  },

  onLoad: function (options) {
    imglist.getSystemInfo(this);
    wx.setNavigationBarTitle({
      title: '我的消息'
    });
    this.loadMessage();
  },

  //获取消息列表
  getData:function(url){
    var thiss = this;
    var page = this.data.page +1;
    var memberId = 'memberid';
    wx.request({
      url: url,
      data: {page:page},
      header:getApp().header,
      success: function (res) {
        if (res.data.code = "0") {
          thiss.messageSet(res.data.data, page);
          thiss.setData({ page: page})
        }
      }
    })
  },
  //加载系统消息
  loadSystemMessage:function(){
    let url = getApp().domain2 + this.data.systemMessageListUrl;
    this.getData(url);
  },


  //加载消息
  loadMessage:function(){
    if(this.data.onnum==1){
      var url = app.domain2 + this.data.messageListUrl;
    }else{
      var url = app.domain2 + this.data.systemMessageListUrl;
    }

    this.getData(url)
  },
  messageSet:function(data){
    let messageList = this.data.messageList;
    if (data) {
      for (var i = 0; i < data.length; i++) {
        messageList.push(data[i]);
      }
      this.setData({
        messageList: messageList
      })
    }
  },
  //系统消息事件
  onmessage:function(e){
   var time =  e.currentTarget.dataset.time;
   var msg = e.currentTarget.dataset.msg;
    wx.navigateTo({
      url: '/pages/my/message/messageDetail/messageDetail?msg='+ msg+'&time='+time,
    })  
  },

  //点击图片
  onuser:function(e){
    var userId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/userhome/userhome?userId=' + userId
    })
  },
  //点击作品
  onworks:function(e){
    var imgId = e.currentTarget.dataset.id;
    var worksType = e.currentTarget.dataset.type;
    if (worksType > 5){
      wx.navigateTo({
        url: '/pages/worksShow/worksDetails/worksDetails?id=' + imgId
      })
    }else{
      wx.navigateTo({
        url: '/pages/pictureDetails/pictureDetails?imgId=' + imgId
      })
    }
  },


  onType: function (e) {
    this.setData({
      onnum: e.currentTarget.dataset.code,
      page: 0,
      istype: 0,
      messageList:[]
    });
    this.loadMessage();


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