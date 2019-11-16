// pages/tourism/tourismList/tourismList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: '',
    cityPickerValue: [0, 0],
    cityPickerIsShow: false,
    getTourismList:'getTourismList',
    spotFindStatus:'app/session/spotFindStatus',
    spotFindUrl:'app/session/spotFind',
    page:0,
    listData:[],
    spotFind:0,
    findData:[],
    spotData:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTourismList();
    wx.setNavigationBarTitle({
      title: '旅游美景地'
    });
  },
  
  //搜索
  search:function(e){
    var cityPickerValue = this.data.cityPickerValue;
    var cityId = cityPickerValue[1];
    var cityName = this.data.city;
    wx.navigateTo({
      url: '/pages/tourism/search/search?cityId=' + cityId + '&cityName=' + cityName,
    })
  },

  //取消
  cancel:function(e){
      this.setData({
        spotFind: !this.data.spotFind
      })
  },
  confirm:function(e){
    var spotData = this.data.spotData
    // wx.navigateTo({
    //  // url: '/pages/tourism/bagUpload/bagUpload?spotId=' + spotData.spotId + '&spotName=' + spotData.spotName,

    // })
    wx.request({
      url: getApp().domain2 + this.data.spotFindUrl,
      data: { spotId: spotData.spotId},
      header: getApp().header,
      success: function (res) {
        if (res.data.code == 0) {
          let data = res.data.data;
          wx.navigateTo({
            url: '/pages/tourism/tourismList/tourismList?spotId=' + spotData.spotId,
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
  upload:function(){
    var data = this.data.spotData;
    wx.navigateTo({
      url: '/pages/tourism/uploadSelect/uploadSelect?url=tourismList/tourismList&spotId=' + data.spotId + '&spotName=' + data.spotName +'&cityId='+data.cityId+'&cityName='+data.cityName,
    })
  },

  //搜索
  // search: function () {
  //   wx.navigateTo({
  //     url: '/pages/tourism/search/search',
  //   })
  // },



  //
  tourismDetail:function(e){
    var spotId = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../worksList/worksList?spotId=' + spotId +'&spotName='+name,
    })
  },
  onUser:function(e){
    var userId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/userhome/userhome?userId=' + userId,
    })
  },

  recommend:function(){
    wx.navigateTo({
      url: '/pages/tourism/spotRecommend/spotRecommend',
    })
  },

  //成为发现者
  spotFind:function(e){
    var _this = this;
    var spotId = e.currentTarget.dataset.id;
    var spotName = e.currentTarget.dataset.name;
    var cityId = e.currentTarget.dataset.cityid;
    var cityName = e.currentTarget.dataset.cityname;

    var url = getApp().domain2 + this.data.spotFindStatus;
    var data = { spotId: spotId, spotName: spotName, cityId: cityId, cityName: cityName}
    this.setData({
      spotData: data
    })

    wx.request({
      url: url,
      data: { spotId:spotId},
      header: getApp().header,
      success: function (res) {
        if (res.data.code == 0) {
          let data = res.data.data;
          _this.setData({
            spotFind: data.status,
            findData:data
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
      spotFind:true
    })
  },

  list: function (data) {
    var listData = this.data.listData;
    for (var i in data) {
      // data[i].rank = this.stars(data[i].rank);
      listData.push(data[i])
    }
    this.setData({
      listData: listData
    })
  },

  //获取城市旅游列表
  getTourismList:function(){
    var _this = this;
    var page = this.data.page + 1;
    var cityId = this.data.cityPickerValue;
    cityId = cityId[1];
    var url = getApp().domain2 + this.data.getTourismList;
    wx.request({
      url: url,
      data: { page: page, cityId: cityId},
      header: getApp().header,
      success: function (res) {
        if (res.data.code == 0) {
          _this.setData({
            page: page
          });
          _this.list(res.data.data);
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



  /**
   * 城市选择确认
   */
  cityPickerOnSureClick: function (e) {
    // console.log('cityPickerOnSureClick');
    // console.log(e);
    this.setData({
      city: e.detail.valueName[1],
      cityPickerValue: e.detail.valueCode,
      cityPickerIsShow: false,
      page:0,
      listData:[],
    });

    this.getTourismList();
  },
  /**
   * 城市选择取消
   */
  cityPickerOnCancelClick: function (event) {
    console.log('cityPickerOnCancelClick');
    console.log(event);
    this.setData({
      cityPickerIsShow: false,
    });
  },


  showCityPicker() {
    // this.data.cityPicker.show()
    this.setData({
      cityPickerIsShow: true,
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
    this.setData({
      spotFind: 0
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (){
    this.getTourismList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})