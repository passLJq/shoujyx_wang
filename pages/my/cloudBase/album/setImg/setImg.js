const app = getApp();
Page({
  data: {
    getWorksInfoUrl:'app/session/getWorksInfo', //获取作品信息
    moveAlbumUrl:'app/session/moveAlbum', //移动相册
    delImgUrl:'app/session/delImg', //删除图片 
    setAlbumUrl:'app/session/setalbum',//设置封面
    data:[],
    // touch: {
    //   distance: 0,
    //   scale: 1,
    //   baseWidth: null,
    //   baseHeight: null,
    //   scaleWidth: null,
    //   scaleHeight: null
    // }
  },


  onLoad: function (options) {
    this.setData({
      imgId: options.imgId,
      albumId: options.albumId,
    })
    this.getWorksInfo();
  },

  // zoom: function (e) {
  //   wx.getSystemInfo({
  //     success: (res) => {
  //       var w = res.windowWidth;
  //       let img = e.currentTarget.dataset.img;
  //       let title = this.data.data.doc_title;
  //       let imgh = this.data.data.iheight;
  //       let imgw = this.data.data.iwidht;
  //       let scale = imgh / imgw;
  //       let h = w * scale;
  //       wx.navigateTo({
  //         url: '/pages/public/main/main?title=' + title + '&w=' + w + '&h=' + h + '&img=' + img
  //       })

  //     }
  //   });
  // },
  // zoom1: function (e) {
  //   wx.getSystemInfo({
  //     success: (res) => {
  //       var w = res.windowWidth;
  //       // let img = e.currentTarget.dataset.img;
  //       // let title = this.data.data.doc_title;
  //       let imgh = this.data.data.iheight;
  //       let imgw = this.data.data.iwidht;
  //       let scale = imgh / imgw;
  //       let h = w * scale;
  //       this.setData({
  //           viewHeight: h,
  //           viewWidth: w,
  //       })
  //       // wx.navigateTo({
  //       //   url: '/pages/public/main/main?title=' + title + '&w=' + w + '&h=' + h + '&img=' + img
  //       // })

  //     }
  //   });

  // },
  
  //是否移动
  ismv:function(){
    var albumId = this.data.albumId;
    var obj = {'-3': '视频作品','-2':'参赛作品'};
    for (var i in obj) {
      if(i==albumId){
        return obj[i]+'不能移动';
      }
    }
    return false;
  },
  //是否删除
  isrm: function () {
    var albumId = this.data.albumId;
    var ismatch = this.data.data.isMatch;
    var obj = { '-2': '参赛作品'};
    for (var i in obj) {
      if (i == albumId || ismatch == 1) {
        return obj[i] + '不能删除';
      }
    }
    return false;
  },
  //是否设为封面
  isSetAlbum: function () {
    var albumId = this.data.albumId;
    if (albumId < 1) {
        return '系统相册封面不能修改!';
      }

    return false;
  },
  
  //编辑
  oneidt:function(){
    let albumId = this.data.albumId;
    if (albumId == '-2'){
      wx.showToast({
        title: '参赛图片不能编辑',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (this.data.data.isMatch) {
      wx.showToast({
        title: '参赛作品不能编辑',
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    var imgId = this.data.imgId;
    wx.navigateTo({
      url: 'edit/edit?imgId='+imgId,
    })
  },
  //移动
  onmv:function(){
    var message = this.ismv()
    if (message){
      this.messageInfo(message)
      return false;
    }
    this.setData({
      mvAlbum:true
    })
  },

  //取消
  selectCancel:function(){
    this.setData({
      mvAlbum: false
    })
  },

  selectKeyword: function (e) {
    var data = e.currentTarget.dataset;
    switch (data.type) {
      case 'mvAlbum':
        this.setData({
          mvAlbum: false,
          albumData: { id: data.id, name: data.name },
          album_name: data.name
        })
        break;
    }
    this.mvAlbum();
  },



  messageInfo: function (message){
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    })
  },

  //提示
  message: function (message,num){
    this.messageInfo(message);
    setTimeout(function () {
      wx.navigateBack({
        delta: num
      })
    }, 2000)
  },
  //请求数据
  query:function(url,data,backNum,message){
    let thiss = this;
    wx.request({
      url: url,
      data: data,
      header:getApp().header,
      success: function (res) {
        if (res.data.code == 0) {
          thiss.message(message, backNum);
        }else{
          thiss.message(res.data.msg);
        }
      }
    })
  },
  mvAlbum:function(){
    let fromData = []; 
    let url = app.domain2 + this.data.moveAlbumUrl;
    let data = {
      imgId: this.data.imgId,
      albumId: this.data.albumData.id
    }
    this.query(url, data,1,'相册移动成功')
  },
  //删除
  onrm: function () {
    var message = this.isrm()
    if (message) {
      this.messageInfo(message)
      return false;
    }

    if(this.data.data.isMatch){
      wx.showToast({
        title: '参赛作品不能删除',
        icon: 'none',
        duration: 2000
      })
      return false;
    }


    let thiss = this;
    let url = app.domain2 + this.data.delImgUrl;
    let data = [];
    data.imgId = this.data.imgId;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          thiss.query(url, data, 2, '删除成功');
        } else if (sm.cancel) {
          
        }
      }
    })
  },
  //设置封面
  setAlbum:function(){
    var message = this.isSetAlbum();
    if (message) {
      this.messageInfo(message)
      return false;
    }

    let data=[];
    let url = app.domain2 + this.data.setAlbumUrl;
    data.albumId = this.data.data.album_id;
    data.imgId = this.data.imgId;
    let thiss = this;
    wx.request({
      url: url,
      data: data,
      header: getApp().header,
      success: function (res) {
        if (res.data.msg == 'success') {
          wx.showToast({
            title: '设置成功',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  //获取图片详情
  getWorksInfo: function () {
    var thiss = this;
    var url = app.domain2 + this.data.getWorksInfoUrl;
    var data = {imgId:this.data.imgId}
    wx.showLoading({
      title: '加载中',
    })
    var handleDataImgPath
    wx.request({
      url: url,
      data: data,
      header: getApp().header,
      success: function (res) {
        if (res.data.code = "0") {
          wx.setNavigationBarTitle({
            title: res.data.data.doc_title
          });
          handleDataImgPath = res.data.data.img_path.split('?')[0]
          res.data.data.img_path=handleDataImgPath
          thiss.setData({
            data: res.data.data,
            imgId: res.data.data.doc_id
          })
          let imgW = thiss.data.data.iwidht
          let imgH = thiss.data.data.iheight
          let ratio = imgW / imgH;
         
          wx.getSystemInfo({
            success: (res) => {
              var w = res.windowWidth;
              let imgh = thiss.data.data.iheight;
              let imgw = thiss.data.data.iwidht;
              let scale = imgh / imgw;
              let h = w * scale;
              
              let viewHeight = res.windowWidth*2 / ratio;
              let top = (res.windowHeight * 2 - viewHeight - 150 )/2
              console.log('top',top)
              thiss.setData({
                  viewHeight: h,
                  viewWidth: w,
                  top:top
              })
            }
          });
          setTimeout(function () {
            wx.hideLoading()
          }, 1000)
        }

      }
    })
  },
  goPictureDetails:function(){
    wx.navigateTo({
      url: '../../../../pictureDetails/pictureDetails?imgId='+this.data.imgId,
    })
  },


  //加载图片
  imageLoad: function (e) {
    let imgW = e.detail.width,
    imgH = e.detail.height,
    ratio = imgW / imgH;
    wx.getSystemInfo({
      success: (res) => {
        let viewHeight = res.windowWidth*2 / ratio;

        console.log(res.windowHeight*2)
        console.log(res.windowWidth*2)
        console.log(viewHeight)
        let top = (res.windowHeight * 2 - viewHeight -80 )/2
        this.setData({
          imgWidth: res.windowWidth * 2,
          imgHeight: viewHeight,
          top: top,
        });
      }
    });
  },
  /************** 1*/


  //**************2 */
  // touchStartHandle(e) {
  //   // 单手指缩放开始，也不做任何处理 
  //   if (e.touches.length == 1) {
  //     console.log("单滑了")
  //     return
  //   }
  //   console.log('双手指触发开始')
  //   // 注意touchstartCallback 真正代码的开始 
  //   // 一开始我并没有这个回调函数，会出现缩小的时候有瞬间被放大过程的bug 
  //   // 当两根手指放上去的时候，就将distance 初始化。 
  //   let xMove = e.touches[1].clientX - e.touches[0].clientX;
  //   let yMove = e.touches[1].clientY - e.touches[0].clientY;
  //   let distance = Math.sqrt(xMove * xMove + yMove * yMove);
  //   this.setData({
  //     'touch.distance': distance,
  //   })
  // },
  // touchMoveHandle(e) {
  //   let touch = this.data.touch
  //   // 单手指缩放我们不做任何操作 
  //   if (e.touches.length == 1) {
  //     console.log("单滑了");
  //     return
  //   }
  //   console.log('双手指运动开始')
  //   let xMove = e.touches[1].clientX - e.touches[0].clientX;
  //   let yMove = e.touches[1].clientY - e.touches[0].clientY;
  //   // 新的 ditance 
  //   let distance = Math.sqrt(xMove * xMove + yMove * yMove);
  //   let distanceDiff = distance - touch.distance;
  //   let newScale = touch.scale + 0.005 * distanceDiff
  //   // 为了防止缩放得太大，所以scale需要限制，同理最小值也是 
  //   if (newScale >= 2) {
  //     newScale = 2
  //   }
  //   if (newScale <= 0.6) {
  //     newScale = 0.6
  //   }
  //   let scaleWidth = newScale * touch.baseWidth
  //   let scaleHeight = newScale * touch.baseHeight
  //   // 赋值 新的 => 旧的 
  //   this.setData({
  //     'touch.distance': distance,
  //     'touch.scale': newScale,
  //     'touch.scaleWidth': scaleWidth,
  //     'touch.scaleHeight': scaleHeight,
  //     'touch.diff': distanceDiff
  //   })
  // },
  // load: function (e) {
  //   // bindload 这个api是<image>组件的api类似<img>的onload属性 
  //   this.setData({
  //     'touch.baseWidth': e.detail.width,
  //     'touch.baseHeight': e.detail.height,
  //     'touch.scaleWidth': e.detail.width,
  //     'touch.scaleHeight': e.detail.height
  //   });
  // },
  //******************* */
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
    return {
      title: this.data.data.doc_title,
      path: '/pages/pictureDetails/pictureDetails?imgId=' + this.data.data.doc_id,
      desc: this.data.data.describe,
      success: function (res) {
      }
    }
  }
})