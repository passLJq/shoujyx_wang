var imglist = require('../../utils/imglist.js');
var util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    //声明变量- start
    loadingCount: 0,
    images: [],
    col1: [], // 左边的图片数组
    col2: [], // 右边的图片数组
    col1H: 0, // 左边图片列表的高度
    col2H: 0, // 右边列表的高度
    page: 0, // 上拉加载的页数
    imgType: '',
    istype: 1,
    //声明变量- end
    worksSwitch: 3,
    imgTypeName: '全部',
    search: false,
    list: true,
    keyword: '',
    typeList: [{
      "backgroundImg": "http://image.91sjyx.com/sjyx/Icon/imgType/hfg.jpg",
      "id": 2,
      "type": "风光"
    }, {
      "backgroundImg": "http://image.91sjyx.com/sjyx/Icon/imgType/sbs.jpg",
      "id": 3,
      "type": "纪实"
    }, {
      "backgroundImg": "http://image.91sjyx.com/sjyx/Icon/imgType/yzx.jpg",
      "id": 7,
      "type": "人像"
    }, {
      "backgroundImg": "http://image.91sjyx.com/sjyx/Icon/imgType/chw.jpg",
      "id": 5,
      "type": "美食"
    }, {
      "backgroundImg": "http://image.91sjyx.com/sjyx/Icon/imgType/wj.jpg",
      "id": 17,
      "type": "微距"
    }, {
      "backgroundImg": "http://image.91sjyx.com/sjyx/Icon/imgType/sp.jpg",
      "id": -1,
      "type": "视频"
    }],
    selectPerson: true,
    getWorksListUrl: 'getWorksList',
    allType: 'http://image.91sjyx.com/sjyx/Icon/imgType/all.jpg',
    // worksShow:'http://image.91sjyx.com/sjyx/Icon/imgType/worksShow.jpg',


    //活动
    imgList: [],
    duration: 500,
    groupTag: false,
    voteSure: false, //投票
    advData: [],
    // 新增首页轮播排序
    banner: [], // 整合好广告和赛事的排序的轮播数据
    // imgArr: '',
    // clearList: 0
  },
  // aa() {
  //   wx.navigateTo({
  //     url: '/pages/test/test',
  //   })
  // },
  onLoad: function() {
    getApp().c1 = [];
    getApp().c2 = [];
    imglist.getSystemInfo(this)
    this.loadImages();
    var url = app.domain2 + 'getCategoryList'
    imglist.query(url, {
      memberId: ''
    }, this.typeList);
    // this.voteShow()
    this.getBanner()
    // 读取广告缓存 end
    wx.setNavigationBarTitle({
      title: '手机影像'
    })
  },
  // 获取轮播
  getBanner() {
    var that = this
    Promise.all([this.advertisement(), this.getShowList()]).then(res => {
      var a = res[0].data.data
      var b = res[1].data.data
      var arr = [...a, ...b]
      this.sortBanner(arr)
    })
  },
  // 对轮播图数据排序
  sortBanner(arr) {
    // 冒泡排序，根据sort字段进行逆序排序，数值越大排越前
    for (var i = 0; i < arr.length - 1; i++) {
      for (var j = 0; j < arr.length - 1 - i; j++) {
        if (arr[j].sort < arr[j + 1].sort) {
          var temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
    this.setData({
      banner: arr
    })
  },
  // 获取赛事 游记 影集的数据
  getShowList() {
    var that = this
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.domain2 + 'homeShowList',
        data: {
          code: this.data.worksSwitch
        },
        header: wx.getStorageSync('sessionId'),
        success: function(res) {
          if (res.data.code == 0) {
            that.setData({
              showList: res.data.data
            })
            resolve(res)
          }
        }
      })
    })
  },
  //广告
  advertisement: function() {
    let _this = this
    let url = getApp().domain2 + "advShow"
    let adv
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        header: wx.getStorageSync('sessionId'),
        success: function(res) {
          if (res.data.code == 0) {
            _this.setData({
              advData: res.data.data
            })
            resolve(res)
          }
        }
      })
    })
  },
  // 广告跳转
  goAdv: function(e) {
    let status = e.currentTarget.dataset.status;
    let linkpath = e.currentTarget.dataset.linkpath;
    if (linkpath !== undefined && linkpath !== '') {
      wx.navigateTo({
        url: '/pages/activity/contestInfo/contestInfo?matchRule=' + linkpath,
      })
    } else {

    }
    console.log(e)
  },
  goPage(e) {
    let path = e.currentTarget.dataset.path
    console.log(path)
    wx.navigateTo({
      url: '/' + path,
    })
  },
  //影集切换
  worksSwitch: function(e) {
    let id = e.currentTarget.dataset.type;
    this.setData({
      worksSwitch: id
    }, () => {
      this.getShowList().then(res => {
        // id=3 如果是赛事的数据则重新排序轮播图
        if (id == 3) {
          this.sortBanner([...this.data.advData, ...res.data.data])
        }
      })
    })
  },
  tourism: function() {
    wx.navigateTo({
      url: '/pages/tourism/tourism',
    })
  },

  //搜索
  onInput: function(e) {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  //更多
  worksMore: function() {
    let id = this.data.worksSwitch;

    if (id == 3) {
      wx.switchTab({
        url: '/pages/activity/activity',
      })
      return false;
    }

    wx.navigateTo({
      url: '/pages/worksShow/worksList/worksList?code=' + id,
    })
  },
  worksAdd: function() {
    let id = this.data.worksSwitch;
    // if(id==3){
    //   wx.reLaunch({
    //     url: '/pages/upload/upload?type=3'
    //   })
    //   return false;
    // }
    getApp().worksShow = [];
    wx.navigateTo({
      url: '/pages/uploadWorks/uploadWorks',
    })
  },
  //文件类型
  ontype: function(e) {
    var imgType = e.currentTarget.dataset.id;
    var imgTypeName = e.currentTarget.dataset.name;
    this.setData({
      imgTypeName: imgTypeName,
      imgType: imgType,
      page: 0,
      istype: 0,
    });
    this.loadImages();
    getApp().imgIndex = true;
  },

  onMatch: function(e) {
    let id = e.currentTarget.dataset.id;
    let status = e.currentTarget.dataset.status;
    // if (status == 1) {
    //   wx.navigateTo({
    //     url: '/pages/activity/examine/matchdetail/matchdetail?matchId=' + id,
    //   })
    // } else if (status == 2) {
    //   wx.navigateTo({
    //     url: '/pages/activity/activityend/matchdetail/matchdetail?matchId=' + id,
    //   })
    // } else {
    //   wx.navigateTo({
    //     url: '/pages/activity/matchdetail/matchdetail?id=' + id,
    //     // url: '/pages/activity/activityend/matchdetail/matchdetail?matchId=' + id,
    //   })
    // }
    wx.navigateTo({
      url: '/pages/activity/matchdetail/matchdetail?matchId=' + id + '&status=' + status,
    })

  },

  //点击事件
  onimg: function(e) {
    // let isDouble = e.currentTarget.dataset.group;
    var imgid = e.currentTarget.dataset.imgid;
    var docType = e.currentTarget.dataset.code;

    // if (isDouble == 1){
    //   wx.navigateTo({
    //     url: '/pages/groupDetail/groupDetail?imgId=' + imgid + '&fileType=' + docType,
    //   })
    //   return false;
    // }
    wx.navigateTo({
      url: '/pages/pictureDetails/pictureDetails?imgId=' + imgid + '&fileType=' + docType,
    })
  },

  showDetail: function(e) {
    var showId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/worksShow/worksDetails/worksDetails?id=' + showId
    })
  },

  goVote: function(e) {
    wx.navigateTo({
      url: '/pages/activity/vote/vote?id=15',
    })
  },

  //图片
  onImageLoad: function(e) {
    var imgdata = imglist.onImageLoad(e, this)
    this.setData({
      loadingCount: imgdata.loadingCount,
      col1: imgdata.col1,
      col2: imgdata.col2
    })
  },

  back: function(data) {
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
    var loaddata = imglist.loadImages(data.data, this)
  },

  //类别列表
  typeList: function(data) {
    this.setData({
      typeList: data.data
    })
  },

  //赛事详情
  matchRule: function() {
    let matchRule = 'https://i.91sjyx.com/content/huawei/index.jsp'
    wx.navigateTo({
      url: '/pages/activity/contestInfo/contestInfo?matchRule=' + matchRule,
    })
  },


  //加载
  loadImages: function() {
    this.setData({
      page: this.data.page + 1,
    })
    var data = {
      page: this.data.page,
      imgType: this.data.imgType,
    }

    var thiss = this;
    var url = app.domain2 + this.data.getWorksListUrl;
    imglist.query(url, data, this.back);
    // this.bindImage(data)
  },
  // bindImage(data) {
  //   // 确保先清空数据再加载新数据
  //   new Promise((resolve, reject) => {
  //     if (data.page == 1) {
  //       let {clearList} = this.data
  //       clearList += 1
  //       this.setData({
  //         clearList
  //       }, () => {
  //         resolve()
  //       })
  //     } else {
  //       resolve()
  //     }
  //   }).then(() => {
  //     util.http({
  //       url: app.domain2 + this.data.getWorksListUrl,
  //       data: {
  //         page: data.page,
  //         imgType: data.imgType
  //       },
  //       headers: 1
  //     }).then(ret => {
  //       if (ret.code == 0) {
  //         this.setData({
  //           imgArr: ret.data
  //         })
  //       } else {
  //         util.tips(ret.msg)
  //       }
  //     })
  //   })

  // },



  //下拉刷新
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.setData({
      istype: 0,
      page: 0,
    });
    this.loadImages();
    this.getShowList().then(res => {
      // id=3 如果是赛事的数据则重新排序轮播图
      if (this.data.worksSwitch == 3) {
        this.sortBanner([...this.data.advData, ...res.data.data])
      }
    })
  },


  onShow: function() {
    getApp().tagPage = 'img/img';
    // this.setData({
    //   imgTypeName: getApp().imgType.name,
    //   imgType: getApp().imgType.id,
    //   page: 0,
    //   istype: 0,
    // });
    // this.loadImages();
    // getApp().imgIndex = true;
  },


  // 貌似无用 ----- start -----

  //点击选择类型
  clickPerson: function() {
    var selectPerson = this.data.selectPerson;
    if (selectPerson == true) {
      this.setData({
        selectPerson: false,
      })
    } else {
      this.setData({
        selectPerson: true,
      })
    }
  },
  //点击切换
  mySelect: function(e) {
    // console.log(e.target.dataset.me)
    this.setData({
      selectPerson: true,
    })
  },

  // 貌似无用 ----- end -----

  onShareAppMessage: function() {
    return {
      title: '手机影像',
      success: function(res) {
        this.message('分享成功')
      }
    }
  },

})