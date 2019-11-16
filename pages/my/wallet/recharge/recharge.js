// pages/my/wallet/recharge/recharge.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payNum:'',
    kb:'',
    wxPayUrl:'app/session/wxPay',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '充值'
    });
  },

  kb:function(e){
    this.setData({
      payNum: e.detail.value /10,
      kb: e.detail.value
    })
  },
  payNum:function(e){
    this.setData({
      kb: e.detail.value * 10,
      payNum: e.detail.value,
    })
  },
  //弹窗提示
  Prompt: function (content) {
    wx.showToast({
      title: content,
      icon: 'none',
      duration: 2000
    });
  },
  xcxPay:function(){
    var _this =this;
    var payParams = this.data.payParams;
    wx.requestPayment({
      'timeStamp': payParams.timeStamp,  // 时间戳必须是字符串，否则会报错 
      'nonceStr': payParams.nonceStr,
      'package':  payParams.prePayId,  // 这里的值必须是 prepay_id=XXXXXXXXX 的格式，否则也会报错 
      'signType': 'MD5',
      'paySign': payParams.paySign,
      'success': function (res) {
      // 这里应该是 res.errMsg , 跟公众号的支付返回的参数不一样，公众号是 err_msg, 就因为没注意到这个，折腾了很长时间

      if(res.errMsg == "requestPayment:ok"){  // 调用支付成功
        _this.prePayId(payParams.prePayId, payParams.orNo)
      } 
      },
      'fail': function (res) {
        console.log(res)
        return false;
      },
      'complete': function (res) { }
    }) 
  },

  prePayId: function (prePayId, orNo) {
    var _this = this;
    let url = getApp().domain2 + 'app/session/successPay';
    wx.request({
      url: url,
      method: "POST",
      dataType: "json",
      data: { prePayId: prePayId, orNo: orNo},
      header: getApp().header,
      success: function (res) {
        if (res.data.code == 0) {
          wx.navigateBack({
            delta: 1
          })
        }

      }
    })
  },

  onDetailed: function (e) {
    var code = e.currentTarget.dataset.code;
    wx.navigateTo({
      url: '/pages/my/wallet/payList/payList?code=' + code,
    })
  },


  payConfirm:function(){
    var _this = this;
    var cash = this.data.payNum;
    if (cash <= 0){
      this.Prompt('请输入正确金额');
      return false;
    }
    if (cash < 1) {
      this.Prompt('充值金额不能小于10K币');
      return false;
    }

    this.setData({
      isSubmit:true
    })

    let url = getApp().domain2 + this.data.wxPayUrl;
    wx.request({
      url: url,
      method: "POST",
      dataType: "json",
      data: {rAmount: cash},
      header: getApp().header,
      success: function (res) {
        if (res.data.code == 0) {
          _this.setData({
            payParams: res.data.data
          })
          _this.xcxPay();
        }
        _this.setData({
          isSubmit:false
        })
      }
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})