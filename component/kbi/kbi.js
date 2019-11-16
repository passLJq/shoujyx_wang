const app = getApp()
const util = require("../../utils/util.js")
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showKbi: { // 属性名
      type: Number, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal) {
        if (newVal == 1) {
          var bool = true
        } else {
          var bool = false
        }
        this.setData({
          showBox: bool
        })
      }
    },
    workData: {
      type: Object,
      value: '',
      observer: function (newVal, oldVal) {
        if (!newVal) return
        this.setData({
          works: newVal
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showBox: true,
    kb: 0,     // 金额
    inputMoney: false,  // 是否在输入金额
  },
  ready() {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // this.triggerEvent('bindArea', { 'areaCode': code })
    // 关闭
    cancel() {
      this.triggerEvent('close', 1)
    },
    // 金额选择
    bkSelect: function (e) {
      var reward = e.currentTarget.dataset.kb;
      this.setData({
        kb: reward,
        inputMoney: false
      })
    },

    kbFocus: function () {
      this.setData({
        kb: 0
      })
    },
    kbInput: function (e) {
      this.setData({
        kb: e.detail.value,
      })
    },
    //其它金额
    onInput: function () {
      this.setData({
        inputMoney: true
      })
    },
    rewardSubmit: function () {
      var _this = this;
      var kb = this.data.kb;
      var docId = this.data.workData.works_id
      if (isNaN(kb)) {
        util.tips('请输入正确金额');
        return false;
      }
      this.setData({
        isSubmit: true
      })
      let url = getApp().domain2 + 'app/session/reward'
      wx.request({
        url: url,
        method: "POST",
        dataType: "json",
        data: { kb: kb, docId: docId, code: 1 },
        header: getApp().header || wx.getStorageSync('sessionId'),
        success: function (res) {
          if (res.data.code == 0) {
            _this.setData({
              reward: false,
              isSubmit: false
            })
            util.tips('打赏成功');
          } else {
            _this.setData({
              reward: false,
              isSubmit: false
            })
            util.tips(res.data.msg);
          }

        }
      })
    },
    // 跳转充值
    onRecharge: function () {
      wx.navigateTo({
        url: '/pages/my/wallet/recharge/recharge',
      })
    },
  }
})