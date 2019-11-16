
const app = getApp();
Page({
  data: {
    page: 0,
    indicatorDots: true,
    autoplay: true,
    interval: 1000,
    duration: true,
    member_id: "", //登录用户id
    followUrl: 'app/session/changeFollowStatus',   //关注状态
    getShowListUrl: "showList", //
    listData: [],
    code:1
  },
  onLoad: function(options){
    this.setData({
      code: options.code
    })
    wx.showNavigationBarLoading();
    this.getShowList();
    wx.setNavigationBarTitle({
      title: '图文列表'
    });



  },
  changeFollow: function (e) {
    var thiss = this;
    var userId = e.currentTarget.dataset.userid;
    var key = e.currentTarget.dataset.key;
    var status = e.currentTarget.dataset.status;
    var listData = this.data.listData;
    status = status ? 0 : 1;
    let url = app.domain2 + this.data.followUrl;
    wx.request({
      url: url,
      data: { code: status, userId: userId },
      header: getApp().header,
      success: function (res) {
        if (res.data.code == 0) {
          listData[key].is_follow = status;
          thiss.setData({
            listData: listData
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  list: function (data) {
    var listData = this.data.listData;
    for (var i = 0; i < data.length; i++) {
      data[i].rank = this.stars(data[i].rank);
      listData.push(data[i])
    }
    this.setData({
      listData: listData
    })
  },
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
  //点击用户
  onuser: function (e) {
    var userId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/userhome/userhome?userId=' + userId,
    })
  },
  //点击图片
  onImg: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/worksShow/worksDetails/worksDetails?id=' + id,
    })
  },
  getShowList: function () {
    var code = this.data.code;
    var _this = this;
    var page = this.data.page + 1;
    wx.request({
      url: app.domain2 + this.data.getShowListUrl,
      data: {
        code: code,
        page: page
      },
      header: getApp().header,
      success: function (res) {
        wx.hideNavigationBarLoading()
        if (res.data.code == 0) {

          _this.setData({
            page: page
          });
          _this.list(res.data.data);
        }
      },
      fail: function (res) {
        wx.hideNavigationBarLoading()
      }
    });
  },

  //上拉触底监听
  onReachBottom: function () {
    this.getShowList()
  },
  //评论信息下一页函数
  commentNext: function () {
    var _this = this;
    if (!_this.data.pictureCommentStop) {
      //修改页码
      _this.setData({
        pictureCommentPage: _this.data.pictureCommentPage += 1
      })
      //重新调用图片评论请求
      this.getPictureComments();
    }
  },
  //分享事件
  share: function () {
    //修改shareActive的值
    this.setData({
      shareActive: "active"
    })
  },
  //分享里面的删除事件
  shareDelect: function () {
    //修改shareActive的值
    this.setData({
      shareActive: ""
    })
  },


  onShareAppMessage: function () {
    return {
      title: '手机影像',
      success: function (res) {
        this.message('分享成功')
      }
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // if (!getApp().loginStatus) {
    //   wx.navigateTo({
    //     url: '/pages/public/login/login',
    //   })
    // }

  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    this.setData({
      page: 0,
      listData: [],
    })
    this.getShowList();
    setTimeout(() => {
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading()
    }, 1000);
  },

});