// pages/tourism/bagUpload/bagUpload.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TotalMessageNum: 200,
    spotBgkChange: 'app/session/spotBgkChange',
    spotName: '',
    spotNameLength: 0,
    spotDesc:'',
    cityName:'请选择城市',
    spotDescLength:0,
    image: '',
    city: '',
    cityPickerValue: [0, 0],
    cityPickerIsShow: false,
    submitStyle: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '推荐美景地'
    });

    // this.getSpotBgk();
  },

  //景区名称
  spotName:function(e){
    this.setData({
      spotName: e.detail.value,
      spotNameLength: e.detail.value.length,
    })
  },
  //景区描述
  spotDesc: function (e) {
    this.setData({
      spotDesc: e.detail.value,
      spotDescLength: e.detail.value.length,
    })
  },

  //添加图片
  addImg: function () {
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: res => {
        for (var i = 0; i < res.tempFiles.length; i++) {
          if ((res.tempFiles[i].size / 1024 / 1024) > 19) {
            _this.Prompt('请上传小于20M的图片');
            return false;
          }
        }
        _this.setData({
          image: res.tempFilePaths[0],
        });
      },
      fail: res => {
      }
    });
  },
  //弹窗提示
  Prompt: function (content) {
    wx.showToast({
      title: content,
      icon: 'none',
      duration: 2000
    });
  },
  submit: function () {

    var _this = this;
    var city = this.data.city;

    if (!city) {
      this.Prompt('城市不能为空');
      return false;
    }

    var spotName = this.data.spotName;
    spotName = spotName.replace(/^\s+|\s+$/g, "");
    if (spotName.length < 2) {
      this.Prompt('景区名称不能小于2个文字');
      return false;
    }
    var spotDesc = this.data.spotDesc;
    spotDesc = spotDesc.replace(/^\s+|\s+$/g, "");
    if (spotDesc.length < 10) {
      this.Prompt('景区介绍不能小于20个字');
      return false;
    }

    var image = this.data.image;
    if (!image) {
      this.Prompt('请选择图片');
      return false;
    }
    this.setData({
      submitStyle:false
    })

    var cityName = this.data.cityName;
    var city = this.data.cityPickerValue;
    var url = getApp().domain2 + this.data.spotBgkChange;
    wx.uploadFile({
      url: url,
      filePath: image,
      name: 'file',
      formData: { spotId: 0, spotName: spotName, spotDesc: spotDesc, cityId: city[1]},
      header: getApp().header,
      success: (res) => {
        if (res.statusCode == 200) {
          let resData = JSON.parse(res.data);
          if (resData.code == 0) {
            _this.Prompt('保存成功');

            _this.setData({
              submitStyle: true
            })
            setTimeout(function () {
              if (city[1]){
                wx.redirectTo({
                  url: '/pages/tourism/recommendSuccess/recommendSuccess?spotId' + resData.data.spotId + '&spotName=' + spotName + '&cityId=' + city[1] + '&cityName=' + cityName,
                })
              }else{
                wx.navigateBack({
                  delta: 1
                })
              }
            }, 2000)

          } else {
            _this.Prompt('保存失败');
          }
        } else {
          _this.Prompt('保存失败');
        }
      },
    });

  },

  /**
   * 城市选择确认
   */
  cityPickerOnSureClick: function (e) {
    // console.log('cityPickerOnSureClick');
    console.log(e);
    this.setData({
      city: e.detail.valueName[1],
      cityName: e.detail.valueName[1],
      cityPickerValue: e.detail.valueCode,
      cityPickerIsShow: false,
      page: 0,
      listData: [],
    });
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