const app = getApp();
var imglist = require('../../utils/imglist.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    getTopKeywordUrl:'app/getTopKeyword',
    getWorksListUrl:'app/serach',
    search: true,
    searchTop:true,
    list: true,
    text:true,   //搜索区域
    page:0,
    topPage:0,
    keyword: '',
    history: [],
    searchTop: [],
    images:[],
    show: 1,
    dataList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onswitch();
    let thiss = this;
    wx.getStorage({
      key: "histortInfo",
      success: function (res) {
        if (res.data.length==0){
          
          

          thiss.setData({search:false});
        }

        thiss.setData({ history:res.data})
      }
    });
    imglist.getSystemInfo(this);
    wx.setNavigationBarTitle({
      title: '搜索'
    });
  },

  // 取消
  onclear: function (e) {
    this.setData({
      search: false,
      list: true,
    });
    wx.setStorage({
      key: "histortInfo",
      data: []
    });

  },
  //获取焦点
  onfocus: function (e) {
    this.setData({
      list: false,
      text:true
    });
  },
  getTopKeyword:function(data){
    if(data.code==0){
      this.setData({
        searchTop:data.data
      })
    }
  },
  //换一批
  onswitch:function(e){
    var page = this.data.topPage + 1;
    this.setData({ topPage:page});
    var url = app.domain2 + this.data.getTopKeywordUrl;
    imglist.query(url, { page: page}, this.getTopKeyword);
  },
  //去重
  unique: function (arr) {
    var res = [];
    var json = {};
    for (var i = 0; i < arr.length; i++) {
      if (!json[arr[i]]) {
        res.push(arr[i]);
        json[arr[i]] = 1;
      }
    }
    return res;
  },
  //搜索关键词
  search:function(e){
    let keyword = this.data.keyword;
    keyword = keyword.replace(/^\s+|\s+$/g, "");
    if(keyword == ''){
      wx.showToast({
        title: '请输入关键词',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    this.setData({
      text:false,
      page: 0,
      dataList: [], //新增
    })
    var keywordList = this.data.history
    keywordList.unshift(keyword);
    wx.setStorage({
      key: "histortInfo",
      data: this.unique(keywordList),
    });
    this.loadImages();
  },

  //关键词
  keyword: function (e) {
    var keyword = e.currentTarget.dataset.val
    this.setData({
      keyword: keyword,
      page:0,
      istype:0,
    });
    this.search();
  },
  
  onsearch:function(){
    var keyword = this.data.keyword;
    this.setData({
      keyword: keyword,
      page: 0,
      istype: 0,
    });
    this.search();
  },
  oninput: function (e) {
    this.setData({
      'keyword':e.detail.value
    })
  },
  //完成
  onconfirm: function (event) {
    this.setData({ 
      keyword:event.detail.value,
      page:0
    })
    this.search();
  },

  //点击事件
  onImg: function (e) {
   // var group = e.currentTarget.dataset.group;
    var imgid = e.currentTarget.dataset.id;
    // if (group == 1) {
    //   wx.navigateTo({
    //     url: '/pages/groupDetail/groupDetail?imgId=' + imgid,
    //   })
    //   return false;
    // }
    wx.navigateTo({
      url: '/pages/pictureDetails/pictureDetails?imgId=' + imgid,
    })
  },

  //加载
  loadImages: function () {
    var page = this.data.page + 1;
    var data = {
      page: page,
      keyword: this.data.keyword
    }
    var url = app.domain2 + this.data.getWorksListUrl;
    var thiss = this;

    var data = data;
    wx.request({
      url: url,
      data: data,
      header: getApp().header,
      success: function (res) {
        if (res.data.code == 0) {
          thiss.cloudBaseWorksList(res.data)
          thiss.setData({
            page: page,
            img_count: res.data.data.img_count
          })
        }

      }
    })
  },

  //切换显示方式
  changeview: function (e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      show: this.data.show * id,
      page: 0,
      dataList: []
    })
    this.loadImages()
  },
  //图片加载
  imageLoad: function (e) {
    let imgW = e.detail.width,
      imgH = e.detail.height,
      ratio = imgW / imgH;
    var viewWidth = 710,
      viewHeight = 710 / ratio;
    var image = this.data.images;
    image[e.currentTarget.dataset.index] = {
      width: viewWidth,
      height: viewHeight
    }
    this.setData({
      images: image
    })
  },
  //设置云库产品列表
  cloudBaseWorksList: function (data) {
    if (data.data == undefined){
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    let dataList = this.data.dataList;
    for (var i = 0; i < data.data.length; i++) {
      dataList.push(data.data[i])
    }
    this.setData({
      dataList: dataList
    })

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
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
    
  // }
})