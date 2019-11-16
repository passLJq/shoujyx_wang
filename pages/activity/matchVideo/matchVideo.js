var imglist = require('../../../utils/imglist.js');
var util = require('../../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: 0,
    images: [],
    col1: [],       // 左边的图片数组
    col2: [],       // 右边的图片数组
    col1H: 0,        // 左边图片列表的高度
    col2H: 0,        // 右边列表的高度
    page: 0,         // 上拉加载的页数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '摄影短视频征集',
    })
    imglist.getSystemInfo(this)
    this.loadImages()
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
  reload() {
    this.setData({
      images: [],
      col1: [],
      col2: [],
      col1H: 0,
      col2H: 0,
      page: 0,
    })
    this.loadImages()
  },
  // 加载更多
  bindData() {
    console.log(11)
  },
  goupload() {
    wx.navigateTo({
      url: '/pages/upload/upload?type=2',
    })
  },
  //加载
  loadImages: function () {
    this.setData({
      page: this.data.page + 1,
    }, () => {
      var data = {
        page: this.data.page,
        imgType: -1
      }

      var thiss = this;
      var url = app.domain2 + 'getWorksList?workType=abcd';
      // var url = app.domain2 + 'getWorksList';
      imglist.query(url, data, this.back);
    })
    
  },
  back: function (data) {
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
    console.log(data)
    var loaddata = imglist.loadImages(data.data, this)
  },
  changesTab(e) {
    this.setData({
      tabs: e.currentTarget.dataset.type
    })
  },
  //点击事件
  onimg: function (e) {
    // let isDouble = e.currentTarget.dataset.group;
    var imgid = e.currentTarget.dataset.imgid;
    var docType = e.currentTarget.dataset.code;

    // if (isDouble == 1){
    //   wx.navigateTo({
    //     url: '/pages/groupDetail/groupDetail?imgId=' + imgid + '&fileType=' + docType,
    //   })
    //   return false;
    // }
    wx.navigateTo({
      url: '/pages/pictureDetails/pictureDetails?imgId=' + imgid + '&fileType=' + docType,
    })
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
    this.reload()
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