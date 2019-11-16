var imglist = require('../../utils/imglist.js');
const app = getApp()
Page({
  data: {
    //声明变量- start
    loadingCount: 0,
    images: [],
    col1: [],
    col2: [],
    page:0,
    imgType:'',
    istype:1,
  //声明变量- end

    imgTypeName:'全部作品',
    search:false,
    list:true,
    keyword:'',
    typeList:[],
    selectPerson: true,
    getCategoryListUrl:'getCategoryList',
    getWorksListUrl:'getWorksList',
  },

  onLoad: function () {
    getApp().c1 = [];
    getApp().c2 = [];
    
    imglist.getSystemInfo(this)
    this.loadImages();
    var url = app.domain2 + this.data.getCategoryListUrl;
    imglist.query(url, { memberId: this.data.memberId},this.typeList);
    wx.setNavigationBarTitle({
      title: '手机影像'
    });
  },

  onInput:function(e){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  //文件类型
  ontype:function(e){
    getApp().c1 = [];
    getApp().c2 = [];

    var imgType = e.currentTarget.dataset.id;
    var imgTypeName = e.currentTarget.dataset.name;
    this.setData({
      imgTypeName: imgTypeName,
      imgType: imgType,
      page:0,
      istype:0,
     }); 
    this.loadImages();
    getApp().imgIndex = true;
  },

  //点击事件
  onimg:function(e){
    var imgid = e.currentTarget.dataset.imgid;
    var docType = e.currentTarget.dataset.code;
    wx.navigateTo({
      url: '/pages/pictureDetails/pictureDetails?imgId=' + imgid + '&fileType=' + docType,
    })
  },

  //图片
  onImageLoad:function(e){
    var imgdata = imglist.onImageLoad(e,this)
    this.setData({
      loadingCount: imgdata.loadingCount,
      col1: imgdata.col1,
      col2: imgdata.col2
    })
  },

  back:function(data){
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    var loaddata = imglist.loadImages(data.data)
    this.setData({
      loadingCount: loaddata.loadingCount,
      images: loaddata.images
    })
  },
  typeList:function(data){
    this.setData({
      typeList:data.data
    })
  },

  //加载
  loadImages: function (){
    this.setData({
      page: this.data.page+1,
      imgType: this.data.imgType,
    })
    var data={
      page: this.data.page,
      imgType: this.data.imgType,
    }

    var thiss = this;
    var url =app.domain2 + this.data.getWorksListUrl;
    imglist.query(url,data,this.back);
  },



  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.setData({
      istype: 0,
      page:0,
    });
    this.loadImages();
  },



  //点击选择类型
  clickPerson: function () {
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
  mySelect: function (e) {
    // console.log(e.target.dataset.me)
    this.setData({
      selectPerson: true,
    })
  },

  onShow: function () {
    // this.setData({
    //   imgTypeName: getApp().imgType.name,
    //   imgType: getApp().imgType.id,
    //   page: 0,
    //   istype: 0,
    // });
    // this.loadImages();
    // getApp().imgIndex = true;
  },


  onShareAppMessage: function () {
    return {
      title: '手机影像',
      success: function (res) {
        this.message('分享成功')
      }
    }
  },






})