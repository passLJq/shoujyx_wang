const app = getApp();
Page({
  data: {
    getCloudBaseListUrl:'app/session/getCloudBaseList',
    addphotoAlbumUrl:'app/session/addphotoAlbum',
    defaultAlbumImg:'http://image.91sjyx.com/sjyx/img/114.jpg?x-oss-process=image/resize,h_240',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCloudBaseList();
    this.setData({
      cloudAlbum: getApp().cloudAlbum
    })
    wx.setNavigationBarTitle({
      title: '我的云库'
    });
  },

  getCloudBaseList:function(){
    var thiss = this;
    var url = app.domain2 + this.data.getCloudBaseListUrl;
    var data = {}
      wx.request({
        url: url,
        data: data,
        header:getApp().header,
        success: function (res) {
          if (res.data.code = "0") {
            thiss.setData({
              albumList:res.data.data
            })
          }

        }
      })
  },
  //上传
  upload:function(){
    wx.switchTab({
      url: '/pages/uploadHome/uploadHome',
    })
  },
  upgrade:function(){
    console.log('升级容量')
  },
  //新建
  addAlbum:function(){
    this.setData({
      newAlbum:true
    })
  },
  //取消
  albumCancel:function(){
    this.setData({
      newAlbum: false,
      newAlbumName:''
    })
  },
  
  worksShow:function(){

  },

  //回收站
  recovery:function(e){
    var albumId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'recovery/recovery?albumId=' + albumId,
    })
  },

  //相册添加
  albumAdd:function(){
    var thiss = this;
    var newAlbumName = this.data.newAlbumName;
    if (!newAlbumName){
      wx.showToast({
        title: '相册名称不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    var url = app.domain2 + this.data.addphotoAlbumUrl;
    var data=[];
    data.albumName = this.data.newAlbumName;
    wx.request({
      url: url,
      data: data,
      header:getApp().header,
      success: function (res) {
        if (res.data.code == '0') {
          console.log('aaaaaa')
            let albumList = thiss.data.albumList;
            let temp = { album_id: res.data.data.id, album_name: data.albumName, background_img: '', img_num:0} 
            albumList.personal.push(temp);
            thiss.setData({
              albumList: albumList,
              newAlbum: false,
              newAlbumName: ''
            })
        }
      }
    })


  },
  albumBlur:function(e){
    this.setData({
      newAlbumName: e.detail.value
    })
  },

  //进入影展列表
  worksShow:function(e){
    var albumId = e.currentTarget.dataset.id;
    var title = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: 'worksShow/worksShow?albumId=' + albumId + '&title=' + title,
    })
  },

  //进入相册
  onalbum:function(e){
    var albumId = e.currentTarget.dataset.id;
    var title = e.currentTarget.dataset.name;
    if (albumId == -3){
      wx.navigateTo({
        url: 'video/video?albumId=' + albumId +'&title='+title,
      })      
      return false;
    }
      wx.navigateTo({
        url: 'album/album?albumId=' + albumId + '&title=' + title,
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
    if(this.data.cloud){
      this.getCloudBaseList();
    }else{
      this.setData({
        cloud: true
      })
    }
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