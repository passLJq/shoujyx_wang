const app = getApp();
var imglist = require('../../utils/imglist.js');
Page({

  data: {
    changeFollowStatusUrl: "app/session/changeFollowStatus",//关注状态修改
    getMemberImgListUrl:'app/getUserImgList',
    getUserDataUrl:'app/getUserData',
    info: '',
    onnum:1,
    page: 0,
    topPage: 0,
    istype: 0,
    page:0,
    isEmpty:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId: options.userId,
    })
    let url = app.domain2 + this.data. getUserDataUrl;
    this.query(url, { userID: options.userId});
    imglist.getSystemInfo(this);
    this.loadImages();
  },
  onType: function (e) {
    this.setData({
      onnum: e.currentTarget.dataset.code,
      page:0,
      istype: 0,
      isEmpty:false,
      message:e.currentTarget.dataset.msg

     });
    this.loadImages()
  },

  back: function (data) {
    var loaddata = imglist.loadImages(data.data,this)
    let isEmpty = data.data.length;
    let page = this.data.page;
    if (isEmpty == 0 && page == 1){
      this.setData({
        isEmpty: true,
      })
    }
    
    // this.setData({
    //   loadingCount: loaddata.loadingCount,
    //   images: loaddata.images,
    // })

  },
  //加载
  loadImages: function () {
    this.setData({
      page: this.data.page + 1,
    })

    var data = {
      userId:this.data.userId,
      page: this.data.page,
      code: this.data.onnum

    }
    var thiss = this;
    var url = app.domain2 + this.data.getMemberImgListUrl;
    imglist.query(url, data, this.back);
  },
  //计算等级
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
    this.setData({ stars: array });
  },
  //点击图片事件
  onimg: function (e) {
    wx.navigateTo({
      url: '/pages/pictureDetails/pictureDetails' + '?imgId=' + e.currentTarget.dataset.imgid,
    })
  },
  //图片
  onImageLoad: function (e) {
    var imgdata = imglist.onImageLoad(e, this)
    this.setData({
      loadingCount: imgdata.loadingCount,
      col1: imgdata.col1,
      col2: imgdata.col2
    })
  },
  //请求数据
  query: function (url, data) {
    let thiss = this;
    wx.request({
      url: url,
      data: data,
      header:getApp().header,
      success: function (res) {
        if (res.data.code == 0) {
          thiss.stars(res.data.data.user_rank);
          if (res.data.data.background){
            var defaultbackg = res.data.data.background
          }else{
            var defaultbackg = getApp().cloudAlbum.defaultbackground
          }
          thiss.setData({
            info: res.data.data,
            defaultbackg: defaultbackg
          })
          wx.setNavigationBarTitle({
            title: res.data.data.user_name
          });
        }

      }
    })
  },

  onUserList: function (e) {
    let userId = this.data.info.user_id;
    console.log(userId)
    wx.navigateTo({
      url: '/pages/my/myUserList/myUserList' + '?code=' + e.currentTarget.dataset.id + '&userId='+userId,
    })
  },

  //关注
  onfollow:function(e){
    if (!getApp().loginStatus) {
        wx.navigateTo({
          url: '/pages/public/login/login',
        })
    }
    var _this = this;
    let url = app.domain2 + this.data.changeFollowStatusUrl;
    let userId = this.data.info.user_id;
    let status = e.currentTarget.dataset.status;
    status = (status == 1) ? 0 : 1;
    wx.request({
      url: url,
      header: getApp().header,
      data: { code: status, userId: userId },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 0) {
            let info = _this.data.info;
            info.isfollow = status;
            _this.setData({
              info: info
            })
          } else {
            if (res.data.code > 0) {
              _this.message(res.data.msg);
            } else {
              wx.navigateTo({
                url: '/pages/public/login/login',
              })
            }

          }
        } else {
          _this.message()
        }

      }
    });

  },
  onCollectionImg: function (e) {
    wx.navigateTo({
      url: '/pages/pictureDetails/pictureDetails' + '?imgId=' + e.currentTarget.dataset.id,
    })
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()

    setTimeout(function () {

      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
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