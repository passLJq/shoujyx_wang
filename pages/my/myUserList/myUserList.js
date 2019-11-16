var imglist = require('../../../utils/imglist.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myUserListUrl:'app/session/myUserList',
    changeFollowStatusUrl:'app/session/changeFollowStatus',
    data:[],
    page:0,
    isempty:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userId = options.userId;
    if (userId == undefined){
      userId = '';
    }
    let docId = options.docId;
    if (docId == undefined){
      docId:'';
    }
    let worksShowId = options.worksShowId;
    if (worksShowId == undefined) {
      worksShowId: '';
    }

    imglist.getSystemInfo(this);
    switch (options.code){
      case '1':
        var title = '粉丝';
        var message = '您还没有粉丝，继续努力吧';
        break;
      case '2':
        var title='赏客';
        var message = '您还没有赏客，继续努力吧！';
        break;
      case '3':
        var title ='关注';
        var message = '您还没有关注的人，去添加你的人脉吧';
        break;
      case '4':
        var title = '点赞';
        var message = '该图片还没有点赞的人， 继续努力吧';
        break;
    }
    wx.setNavigationBarTitle({
      title: title
    });
    this.setData({
      message:message,
      userId: userId,
      docId: docId,
      code: options.code,
      worksShowId: options.worksShowId,
    })
    this.loadUser();

  },
  
  result:function(){
    wx.navigateBack({
      delta: 1
    })
  },

  loadUser: function () {
    let code = this.data.code;
    let page = this.data.page + 1 ;
    let userId = this.data.userId;
    let worksShowId = this.data.worksShowId;
    var url = app.domain2 + this.data.myUserListUrl;
    let docId = this.data.docId;
    if (docId){
      this.query(url, { code: code, page: page, docId: docId });
      return false;
    }else if(worksShowId){
      this.query(url, { code: code, page: page, docId: worksShowId });
      return false;
    }
    this.query(url, { code: code, page: page, userId:userId});
  },
  //转换等级
  list:function(data){
    var listData = this.data.data;
    for (var i = 0; i < data.length;i++){
      data[i].user_rank = this.stars(data[i].user_rank);
      listData.push(data[i])
    }

    this.setData({
      data: listData,
      isempty: listData.length
    })
  },
  //获取数据
  query: function (url, data) {
    let thiss = this;
    wx.request({
      url: url,
      data: data,
      header: getApp().header,
      success: function (res) {
        if (res.data.code = "0") {
          thiss.list(res.data.data);
          thiss.setData({
            page:data.page
          })
        }

      }
    })
  },
  onList:function(e){
    var userId = e.currentTarget.dataset.userid;
    //redirectTo
    wx.navigateTo ({
      url: '/pages/userhome/userhome' + '?userId=' + userId ,
    })
  },
  //转换等级计算
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
    return array;
  },
  changeFollow: function (e) {
    var  thiss = this;
    var userId = e.currentTarget.dataset.userid;
    var key = e.currentTarget.dataset.key;
    var status = e.currentTarget.dataset.status;
    var data = this.data.data;
    status = status?0:1;
    let url =  app.domain2 + this.data.changeFollowStatusUrl;
    wx.request({
      url: url,
      data: { userId: userId, memberId: 'memberId', code: status},
      header:getApp().header,
      success: function (res) {
        if (res.data.code == 0) {
          data[key].isfollow = status;
          console.log(res.data.data.follow_status)
          thiss.setData({
            data: data
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
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
  // onShareAppMessage: function () {
    
  // }
})