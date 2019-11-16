// pages/worksShow/worksShow.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    worksShowListUrl:'app/session/worksShowList',
    page:0,
    data:[],
    makeUrl:'app/session/worksShowMake',
    worksDelUrl:'app/session/worksShowDel',
    isEmpty:true,
    code:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.code !=undefined){
      this.setData({
        code: options.code,
      })
    }


    this.getWorksShowList();

    let title = '我的图文';
    let worksName = '影集';
    if (options.code == 2) {
      title = '我的游记';
      worksName = '游记';
    }
    wx.setNavigationBarTitle({
      title: title
    });
    this.setData({
      worksName: worksName
    })

  },


  //作品添加
  worksMake:function(){
    let code = this.data.code;
    getApp().worksShow = [];
    // wx.navigateTo({
    //   url: '/pages/worksShow/worksUpload/worksUpload',
    // })
    wx.reLaunch({
      url: '/pages/upload/upload?type=3&code='+ code,
    })

  },
  //编辑
  worksEdit:function(e){
    getApp().worksShow = [];
    let id = e.currentTarget.dataset.id;
    let code = e.currentTarget.dataset.code;
    // wx.navigateTo({
    //   url: '/pages/worksShow/worksUpload/worksUpload?id='+id,
    // })
    wx.reLaunch({
      url: '/pages/upload/upload?type=3&id='+id+'&code=' + code,
    })
  },

  //删除
  worksDel:function(e){
    let _this = this;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let url = getApp().domain2 + this.data.worksDelUrl;
    wx.showModal({
      title: '提示',
      content: '你确定要删除吗',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: url,
            header: getApp().header,
            data: { worksShowId: id },
            success: function (res) {
              if (res.statusCode == 200) {
                if (res.data.code == 0) {
                  let data = _this.data.data;
                  data.splice(index, 1);
                  _this.setData({
                    data: data
                  })
                }
              }
            }
          });
        } else {
        }
      }
    })
  },
  onimg:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/worksShow/worksDetails/worksDetails?id='+id
    })
  },
  //发布
  worksRelease:function(e){
    let _this = this;
    let id = e.currentTarget.dataset.id;
    let status = e.currentTarget.dataset.status;
    let index =  e.currentTarget.dataset.index;
    let code = (status == 1)?0:1;
    let url = getApp().domain2 + this.data.makeUrl;
    wx.request({
      url: url,
      header: getApp().header,
      data: { worksShowId:id,code:code},
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 0) {
            let status = 'data.['+index+'].status';
            _this.setData({
              [status]: code
            })

          }
        }
      }
    });
  },
  getWorksShowList:function(){
    let code = this.data.code;
    let _this = this;
    let url = getApp().domain2 + this.data.worksShowListUrl;
    let page = this.data.page;
    page++;
    wx.request({
      url: url,
      header: getApp().header,
      data: {code:code, page: page },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 0) {
            let data = _this.data.data;
            let rest = res.data.data;
            for (let i in rest){
              data.push(rest[i])
            }
            if(data.length == 0){
                _this.setData({
                  isEmpty:false
                })
            }
            _this.setData({
              data: data,
              page:page
            })
          }
        }
      }
    });
  },


  onReachBottom:function(){
    this.getWorksShowList();
  },

  //我要办展
  // worksAdd:function(){
  //   wx.navigateTo({
  //     url: '/pages/worksShow/worksUpload/worksUpload'
  //   })
  // },
  //我的影展
  myWorksShow:function(){
    wx.navigateTo({
      url: '/pages/worksShow/worksShowList/worksShowList',
    })
  },

  //分享事件 
  onShareAppMessage: function (e) {
    let _this = this;
    let data = this.data.data;
    let index = e.target.id;
    return {
      title: data[index].worksShowTitle,
      path: '/pages/worksShow/worksDetails/worksDetails?id=' + data[index].worksShowId,
      imageUrl: data[index].image,
      success: function (res) {
        _this.message('分享成功')
      }
    }
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
    wx.showNavigationBarLoading();
    this.setData({
      page: 0,
      data: []
    })
    this.getWorksShowList();
    setTimeout(() => {
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading()
    }, 1000);

  },

})