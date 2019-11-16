const app = getApp()
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    worksShowListUrl: 'app/session/worksShowList',
    page: 0,
    data: [],
    makeUrl: 'app/session/worksShowMake',
    worksDelUrl: 'app/session/worksShowDel',
    isEmpty: true,
    code: 1,

    // 分享
    shareIndex: 0,          // 分享的index
    posterShareShow: false, // 打开分享弹窗
    posertImgHeight: 0,     // 画布高度
    showCan: false,
    worksId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.code == 2) {
      this.setData({
        code: options.code,
      })
    }
    wx.hideShareMenu()
    this.getWorksShowList();
    wx.setNavigationBarTitle({
      title: '我的图文'
    });
    // this.setData({
    //   worksName: worksName
    // })
  },

  // onShowType: function(e) {
  //   let code = e.currentTarget.dataset.type;
  //   this.setData({
  //     code: code,
  //     page: 0,
  //     data: []
  //   })
  //   this.getWorksShowList();
  // },
  cancelPoster() {
    this.setData({
      posterShareShow: false
    })
  },
  //作品添加
  worksMake: function() {
    let code = this.data.code
    getApp().worksShow = []
    // wx.navigateTo({
    //   url: '/pages/upload/upload?type=3&code=' + code,
    // })
    wx.navigateTo({
      url: '/pages/uploadWorks/uploadWorks',
    })
  },
  //编辑
  worksEdit: function(e) {
    getApp().worksShow = [];
    let id = e.currentTarget.dataset.id;
    let code = e.currentTarget.dataset.code;
    // wx.navigateTo({
    //   url: '/pages/worksShow/worksUpload/worksUpload?id='+id,
    // })
    // wx.navigateTo({
    //   url: '/pages/upload/upload?type=3&id=' + id + '&code=' + code,
    // })
    wx.navigateTo({
      url: '/pages/uploadWorks/uploadWorks?id=' + id,
    })
  },

  //删除
  worksDel: function(e) {
    let _this = this;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let url = getApp().domain2 + this.data.worksDelUrl;
    wx.showModal({
      title: '提示',
      content: '你确定要删除吗',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: url,
            header: getApp().header,
            data: {
              worksShowId: id
            },
            success: function(res) {
              if (res.statusCode == 200) {
                if (res.data.code == 0) {
                  let data = _this.data.data;
                  data.splice(index, 1);
                  _this.setData({
                    data: data
                  })
                  // 没有数据则显示空数据
                  if (data && data.length == 0) {
                    _this.setData({
                      isEmpty: false
                    })
                  }
                }
              }
            }
          });
        } else {}
      }
    })
  },
  onimg: function(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/worksShow/worksDetails/worksDetails?id=' + id
      // url: '/pages/worksShow/worksDetails/worksDetails?id=' + id
    })
  },
  //发布
  worksRelease: function(e) {
    let _this = this;
    let id = e.currentTarget.dataset.id;
    let status = e.currentTarget.dataset.status;
    let index = e.currentTarget.dataset.index;
    let code = (status == 1) ? 0 : 1;
    let url = getApp().domain2 + this.data.makeUrl;
    wx.request({
      url: url,
      header: getApp().header,
      data: {
        worksShowId: id,
        code: code
      },
      success: function(res) {
        if (res.statusCode == 200) {
          if (res.data.code == 0) {
            let status = 'data.[' + index + '].status';
            _this.setData({
              [status]: code
            })

          }
        }
      }
    });
  },
  // 获取影集
  getWorkList(code, page) {
    return util.http({
      url: getApp().domain2 + this.data.worksShowListUrl,
      headers: 1,
      data: {
        code,
        page
      }
    })
  },
  getWorksShowList: function() {
    let code = this.data.code;
    let _this = this;
    let url = getApp().domain2 + this.data.worksShowListUrl;
    let page = this.data.page;
    page++;
    Promise.all([this.getWorkList(2, page),this.getWorkList(1, page)]).then(ret => {

      let data = page == 1 ? [] : this.data.data
      ret.forEach(res => {
        if (res.code == 0) {
          data = [...data, ...res.data]
        }
      })
      _this.setData({
        data: data,
        page: page
      }, function () {
        // 没有内容 则显示空数据
        if (_this.data.data.length > 0) {
          _this.setData({
            isEmpty: true
          })
        } else {
          _this.setData({
            isEmpty: false
          })
        }
      })
    })
    // wx.request({
    //   url: url,
    //   header: getApp().header,
    //   data: {
    //     code: code,
    //     page: page
    //   },
    //   success: function(res) {
    //     console.log('res', res.data)
    //     if (res.statusCode == 200) {
    //       if (res.data.code == 0) {
    //         let data = _this.data.data;
    //         let rest = res.data.data;
    //         for (let i in rest) {
    //           data.push(rest[i])
    //         }

    //         _this.setData({
    //           data: data,
    //           page: page
    //         }, function() {
    //           // 没有内容 则显示空数据
    //           if (_this.data.data.length > 0) {
    //             _this.setData({
    //               isEmpty: true
    //             })
    //           } else {
    //             _this.setData({
    //               isEmpty: false
    //             })
    //           }
    //         })
    //       }
    //     }
    //   }
    // });
  },


  onReachBottom: function() {
    this.getWorksShowList();
  },

  //我要办展
  // worksAdd: function() {
  //   wx.navigateTo({
  //     url: '/pages/worksShow/worksUpload/worksUpload'
  //   })
  // },
  //我的影展
  myWorksShow: function() {
    wx.navigateTo({
      url: '/pages/worksShow/worksShowList/worksShowList',
    })
  },
  worksShare(e) {
    this.setData({
      posterShareShow: true,
      shareIndex: e.target.id
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // this.setData({
    //   page: 0,
    //   data: []
    // })
    // this.getWorksShowList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
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
  closeCan(e) {
    let bool = false
    let type = e.currentTarget.dataset.type
    let worksId = 0
    if (type && type == 'open') {
      bool = true
      worksId = this.data.data[e.currentTarget.dataset.id].worksShowId
    }
    this.setData({
      showCan: bool,
      shareIndex: e.currentTarget.dataset.id || 0,
      worksId
    })
  },
  //分享事件 
  onShareAppMessage: function () {
    let _this = this;
    let data = this.data.data;
    let index = this.data.shareIndex

    return {
      title: data[index].worksShowTitle,
      path: '/pages/worksShow/worksDetails/worksDetails?id=' + data[index].worksShowId,
      imageUrl: data[index].image,
      success: function (res) {
        _this.message('分享成功')
      }
    }
  },
})