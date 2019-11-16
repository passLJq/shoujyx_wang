var imglist = require('../../../../utils/imglist.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selectd:0,
    switchval: -1,
    page: 0,
    getCloudBaseWorksListUrl: 'app/session/getCloudBaseWorksList',
    recoveryUrl: 'app/session/recovery',
    dataList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    imglist.getSystemInfo(this)
    this.setData({
      albumId: options.albumId
    })
    this.getCloudBaseWorksList();
    wx.setNavigationBarTitle({
      title: '回收站'
    });
  },

  selectImg: function (e) {
    let index = e.currentTarget.dataset.id;
    let val = e.currentTarget.dataset.val;
    let img = e.currentTarget.dataset.img;
    let dataList = this.data.dataList;
    if (img == 1){
      dataList[index].val = 0
    }else{
      dataList[index].val = 1
    }
    this.setData({
      dataList: dataList,
    })
  },

  selectd:function(){
    let selectd = this.data.selectd;
    selectd = (selectd==1)?0:1;

    console.log(selectd)
    let dataList = this.data.dataList;
    for (var i = 0; i < dataList.length;i++){
      dataList[i].val = selectd;
    }
    this.setData({
      dataList:dataList,
      selectd: selectd
    })
  },
  //情况回收站
  delAll:function(){
    let dataList = this.data.dataList;
    this.query(2)
  },

  //还原，删除
  restore:function(e){
    let code = e.currentTarget.dataset.code;
    let dataList = this.data.dataList;
    let imgId = [];
    let index = [];
    for (var i = 0; i < dataList.length; i++){
      if (dataList[i].val){
        imgId.push(dataList[i].doc_id)
        index.push(i)
      }
    }
    let imgStr = imgId.join(",");
    if (!imgStr){
      wx.showToast({
        title: '请选择文件',
        icon: 'none',
        duration: 2000
      })
    }
    this.query(code,imgStr,index)
  },

  query: function (code, imgStr='', index='') {
    var _this = this;
    let url = getApp().domain2 + this.data.recoveryUrl
    var data = { imgId: imgStr, code:code}
    wx.request({
      url: url,
      data: data,
      header: getApp().header,
      success: function (res) {
        if (res.data.code == 0) {

          _this.cleanImg(index)
            // _this.setData({
            //   selectd: 0,
            //   switchval: -1,
            //   page: 0,
            //   dataList: [],
            // })
            // _this.getCloudBaseWorksList();
        }
      }
    })
  },

  cleanImg: function (index){
    if(!index){
      this.setData({
        dataList: ''
      })
      return false;
    }
    let dataList = this.data.dataList;
    for(var i=0;i<index.length;i++){
      dataList.splice(index[i]-i,1)
    }
    // for (var item in index) {
    //   dataList.splice(index[item],1);
    //   console.log(index[item])
    // }
    this.setData({
      dataList: dataList
    })
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
    let dataList = this.data.dataList;
    for (var i = 0; i < data.data.length; i++) {
      dataList.push(data.data[i])
    }
    this.setData({
      dataList: dataList
    })
    // console.log(dataList)
  },

  //获取云库产品列表
  getCloudBaseWorksList: function () {
    var thiss = this;
    var url = app.domain2 + this.data.getCloudBaseWorksListUrl;
    var page = this.data.page + 1;
    var data = {page: page, albumId: this.data.albumId}
    wx.request({
      url: url,
      data: data,
      header: getApp().header,
      success: function (res) {

        if (res.data.code == 0) {

          thiss.cloudBaseWorksList(res.data.data)
          thiss.setData({
            page: page,
            img_count: res.data.data.img_count
          })
        }

      }
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