var imglist = require('../../../../../utils/imglist.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    switchval:-1,
    show: 1,
    page: 0,
    getCloudBaseWorksListUrl: 'app/session/getCloudBaseWorksList',
    changeBackgroundUrl:'app/session/changeBackground',
    dataList: [],
    images: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    imglist.getSystemInfo(this)
    this.setData({
      albumId: options.albumId
    })
    this.getCloudBaseWorksList();

    wx.setNavigationBarTitle({
      title: '图片选择'
    });
  },




  selectImg:function(e){
    let index = e.currentTarget.dataset.id;
    let val = e.currentTarget.dataset.val;
    let img = e.currentTarget.dataset.img;
    let switchval = this.data.switchval;
    this.setData({
      switchval: index,
      backgroundImg: img
    })
    let dataList = this.data.dataList;
    dataList[index].val = true
    if (switchval >= 0){
      dataList[switchval].val = false;
    }
    this.setData({
      dataList: dataList,
      imgId: val
    })
  },
  submit:function(){
    var _this = this;
    var url = app.domain2 + this.data.changeBackgroundUrl;
    var data = { imgId: this.data.imgId}
    wx.request({
      url: url,
      data: data,
      header:getApp().header,
      success: function (res) {
        if (res.data.code == 0) {
          getApp().changeBackground = _this.data.backgroundImg;
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },

  //图片加载
  imageLoad: function (e) {
    let imgW = e.detail.width,
      imgH = e.detail.height,
      ratio = imgW / imgH;
    var viewWidth = 710,
      viewHeight = 710 / ratio;
    var image = this.data.images;
    image[e.currentTarget.dataset.index] = {
      width: viewWidth,
      height: viewHeight
    }
    this.setData({
      images: image
    })
  },
  //设置云库产品列表
  cloudBaseWorksList: function (data) {
    let dataList = this.data.dataList;
    for (var i = 0; i < data.data.length; i++) {
      dataList.push(data.data[i])
    }
    this.setData({
      dataList: dataList
    })
    // console.log(dataList)
  },

  //获取云库产品列表
  getCloudBaseWorksList: function () {
    var thiss = this;
    var url = app.domain2 + this.data.getCloudBaseWorksListUrl;
    var page = this.data.page + 1;
    var data = {page: page, albumId: 1 }
    wx.request({
      url: url,
      data: data,
      header:getApp().header,
      success: function (res) {

        if (res.data.code == 0) {

          thiss.cloudBaseWorksList(res.data.data)
          thiss.setData({
            page: page,
            img_count: res.data.data.img_count
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
  onShareAppMessage: function () {

  }
})