// pages/tourism/tourism.js
Page({
  data: {
    page: 0,
    getSpotList: 'getSpotList',
    getSpotData:'getSpotData',
    followUrl: 'app/session/changeFollowStatus',   //关注状态
    toTopFile:'app/session/toTopFile',
    spotFindStatus: 'app/session/spotFindStatus',
    spotFindUrl: 'app/session/spotFind',
    listData: [],
    spotData:[],
    spotId:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.setNavigationBarTitle({
      title: options.spotName
    });

    this.setData({
      spotId: options.spotId
    })

    this.getSpotList();
    this.getSpotData();
    
  },

  spot:function(){
    var data = this.data.spotData;

    wx.navigateTo({
      url: '/pages/tourism/uploadSelect/uploadSelect?url=worksList/worksList&cityId='+data.cityId+'&cityName='+data.cityName+'&spotId='+data.spotId +'&spotName='+data.spotName,
    })
  },

  //编辑
  edit:function(e){
    let spotId = e.currentTarget.dataset.id;
    let spotName = e.currentTarget.dataset.name;
    wx.redirectTo({
      url: '/pages/tourism/bagUpload/bagUpload?spotId=' + spotId + '&spotName=' + spotName,
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

  setTop:function(e){
    var spotFileId = e.currentTarget.dataset.id;
    var url = getApp().domain2 + this.data.toTopFile;
    var spotId = this.data.spotId;
    wx.request({
      url: url,
      data: { spotId: spotId, spotFileId: spotFileId },
      header: getApp().header,
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '置顶成功',
            icon: 'none',
            duration: 2000
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

  addPicture:function(){
    wx.navigateTo({
      url: '/pages/tourism/uploadSelect/uploadSelect',
    })
  },

  //状态修改
  changeFollow1: function (e) {
    var thiss = this;
    var userId = e.currentTarget.dataset.userid;
    var status = e.currentTarget.dataset.status;
    var spotData = this.data.spotData;
    status = status ? 0 : 1;

    let url = getApp().domain2 + this.data.followUrl;
    wx.request({
      url: url,
      data: { code: status, userId: userId },
      header: getApp().header,
      success: function (res) {
        if (res.data.code == 0) {
          spotData.isFollow = status;
          thiss.setData({
            spotData: spotData
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



  //状态修改
  changeFollow: function (e) {
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

  getSpotData:function(){
    var _this = this;
    var spotId = this.data.spotId;
    wx.request({
      url: getApp().domain2 + this.data.getSpotData,
      data: {
        spotId: spotId
      },
      header: getApp().header,
      success: function (res) {
        wx.hideNavigationBarLoading()
        if (res.data.code == 0) {
            _this.setData({
              spotData:res.data.data
            })
        }
      },
      fail: function (res) {
        wx.hideNavigationBarLoading()
      }
    });
  },

  getSpotList: function () {
    var _this = this;
    var page = this.data.page + 1;
    var spotId = this.data.spotId;
    wx.request({
      url: getApp().domain2 + this.data.getSpotList,
      data: {
        page: page,
        spotId: spotId
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


  //取消
  cancel: function (e) {
    this.setData({
      spotFind: !this.data.spotFind
    })
  },
  confirm: function (e) {
    var spotData = this.data.spotData;

    // wx.navigateTo({
    //  // url: '/pages/tourism/bagUpload/bagUpload?spotId=' + spotData.spotId + '&spotName=' + spotData.spotName,

    // })
    wx.request({
      url: getApp().domain2 + this.data.spotFindUrl,
      data: { spotId: spotData.spotId },
      header: getApp().header,
      success: function (res) {
        if (res.data.code == 0) {
          let data = res.data.data;
          wx.redirectTo({
            url: '/pages/tourism/worksList/worksList?url=worksList/worksList&spotId=' + spotData.spotId + '&spotName=' + spotData.spotName,
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
  //上传
  upload: function () {
    var data = this.data.spotData;
    wx.redirectTo({
      url: '/pages/tourism/uploadSelect/uploadSelect?url=worksList/worksList&spotId=' + data.spotId + '&spotName=' + data.spotName + '&cityId=' + data.cityId + '&cityName=' + data.cityName,
    })
  },



  //成为发现者
  spotFind: function (e) {
    var _this = this;
    var spotId = e.currentTarget.dataset.id;
    var spotName = e.currentTarget.dataset.name;
    var cityId = e.currentTarget.dataset.cityid;
    var cityName = e.currentTarget.dataset.cityname;

    var url = getApp().domain2 + this.data.spotFindStatus;
    var data = {spotId: spotId, spotName: spotName, cityId: cityId, cityName: cityName}
    this.setData({
      postData: data
    })

    wx.request({
      url: url,
      data: { spotId: spotId },
      header: getApp().header,
      success: function (res) {
        if (res.data.code == 0) {
          let data = res.data.data;
          _this.setData({
            spotFind: data.status,
            findData: data
          });

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })


    this.setData({
      spotFind: true
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
    this.getSpotList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})