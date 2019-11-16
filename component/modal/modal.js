Component({
  /**
   * 组件的属性列表
   */
  properties: {
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
    closeChoose() {
      this.triggerEvent('close', 0)
    },
    chooseHandler(e) {
      let type = e.currentTarget.dataset.type
      this.triggerEvent('handler', type)
    }
  }
    
})