// pages/tourism/bagUpload/bagUpload.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TotalMessageNum:200,
    getSpotBgk:'app/session/getSpotBgk',
    spotBgkChange:'app/session/spotBgkChange',
    desc:'',
    descLength:0,
    image:'',
    img:'',
    spotId:'123',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (options.spotName){
      wx.setNavigationBarTitle({
        title: options.spotName
      });
    }else{
      wx.setNavigationBarTitle({
        title: '景区介绍编辑'
      });
    }

    this.setData({
      spotId: options.spotId,
      spotName: options.spotName,
    })
    this.getSpotBgk();
  },

  getSpotBgk:function(){
    var _this = this;
    let url = getApp().domain2 + this.data.getSpotBgk;
    let spotId = this.data.spotId;
    wx.request({
      url: url,
      data: { spotId: spotId},
      header: getApp().header,
      success: function (res) {
        if (res.data.code == 0) {
          let data = res.data.data;
            _this.setData({
              image: data.image,
              desc:data.desc
            })
        }
      }
    })
  },
  getDesc: function (e) {
    this.setData({
      desc: e.detail.value,
      descLength: e.detail.value.length,
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
            img: res.tempFilePaths[0],
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
  submit:function(){
    var _this = this;
      var desc = this.data.desc;
      desc = desc.replace(/^\s+|\s+$/g, "");
      if (!desc) {
        this.Prompt('描述不能为空！请输入描述');
        return false;
      }

      var spotId = this.data.spotId;
      var spotName = this.data.spotName;
      var image = this.data.image;
      var img = this.data.img;
      var url = getApp().domain2 + this.data.spotBgkChange;
      if (!img){
        wx.request({
          url: url,
          data: { spotId: spotId, desc:desc},
          header: getApp().header,
          success: function (res) {
            if (res.data.code == 0) {
              wx.redirectTo({
                url: '/pages/tourism/worksList/worksList?spotId=' + spotId + '&spotName=' + spotName,
              })
            }

          }
        })
        return false;
      }
      wx.uploadFile({
        url: url,
        filePath: image,
        name: 'file',
        formData: { desc: desc, spotId: spotId},
        header: getApp().header,
        success: (res) => {
          if (res.statusCode == 200) {
            let resData = JSON.parse(res.data);
            if (resData.code == 0) {
              _this.Prompt('保存成功');
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/tourism/worksList/worksList?spotId=' + spotId + '&spotName=' + spotName,
                })
              }, 2000)
              
            }else{
              _this.Prompt('保存失败');
            }
          }else{
            _this.Prompt('保存失败');
          }
        },
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