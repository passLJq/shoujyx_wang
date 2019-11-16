Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: '',
    }
    // showDia: {
    //   type: Number,
    //   value: '',
    //   observer: function (newVal, oldVal) {
    //     console.log(newVal)
    //     if (newVal != null && newVal != '') {
    //       this.setData({
    //         showBox: newVal
    //       })
    //     }
    //   }
    // }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },
  ready() {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    confirm() {
      this.triggerEvent('handler', 'success')
    },
    cancel() {
      this.triggerEvent('handler', 'cancel')
    }
  }
    
})