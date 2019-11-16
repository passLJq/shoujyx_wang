const app = getApp();
var imglist = require('../../../utils/imglist.js');
const util = require('../../../utils/util.js')
let reachBottomBindUser = false  // 顾名思义 触底时是加载名单列表还是图片列表
let proTop = 9999   // 列表选项高度
Page({
  data: {
    // info: '',
    onnum: 1,
    istype: 0,
    page: 0,
    showNo: false,
    openInfo: 1, // 是否展开赛事详情 0隐藏 1 未展开 2展开
    data: [],
    status: 1, // 赛事状态 1 评审 2 结束 0 征集
    redNum: 0,
    loadingCount: 0,
    col1: [],
    col2: [],
    col1H: 0,
    col2H: 0,
    showCan: false,  // 海报
    showFooter: true,   // 显示底部按钮
    scrollTop: 0,
    fixPro: false,    //
    isShare: false,   // 是否分享进来的
    timer: null,     // 征集不到一天时的倒计时timer
    countTime: '',    // 倒计时文案
  },
  onLoad: function(options) {
    console.log('options', options)
    // 扫二维码进入的
    if (options.scene) {
      let scene = util.getUrlData(decodeURIComponent(options.scene)) // 解析参数
      options = scene  // 传递给options继续
    }
    var id = options.id || options.matchId
    this.setData({
      matchId: id,
      status: options.status,
      onnum: options.status == 2 ? 4 : options.status == 1 ? 5 : 1
    }, () => {
      imglist.getSystemInfo(this);
      this.matchInfo();
      // 获取赛事图片列表
      this.loadImages();
    })
    // 路由信息只有一个就说明你是分享进来的
    if (getCurrentPages().length == 1) {
      this.setData({
        isShare: true
      })
    }
  },
  onType: function(e) {
    this.setData({
      onnum: e.currentTarget.dataset.code,
      page: 0,
      istype: 0,
      showNo: false,
      redNum: e.currentTarget.dataset.red
    });
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    if (e.currentTarget.dataset.type == 'user') {
      //获取赛事获奖名单 
      this.loadUser()
      reachBottomBindUser = true
    } else {
      this.loadImages()
      reachBottomBindUser = false
    }
    // this.loadImages()
  },
  // 赛事结束的
  loadUser: function() {
    if (this.data.showNo) return
    let matchId = this.data.matchId;
    let page = this.data.page + 1;
    this.setData({
      page: page
    })
    var url = app.domain2 + 'getMatchUserList'
    this.getMatchUser(url, {
      matchId: matchId,
      code: this.data.status,
      page: page
    });
  },
  //获取入围用户列表
  getMatchUser(url, data) {
    let thiss = this;
    wx.request({
      url: url,
      data: data,
      header: getApp().header,
      success: (res) => {
        wx.hideLoading()
        if (res.data.code = "0") {
          var data = res.data.data
          var listData = this.data.data;
          for (var i = 0; i < data.length; i++) {
            data[i].user_rank = this.stars(data[i].user_rank);
            listData.push(data[i])
          }
          this.setData({
            data: listData
          }, () => {
            if (!this.data.data.length || this.data.data.length == 0) {
              this.setData({
                showNo: true
              })
            }
          })
        } else {
          util.tips(res.data.msg)
        }
      }
    })
  },
  //转换等级计算
  stars: function(num) {
    var num = num.toString().substring(0, 1);
    var array = [];
    for (var i = 1; i <= 5; i++) {
      if (i <= num) {
        array.push(1);
      } else {
        array.push(0);
      }
    }
    return array;
  },
  changeFollow: function(e) {
    var thiss = this;
    var userId = e.currentTarget.dataset.userid;
    var key = e.currentTarget.dataset.key;
    var status = e.currentTarget.dataset.status;
    var data = this.data.data;
    status = status == 1 ? 0 : 1;
    let url = getApp().domain2 + 'app/session/changeFollowStatus'
    wx.request({
      url: url,
      data: {
        code: status,
        userId: userId
      },
      header: getApp().header,
      success: function(res) {
        if (res.data.code == "0") {
          data[key].isfollow = status;
          thiss.setData({
            data: data
          })
        }
      }
    })
  },
  //用户列表点击事件
  onList: function(e) {
    var userId = e.currentTarget.dataset.userid;
    // wx.redirectTo
    wx.navigateTo({
      url: '/pages/userhome/userhome' + '?userId=' + userId,
    })
  },
  ontitle: function(e) {
    var imgId = e.currentTarget.dataset.id;
    // wx.redirectTo
    wx.navigateTo({
      url: '/pages/pictureDetails/pictureDetails' + '?imgId=' + imgId,
    })
  },
  // 赛事结束 end


  //获取赛事详细信息
  matchInfo: function() {
    console.log(this.data.data)
    var thiss = this;
    var id = this.data.matchId
    var url = app.domain2 + 'getMatchInfo'
    var data = {
      matchId: id
    }
    wx.request({
      url: url,
      data: data,
      header: getApp().header,
      success:(res) => {
        thiss.setData({
          matchInfo: res.data.data
        }, () => {
          this.countTime(res.data.data.time_status)
          // let that = this
          // wx.createSelectorQuery().select('#matchDesc').boundingClientRect((rect) => {
          //   console.log('rect', rect)
          //   let openInfo = 0
          //   if (rect.height > 100) {
          //     openInfo: 1
          //   }
          //   that.setData({
          //     openInfo
          //   })
          // }).exec()
         setTimeout(() => {
           this.checkTopBox()
         }, 500)
        })
      }
    })
  },
  // 计算剩余时间
  countTime(t) {
    t = Math.floor(t / 1000) /* 剩余秒数 */

    let days = Math.floor(t / (60 * 60 * 24))
    // console.log(this.data.matchInfo.status, days)
    if (this.data.matchInfo.status > 0 || t <= 0 || days > 0) {
      this.setData({
        countTime: this.data.matchInfo.match_status
      })
      return
    }
    this.data.timer = setInterval(function () {
      if (t > 0) {
        let day = Math.floor(t / (60 * 60 * 24))
        let hour = Math.floor(t / (60 * 60)) - (day * 24)
        let minute = Math.floor(t / 60) - (day * 24 * 60) - (hour * 60)
        let second = Math.floor(t) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
        hour = hour < 10 ? '0' + hour : hour
        minute = minute < 10 ? '0' + minute : minute
        second = second < 10 ? '0' + second : second
        this.setData({
          countTime: `距结束还有：${hour}时：${minute}分：${second}秒`
        })
        // console.log(day, hour, minute, second)
      } else {
        clearInterval(this.data.timer)
        this.data.timer = null
        this.setData({
          countTime: '评审中'
        })
      }
      t--
    }.bind(this), 1000)
  },
  // 查询顶部盒子高度
  checkTopBox() {
    const query = wx.createSelectorQuery()
    query.select('#topbox').boundingClientRect()
    query.exec(ret => {
      let res = ret[0]
      console.log('res', res)
      proTop = res.height
    })
  },
  //参赛
  onparticipate: function() {
    var id = this.data.matchId;
    var name = this.data.matchInfo.match_name;
    wx.navigateTo({
      url: '/pages/upload/upload?matchId=' + id + '&name=' + name,
    })
  },

  //赛事详情
  matchRule: function() {
    let matchRule = this.data.matchInfo.contestInfo;
    wx.navigateTo({
      url: '../contestInfo/contestInfo?matchRule=' + matchRule,
    })
  },

  //回调
  back: function(data) {
    console.log('data+++++++++++', data)
    // 是否显示无数据
    var bool = false
    if (data) {
      if ((!data.data.imglist || data.data.imglist.length == 0) && this.data.page == 1) {
        bool = true
      }
    }
    this.setData({
      showNo: bool
    })
    wx.hideLoading()
    var loaddata = imglist.loadImages(data.data.imglist, this)
  },
  //加载图片列表
  loadImages: function() {
    if (this.data.showNo) return
    this.setData({
      page: this.data.page + 1,
    })
    var data = {
      page: this.data.page,
      code: this.data.onnum,
      matchId: this.data.matchId
    }
    var thiss = this;
    var url = app.domain2 + 'getMatchImgList'
    imglist.query(url, data, this.back);
  },

  //点击图片事件
  onimg: function(e) {
    wx.navigateTo({
      url: '/pages/pictureDetails/pictureDetails?imgId=' + e.currentTarget.dataset.imgid,
    })
  },
  //图片处理
  onImageLoad: function(e) {
    var imgdata = imglist.onImageLoad(e, this)
    this.setData({
      loadingCount: imgdata.loadingCount,
      col1: imgdata.col1,
      col2: imgdata.col2
    })
  },
  //请求数据
  query: function(url, data) {
    let thiss = this;
    wx.request({
      url: url,
      data: data,
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.code = "0") {
          thiss.setData({
            info: res.data.data
          })
          wx.setNavigationBarTitle({
            title: res.data.data.user_name
          });
        }

      }
    })
  },
  // 展开内容
  openContent() {
    let openInfo = this.data.openInfo == 1 ? 2 : 1
    this.setData({
      openInfo
    }, () => {
      this.checkTopBox()
    })
  },
  goBack() {
    if (this.data.isShare) {
      wx.reLaunch({
        url: '/pages/img/img',
      })
    } else {
      wx.navigateBack()
    }
  },
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
    if (this.data.timer) {
      clearInterval(this.data.timer)
      this.data.timer = null
    }
  },
  onPageScroll(e) {
    let t = e.scrollTop
    // console.log(t)
    if (t > this.data.scrollTop && this.data.showFooter && t > 50) {
      this.setData({
        showFooter: false
      })
    } else if (t < this.data.scrollTop && !this.data.showFooter) {
      this.setData({
        showFooter: true
      })
    }
    this.data.scrollTop = t

    if (t >= proTop && !this.data.fixPro) {
      this.setData({
        fixPro: true
      })
    } else if (t < proTop && this.data.fixPro) {
      this.setData({
        fixPro: false
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (reachBottomBindUser) {
      this.loadUser()
    } else {
      this.loadImages()
    }
  },

  closeCan(e) {
    let bool = false
    let type = e.currentTarget.dataset.type
    if (type && type == 'open') {
      bool = true
    }
    this.setData({
      showCan: bool
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    this.setData({
      showCan: false
    })
    const path = "pages/activity/matchdetail/matchdetail?id=" + this.data.matchInfo.match_id + '&status=' + this.data.status
    console.log(path)
    return {
      title: this.data.matchInfo.match_name,
      path,
      success: function (res) { }
    }
  }
})