// pages/my/wallet/payList/payList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:1,
    listData:[],
    payListUrl:'app/session/capitalDetail',
    page:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      item: options.code
    })
    wx.setNavigationBarTitle({
      title: '明细'
    });
    this.getPayList();
  },

  //合并数据
  list:function(data){
    var listData = this.data.listData;
    for(var i=0; i<data.length;i++){
      listData.push(data[i]);
    }
    this.setData({
      listData: listData
    })
  },

  //获取数据
  getPayList: function () {
    let item = this.data.item;
    let page = this.data.page;
    page++;
    var _this = this;
    let url = getApp().domain2 + this.data.payListUrl;
    wx.request({
      url: url,
      method: "POST",
      dataType: "json",
      data: { operationType: item,page:page},
      header: getApp().header,
      success: function (res) {
        if (res.data.code == 0) {
          _this.list(res.data.data)
          _this.setData({
            page:page
          })

        } else {
          _this.Prompt(res.data.message);
        }
      }
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

  item:function(e){
    this.setData({
      item: e.currentTarget.dataset.code,
      listData:[],
      page:0
    });
    this.getPayList();
  },

  ondetail:function(e){
    var pid = e.currentTarget.dataset.pid;
    var item = this.data.item;
    wx.navigateTo({
      url: '/pages/my/wallet/detail/detail?pid=' + pid + '&payType=' + item,
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
    this.getPayList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})