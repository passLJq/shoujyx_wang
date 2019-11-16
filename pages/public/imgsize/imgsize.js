Page({
  data: {
    touch: {
      distance: 0,
      scale: 1,
      baseWidth: null,
      baseHeight: null,
      scaleWidth: null,
      scaleHeight: null
    }
  },
  onShareAppMessage: function () {


    return {
      title: 'xxx',
      path: 'xxx?id=' + this.data.id,
      desc: '13613123',
      success: function (res) {

      }
    };
  },


  //图片加载
  imageLoad: function (e) {


    console.log('aaaaaaaaaaaaa')
    let imgW = e.detail.width,
      imgH = e.detail.height,

      ratio = imgW / imgH;
    var viewWidth = 750,
      viewHeight = 750 / ratio;
    let touch = this.data.touch
    touch.scaleWidth = width;
    touch.scaleHeight = height;
    this.setData({
      touch: touch
    })
  },


  touchstartCallback: function (e) {
    // 单手指缩放开始，也不做任何处理
    if (e.touches.length == 1) return
    console.log('双手指触发开始')
    // 注意touchstartCallback 真正代码的开始
    // 一开始我并没有这个回调函数，会出现缩小的时候有瞬间被放大过程的bug
    // 当两根手指放上去的时候，就将distance 初始化。
    let xMove = e.touches[1].clientX - e.touches[0].clientX;
    let yMove = e.touches[1].clientY - e.touches[0].clientY;
    let distance = Math.sqrt(xMove * xMove + yMove * yMove);
    this.setData({
      'touch.distance': distance,
    })
  },
  touchmoveCallback: function (e) {
    let touch = this.data.touch
    // 单手指缩放我们不做任何操作
    if (e.touches.length == 1) return
    console.log('双手指运动')
    let xMove = e.touches[1].clientX - e.touches[0].clientX;
    let yMove = e.touches[1].clientY - e.touches[0].clientY;
    // 新的 ditance
    let distance = Math.sqrt(xMove * xMove + yMove * yMove);
    let distanceDiff = distance - touch.distance;
    let newScale = touch.scale + 0.005 * distanceDiff
    // 为了防止缩放得太大，所以scale需要限制，同理最小值也是
    if (newScale >= 2) {
      newScale = 2
    }
    if (newScale <= 0.6) {
      newScale = 0.6
    }
    let scaleWidth = newScale * touch.baseWidth
    let scaleHeight = newScale * touch.baseHeight
    // 赋值 新的 => 旧的
    this.setData({
      'touch.distance': distance,
      'touch.scale': newScale,
      'touch.scaleWidth': scaleWidth,
      'touch.scaleHeight': scaleHeight,
      'touch.diff': distanceDiff
    })
  },
  bindload: function (e) {
    // bindload 这个api是加载中...组件的api类似加载中...的onload属性

    let imgW = e.detail.width,
      imgH = e.detail.height,

      ratio = imgW / imgH;
    var viewWidth = 750,
      viewHeight = 750 / ratio;
    console.log(imgW)
    console.log(imgH)
    console.log(viewWidth)
    console.log(viewHeight)




    this.setData({
      'touch.baseWidth': viewWidth / 2,
      'touch.baseHeight': viewHeight / 2,
      'touch.scaleWidth': viewWidth / 2,
      'touch.scaleHeight': viewHeight / 2
    })
  }
})