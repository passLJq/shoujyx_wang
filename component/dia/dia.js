Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showDia: {
      type: Number,
      value: '',
      observer: function (newVal, oldVal) {
        console.log(newVal)
        if (newVal != null && newVal != '') {
          this.setData({
            showBox: newVal
          })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showBox: 0
  },
  ready() {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      this.setData({
        showBox: 0
      })
      this.triggerEvent('close', 0)
    },
    // 获取用户授权信息
    getUserInfo(e) {
      console.log(e)
      // return
      if (e.detail.errMsg == 'getUserInfo:ok') {
        getApp().setUserInfo(e.detail.rawData)
        this.setData({
          showBox: 0
        })
        this.triggerEvent('close', 1)
      }
    },
    goLogin() {
      this.triggerEvent('close', 0)
      this.setData({
        showBox: 0
      }, () => {
        wx.navigateTo({
          url: '/pages/public/login/login',
        })
      })
      
    }
  }
    
})