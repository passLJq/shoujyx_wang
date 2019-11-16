var col1H = 0;
var col2H = 0;
function getSystemInfo(thiss){
  wx.getSystemInfo({
    success: (res) => {
      let ww = res.windowWidth;
      let wh = res.windowHeight;
      let imgWidth = ww * 0.48;
      let scrollH = wh;
      thiss.setData({
        scrollH: scrollH,
        imgWidth: imgWidth
      });
      return 1;
    }
  });
}

function query(url, data, callback) {
  let thiss = this;
  wx.request({
    url: url,
    data: data,
    header: wx.getStorageSync('sessionId'),
    success: function (res) {
      callback(res.data);
      // var loaddata = imglist.loadImages(res.data.data)
      // thiss.setData({
      //   loadingCount: loaddata.loadingCount,
      //   images: loaddata.images
      // })
    }
  })
}

function stars(num) {
  var num = num.toString().substring(0, 1);
  var array = [];
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1);
    }
    else {
      array.push(0);
    }
  }
  return array;
}



function loadImages(images) {
  getApp().imgCount = 0;
  getApp().imgPageCount = images.length;
  getApp().a1 = [];
  getApp().a2 = [];
  getApp().b1 = [];
  getApp().b2 = [];
  let baseId = "img-";

  for (let i = 0; i < images.length; i++) {
   // images[i].id = baseId + "-" + i;
    images[i].id = i;
  }
  
  var data =  {
    loadingCount: images.length,
    images: images
  };
  return data;
}

function onImageLoad(e,thiss) {

  getApp().imgCount ++;
  let index = e.currentTarget.dataset.id;
// console.log(index)
  let oImgW = e.detail.width;         //图片原始宽度
  let oImgH = e.detail.height;        //图片原始高度
  let imgWidth = thiss.data.imgWidth;  //图片设置的宽度
  let scale = imgWidth / oImgW;        //比例计算
  let imgHeight = oImgH * scale;      //自适应高度

  let images = thiss.data.images;
  let imageObj = null;

   imageObj = images[index]

  imageObj.height = imgHeight;

  let loadingCount = thiss.data.loadingCount - 1;
  let istype = thiss.data.istype;
  if (istype != 1) {
    thiss.setData({
      col1:[],
      col2:[],
      istype:1,
    })
  }
  let col1 = thiss.data.col1;
  let col2 = thiss.data.col2;



  if (col1H <= col2H) {
    col1H += imgHeight;
    col1.push(imageObj);
  } else {
    col2H += imgHeight;
    col2.push(imageObj);
  }
  let data = {
    loadingCount: loadingCount,
    col1: col1,
    col2: col2
  };

/*
  if (col1H <= col2H) {
    col1H += imgHeight;
    getApp().a1.push(imageObj);
  } else {
    col2H += imgHeight;
    getApp().a2.push(imageObj);
  }

  if (getApp().imgPageCount == getApp().imgCount){
    for (let i = 0; i < getApp().a1.length;i++){
      getApp().b1[getApp().a1[i].id] = getApp().a1[i];
    }
    for (let i = 0; i < getApp().a2.length; i++) {
      getApp().b2[getApp().a2[i].id] = getApp().a2[i];
    }
    for (let i = 0; i < getApp().imgPageCount;i++){
      if (getApp().b1[i]){
        getApp().c1.push(getApp().b1[i]);
      }
      if (getApp().b2[i]) {
        getApp().c2.push(getApp().b2[i]);
      }
    }

  }

  let data = {
    loadingCount: loadingCount,
    col1: getApp().c1,
    col2: getApp().c2
  };
  */



  if (!loadingCount) {
    data.images = [];
  }
  return data;
}

//获取赛事列表
function activity(url,code,obj) {
  let page = obj.data.page + 1;
  let data = { matchStatus: code, page: page };
  let thiss = obj;
  //获取赛事列表
  wx.request({
    url: url,
    data: data,
    header:getApp().header,
    success: function (res) {
      if (res.data.code == 0) {
        let temp = res.data.data;
        let matchList = thiss.data.matchList;
        for (var i = 0; i < temp.length; i++) {
          matchList.push(temp[i])
        }
        thiss.setData({
          matchList: matchList,
          page: page
        })
      }
    }
  })
}


module.exports = {
  onImageLoad: onImageLoad,
  loadImages:  loadImages,
  getSystemInfo: getSystemInfo,
  query: query,
  activity: activity
}