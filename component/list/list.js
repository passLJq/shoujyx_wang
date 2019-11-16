Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Array,
      observer: function (newVal, oldVal) {
        if (newVal != null && newVal != '') {
          this.getData(newVal)
        }
      }
    },
    // 清空数据
    clearData: {
      type: Number,
      observer: function (newVal, oldVal) {
        if (newVal != null) {
          this.data.changeType = true
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    height: 0,
    arrLeft: [],
    arrRight: [],
    leftH: 0,
    rightH: 0,
    changeType: false
  },
  ready() {
    let w = wx.getSystemInfoSync()
    this.setData({
      height: w.windowHeight,
      imgWidth: w.windowWidth * 0.485
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getData(data) {
      console.log(data)
      let ct = this.data.changeType
      let lh = ct ? 0 : this.data.leftH
      let rh = ct ? 0 : this.data.rightH
      let arrLeft = ct ? [] : this.data.arrLeft
      let arrRight = ct ? [] : this.data.arrRight
      data.forEach(i => {
        let scale = i.iwidht / i.iheight
        let h = parseInt(this.data.imgWidth / scale)
        if (lh <= rh) {
          lh += h
          arrLeft.push(i)
        } else {
          rh += h
          arrRight.push(i)
        }
      })
      this.data.leftH = lh
      this.data.rightH = rh
      this.data.changeType = false
      this.setData({
        arrLeft,
        arrRight,
      })
      console.log(arrLeft.length + arrRight.length)
    },
    // 触底加载
    onlower() {
      this.triggerEvent('loadMore')
    }
  }
    
})