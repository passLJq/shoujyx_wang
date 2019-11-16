// pages/main/main.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: "",
    viewHeight: 0,
    viewWidth: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let imgSrc = options.img;
    let title = options.title;
    let viewWidth = options.w;
    let viewHeight = options.h;

    this.setData({
      imgSrc: imgSrc,
      viewWidth: viewWidth,
      viewHeight: viewHeight

    })
    wx.setNavigationBarTitle({
      title: title
    })
  },

})