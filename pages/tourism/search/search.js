// pages/tourism/uploadSelect/uploadSelect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: '全部',
    cityPickerValue: [0, 0],
    cityPickerIsShow: false,
    keyword: '',
    searchSpot: 'searchSpot',
    spotList: [],
    spotId: 0,
    cityId: 0,
    spotSelect: false,
    spotName: '请选择',
    page:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    if (options.cityId && options.cityName) {
      this.setData({
        cityId: options.cityId,
        city: options.cityName,
        cityPickerValue: [0, options.cityId]
      })

    }
    console.log(options.url)
    this.setData({
      url: options.url
    })
    wx.setNavigationBarTitle({
      title: '景点选择'
    });
    this.search();
  },

  //删除关键词
  keywordDel: function () {
    this.setData({
      keyword: ''
    })
    this.search();
  },

  getkeyword: function (e) {
    var keyword = e.detail.value;

    console.log(keyword)
    this.setData({
      keyword: keyword
    })
  },

  loadImages:function(){
    
  },

  list:function(data){
    var spotData = this.data.spotList;
    for(var i=0;i<data.length;i++){
      spotData.push(data[i]);
    }
    this.setData({
      spotList: spotData
    })
  },

  //搜索
  search: function () {
    var _this = this;
    var url = getApp().domain2 + this.data.searchSpot;
    var spotName = this.data.keyword;
    var data = this.data.cityPickerValue;
    var cityId = data[1];
    wx.request({
      url: url,
      data: {cityId: cityId,spotName: spotName},
      header: getApp().header,
      success: function (res) {
        if (res.data.code == 0) {
          // _this.list(res.data.data);
          _this.setData({
            spotList: res.data.data,
            spotId: 0,
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

  },

  selectSpot: function () {
 
   // let city = this.data.cityPickerValue;
    // if (!city[1]) {
    //   wx.showToast({
    //     title: '请选择城市',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return false;
    // }
    this.setData({
      spotSelect:true
    })
  },

  //确认景点
  spotConfirm: function () {
    var spotId = this.data.spotId;
    if (!spotId) {
      wx.showToast({
        title: '请选择景点',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.setData({
        spotSelect: false,
      })
    }
  },

  //景点选择
  onSpot: function (e) {

    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    this.setData({
      spotSelect:false
    })
    wx.navigateTo({
      url: '../worksList/worksList?spotId=' + id + '&spotName=' + name,
    })
  },


  upload: function (e) {
    var type = e.currentTarget.dataset.id;
    var cityData = this.data.cityPickerValue;
    if (cityData[1] == '0') {
      wx.showToast({
        title: '请先选择城市',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    var spotId = this.data.spotId;
    var url = this.data.url;
    var spotName = this.data.spotName;
    if (!spotId) {
      wx.showToast({
        title: '请选择景点',
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    getApp().tagPage = url;
    wx.reLaunch({
      url: '/pages/upload/upload?type=' + type + '&cityId=' + cityData[1] + '&spotId=' + spotId + '&code=2&url=' + url + '&spotName=' + spotName,
    })

  },

  //获取城市旅游列表
  getTourismList: function () {
    var _this = this;
    var page = this.data.page + 1;
    var cityId = this.data.cityPickerValue;
    cityId = cityId[1];
    var url = getApp().domain + this.data.getTourismList;
    wx.request({
      url: url,
      data: { page: page, cityId: cityId },
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
      page: 0,
      listData: [],
      spotName: '请选择',
      spotId: 0
    });

    this.search();
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