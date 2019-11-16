const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getWorksInfoUrl: 'app/session/getWorksInfo',
    changeWorksInfoUrl:'app/session/changeWorksInfo',
    data: [],
    ispublic:0,
    albumData:'',
    categoryData:''
    
  },

  onLoad: function (options) {
    var imgId = options.imgId;
    this.setData({
      imgId:imgId
    })
    this.getWorksInfo();
  },
  //标题
  blur:function(e){
    this.setData({
      title: e.detail.value
    })
  },
  //标签
  onlabel: function (e) {
    this.setData({
      label:e.detail.value
    })
  },
  describe: function (e){
    this.setData({
      describe:e.detail.value
    })
  },
  selectKeyword: function (e) {
    var data = e.currentTarget.dataset;
    console.log(data)
    switch (data.type) {
      case 'category':
        this.setData({
          category: false,
          type_name:data.name,
          type_id: data.id
        })
        break;
      case 'album':
        this.setData({
          album: false,
          album_name:data.name,
          album_id: data.id
        })
        break;
    }
  },
  //分类
  oncategory:function(){
    this.setData({
      category:true
    })
  },
  //相册
  onalbum:function(){
    this.setData({
      album: true
    })
  },
  //是否公开
  radioChange: function (e) {
    this.setData({
      ispublic: e.detail.value
    })
  },
  //取消
  oncancel:function(){
    wx.navigateBack({
      delta: 1
    })
  },

  message: function (msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 2000
    })
  },

  //保存
  onSubmit:function(){
    let url = app.domain2 +  this.data.changeWorksInfoUrl;
     let data=[];
     let title = this.data.title;
     title = title.replace(/^\s+|\s+$/g, "");
     if (!title) {
       this.message('标题不能为空');
       return false;
     }
     data.title = title;
     data.imgId = this.data.imgId;
     data.desc = this.data.desc;
     data.label = this.data.label;
     data.ispublic = this.data.ispublic;
     data.albumId = this.data.album_id;
     data.categoryId = this.data.type_id;
     wx.request({
       url: url,
       data: data,
       header:getApp().header,
       success: function (res) {
         if (res.data.code == 0){
            wx.showToast({
              title: '修改成功',
              icon: 'none',
              duration: 2000
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 2000)
         }
       }
     })

  },
  //描述
  descblur:function(e){
    this.setData({
      desc: e.detail.value,
    })
  },
  //获取图片详情
  getWorksInfo: function () {
    var thiss = this;
    var url = app.domain2 + this.data.getWorksInfoUrl;
    var data = {imgId: this.data.imgId }
    wx.request({
      url: url,
      data: data,
      header:getApp().header,
      success: function (res) {
        if (res.data.code == 0) {
          if (res.data.data.ispublic){
            thiss.setData({
              ispublic:1
            })
          }
          thiss.setData({
            data: res.data.data,
            title: res.data.data.doc_title,
            desc: res.data.data.describe,
            label: res.data.data.label,
            type_name: res.data.data.type_name,
            album_name: res.data.data.album_name,
            type_id: res.data.data.type_id,
            album_id: res.data.data.album_id
          });
          wx.setNavigationBarTitle({
            title: res.data.data.doc_title
          });
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
  
  }
})