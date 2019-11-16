const app = getApp();
Page({
  data: {
    getWorksInfoUrl:'app/session/getWorksInfo', //获取作品信息
    delImgUrl:'app/session/delImg', //删除图片 

    data:[]
  },

  onLoad: function (options) {
    this.setData({
      imgId: options.imgId,
      albumId: options.albumId,
    })
    this.getWorksInfo();
  },


  //是否删除
  isrm: function () {
    var albumId = this.data.albumId;
    var ismatch = this.data.data.isMatch;
    var obj = { '-2': '参赛作品'};
    for (var i in obj) {
      if (i == albumId || ismatch == 1) {
        return obj[i] + '不能删除';
      }
    }
    return false;
  },



  messageInfo: function (message){
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    })
  },

  //提示
  message: function (message,num){
    this.messageInfo(message);
    setTimeout(function () {
      wx.navigateBack({
        delta: num
      })
    }, 2000)
  },
  //请求数据
  query:function(url,data,backNum,message){
    let thiss = this;
    wx.request({
      url: url,
      data: data,
      header:getApp().header,
      success: function (res) {
        if (res.data.msg == 'success') {
          thiss.message(message, backNum);
        }
      }
    })
  },

  //删除
  onrm: function () {
    var message = this.isrm()
    if (message) {
      this.messageInfo(message)
      return false;
    }
    let thiss = this;
    let url = app.domain2 + this.data.delImgUrl;
    let data = [];
    data.imgId = this.data.imgId;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          thiss.query(url, data, 1, '删除成功');
        } else if (sm.cancel) {
          
        }
      }
    })
  },

  //获取图片详情
  getWorksInfo: function () {
    var thiss = this;
    var url = app.domain2 + this.data.getWorksInfoUrl;
    var data = {imgId:this.data.imgId}
    wx.request({
      url: url,
      data: data,
      header: getApp().header,
      success: function (res) {
        if (res.data.code = "0") {
          wx.setNavigationBarTitle({
            title: res.data.data.doc_title
          });
          thiss.setData({
            data: res.data.data,
            iheight: res.data.data.iheight / res.data.data.iwidht * 750
          })
        }

      }
    })
  },





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
    return {
      title: this.data.data.doc_title,
      path: '/pages/pictureDetails/pictureDetails?imgId=' + this.data.data.doc_id,
      desc: this.data.data.describe,
      success: function (res) {
      }
    }
  }
})