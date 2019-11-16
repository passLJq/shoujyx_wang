// pages/tourism/tourism.js
Page({

  data: {
    page:0,
    getSpotList:'getSpotList',
    followUrl:'app/session/changeFollowStatus',   //关注状态
    tourismRecommend:'tourismRecommend',
    listData:[],
    data:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSpotList();
    this.getTourismRecommend();
    wx.setNavigationBarTitle({
      title: '觅景'
    });
  },


  onspot:function(e){
    var spotId = e.currentTarget.dataset.id;
    var spotName = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/pages/tourism/worksList/worksList?spotId=' + spotId + '&spotName=' + spotName +'&url=tourism',
    })
  },

  
  //搜索
  search:function(){
    wx.navigateTo({
      url: '/pages/tourism/search/search',
    })
  },

  onMore:function(){
    wx.navigateTo({
      url: '/pages/tourism/tourismList/tourismList',
    })
  },
  onrecommend:function(){
    console.log('推荐图片')
  },

  getTourismRecommend:function(){
    var _this = this;
    var url = getApp().domain2 + this.data.tourismRecommend;
    wx.request({
      url: url,
      data: {},
      header: getApp().header,
      success: function (res) {
        if (res.data.code == 0) {
            _this.setData({
              data:res.data.data
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

  //点击用户
  onuser: function (e) {
    var userId = e.currentTarget.dataset.id;
    console.log('点击用户头像')
    wx.navigateTo({
      url: '/pages/userhome/userhome?userId=' + userId,
    })
  },

  //点击图片
  onImg: function (e) {
    var code = e.currentTarget.dataset.group;
    var id = e.currentTarget.dataset.id;
    if (code == 2) {
      wx.navigateTo({
        url: '/pages/worksShow/worksDetails/worksDetails?id=' + id,
      })
      return false;
    }

    wx.navigateTo({
      url: '/pages/pictureDetails/pictureDetails?imgId=' + id,
    })
  },

  spot:function(){
    wx.navigateTo({
      url: '/pages/tourism/uploadSelect/uploadSelect?url='+'tourism',
    })
  },

  showDetail:function(e){
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: './worksList/worksList?spotId=' + id +'&spotName=' + name,
    })
  },
  //状态修改
  changeFollow: function (e) {
    if (!getApp().loginStatus) {
      wx.navigateTo({
        url: '/pages/public/login/login',
      })
      return false;
    }
    var thiss = this;
    var userId = e.currentTarget.dataset.userid;
    var key = e.currentTarget.dataset.key;
    var status = e.currentTarget.dataset.status;
    var listData = this.data.listData;
    status = status ? 0 : 1;

    let url = getApp().domain2 + this.data.followUrl;
    wx.request({
      url: url,
      data: { code: status, userId: userId },
      header: getApp().header,
      success: function (res) {
        if (res.data.code == 0) {
           listData[key].isFollow = status;
          // let data = [];
          // for (var i = 0; i < listData.length; i++) {
          //   if (listData[i].author_id != userId) {
          //     data.push(listData[i])
          //   }
          // }
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
    for (var i in data) {
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
  getSpotList:function(){
      var _this = this;
      var page = this.data.page + 1;
      wx.request({
        url: getApp().domain2 + this.data.getSpotList,
        data: {
          page: page,
          spotId:0
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
    wx.showNavigationBarLoading();
    this.setData({
      page: 0,
      listData: [],
      data: []
    });
    this.getSpotList();
    this.getTourismRecommend();
    setTimeout(() => {
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading()
    }, 1000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getSpotList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})