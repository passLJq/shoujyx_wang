var imglist = require('../../../utils/imglist.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:1,
    page:0,
    worksShowListUrl:'worksShowList',
    worksData:[],
    musicSrc: '',
    musicData: {
      id: '',
      name: '',
      status: 0,
      index: 0
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    imglist.getSystemInfo(this);
    this.getWorkList();
    
  },

  onSwitch:function(e){
    this.setData({
      code: e.currentTarget.dataset.code,
      page:0
    })
    this.getWorkList();
  },


  worksShowList:function(){
    var _this = this;
    let page = this.data.page;
    let code = this.data.code;
    page++;
    this.setData({
      page: page
    })
    let url = getApp().test + this.data.worksShowListUrl;
    wx.request({
      url: url,
      header: getApp().header,
      data: { code: code, page: page },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 0) {
            let data = res.data.data;
            let worksData = _this.data.worksData;
            for (var i in data){
              worksData.push(data[i])
            }
            _this.setData({
              worksData: worksData
            })
          }
        }
      }
    });
  },

  // 获取作品列表
  getWorkList:function(){
    var _this = this;
    let page = this.data.page;
    let code = this.data.code;
    page++;
    this.setData({
      page:page
    })
    let url = getApp().test + this.data.worksShowListUrl;
    wx.request({
      url: url,
      header: getApp().header,
      data: { code: code,page:page},
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 0) {
              _this.setData({
                worksData:res.data.data
              })
          }
        }
      }
    });
  },

  //影展预览
  worksPreview:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/worksShow/worksPreview/worksPreview?id=' + id,
    })
  },



  //进入影展详情页面
  worksImg:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/worksShow/worksDetails/worksDetails?id=' + id,
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