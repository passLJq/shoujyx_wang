// pages/activity/vote/vote.js.js
var aaa = require('../../../utils/watch.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexNum: 0,
    imgUrls:[
      'http://image.91sjyx.com/sjyx/activity/vote20181117/vote2.png',
      'http://image.91sjyx.com/sjyx/activity/vote20181117/vote1.png',
      'http://image.91sjyx.com/sjyx/activity/vote20181117/homePage.jpg'
    ],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgList:[],
    imgPreviewList:[],
    indicatorDots: true,
    autoplay:true,
    circular:true,
    // scrollY:true,
    // scrollAnimation:true,
    interval: 5000,
    duration: 1000,
    lazyLoad:true,
    disButton:false,
    showModal:false,
    imgListNull:false,
    timeEnd:true,
    arryImg:[false,true],
    topNum:0,
    _num:1,
    timeDay:'00',
    timeHour:'00',
    timeMinute:'00',
    timeSecond:'00',
    demoHeight:"400",
    queryContent:'',
    wxAvatarUrl:'',
    wxNickName:'',
    dataNum:[],
    imgShow:[],
    count:0,
    aa:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.showTime()
    this.newestVote()
    this.getUserInfo()
    wx.showLoading({
      title: '加载中',
    })
  },
  //获取用户信息
  getUserInfo:function(){
    var _this=this
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              console.log("用户信息",res.userInfo)
              _this.setData({
                wxAvatarUrl:res.userInfo.avatarUrl,
                wxNickName:res.userInfo.nickName
             })
            }
          })
        }
      }
    })
  },
  bindGetUserInfo (e) {
    // console.log('获取的用户信息触发几次',e.detail.userInfo)
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    // console.log("id的只是什么",id)
    if(this.data.wxAvatarUrl==''||this.data.wxNickName==''){
      // console.log('1111111')
      this.setData({
        wxAvatarUrl:e.detail.userInfo.avatarUrl,
        wxNickName:e.detail.userInfo.nickName
      })
      this.votePic(this.data.wxAvatarUrl,this.data.wxNickName,id,index)
    }
    // else{
    //   console.log('2222222')
    //   this.votePic(this.data.wxAvatarUrl,this.data.wxNickName,id,index)
    // }
  },
  buttonTrigger:function(e){
    if(this.data.wxAvatarUrl==''||this.data.wxNickName==''){

    }else{
      var id = e.currentTarget.dataset.id;
      var index = e.currentTarget.dataset.index;
      this.votePic(this.data.wxAvatarUrl,this.data.wxNickName,id,index)
    }
    
  },
  //切换动态
  menuClick:function(e){
    // console.log(e)
    this.setData({
       _num:e.currentTarget.dataset.num
    })
  },
  goRule:function(){
    wx.navigateTo({
      url: '/pages/activity/rule/rule',
    })
  },
  showTime:function(){
    // console.log("时间到了吗")
    var _this=this
    var time_end = new Date("2018/12/09 23:59:59"); // 设定结束时间
    time_end = time_end.getTime();
    var time_now = new Date(); // 获取当前时间
    time_now = time_now.getTime();
    var time_distance = time_end - time_now; // 结束时间减去当前时间
    if(time_distance<=0){
      this.setData({
        timeEnd: false,
      })
    }
    var int_day, int_hour, int_minute, int_second;
    if(time_distance >= 0){
      // 天时分秒换算
      int_day = Math.floor(time_distance/86400000)
      time_distance -= int_day * 86400000;
      int_hour = Math.floor(time_distance/3600000)
      time_distance -= int_hour * 3600000;
      int_minute = Math.floor(time_distance/60000)
      time_distance -= int_minute * 60000;
      int_second = Math.floor(time_distance/1000)
      
      // 时分秒为单数时、前面加零站位
      if(int_hour < 10)
      int_hour = "0" + int_hour;
      if(int_minute < 10)
      int_minute = "0" + int_minute;
      if(int_second < 10)
      int_second = "0" + int_second;
       
      // 显示时间
      this.setData({
        timeDay: int_day,
        timeHour: int_hour,
        timeMinute: int_minute,
        timeSecond: int_second,
      })
      // if(time_end <= time_now){
      //   // console.log("倒计时3")
      //   _this.showTime()
      //   this.setData({
      //     timeEnd: false,
      //   })
      // }
      if(time_end > time_now){
        // console.log("倒计时1")
        setTimeout(function(){
          _this.showTime()
        },1000);
      }
     }
  },
  //最新投票
  newestVote:function(){
    let _this = this
    let url = getApp().domain2 + "/app/clubPicList"
    let data = {type:"1"}
    wx.showLoading({
      title: '加载中',
    })
    // this.setData({
    //   indexNum:0
    // })
    this.goTop()
    wx.request({
      url: url,
      data: data,
      header: wx.getStorageSync('sessionId'),
      success: function (res) {
        console.log("最新投票",res)
        if(res.data.code == 0){
          _this.setData({
            indexNum: 0
          })
          _this.handleDataIndex(res.data.data)
          _this.handleDataimg(res.data.data)
         
          // _this.setData({
          //   imgList:res.data.data,
          //   imgListNull:false
          // })
          _this.handlePreviewImg(_this.data.imgList)
          // _this.handleDataIndex(_this.data.imgList)
          _this.imgShow(_this.data.imgList)
          setTimeout(function(){
            wx.hideLoading()
          },500)
          // console.log("最新投票imgListimgList",_this.data.imgList)
        }
      }
    })
  },
  //实时榜单
  realTimeList:function(){
    let _this = this
    let url = getApp().domain2 + "/app/clubPicList"
    let data = {type:"3"}
    wx.showLoading({
      title: '加载中',
    })
    // this.setData({
    //   indexNum:0
    // })
    this.goTop()
    wx.request({
      url: url,
      data: data,
      header: wx.getStorageSync('sessionId'),
      success: function (res) {
        console.log("实时榜单1",res)
        if(res.data.code == 0){
          _this.setData({
            indexNum: 0
          })
          _this.handleDataIndex(res.data.data)
          _this.handleDataimg(res.data.data)
          // _this.setData({
          //   imgList:res.data.data,
          //   imgListNull:false
          // })
          
          _this.handlePreviewImg(_this.data.imgList)
          // _this.handleDataIndex(_this.data.imgList)
          _this.imgShow(_this.data.imgList)
          // console.log("实时榜单2",_this.data.imgList)
          setTimeout(function(){
            wx.hideLoading()
          },500)
        }
      }
    })
  },
  //编号排序
  numberSort:function(){
    let _this = this
    let url = getApp().domain2 + "/app/clubPicList"
    let data = {type:"2"}
    wx.showLoading({
      title: '加载中',
    })
    // this.setData({
    //   indexNum:0
    // })
    this.goTop()
    wx.request({
      url: url,
      data: data,
      header: wx.getStorageSync('sessionId'),
      success: function (res) {
        console.log("编号排序1",res)
        if(res.data.code == 0){
          _this.setData({
            indexNum: 0
          })
          _this.handleDataIndex(res.data.data)
          _this.handleDataimg(res.data.data)
          // _this.setData({
          //   imgList:res.data.data,
          //   imgListNull:false
          // })
          
          _this.handlePreviewImg(_this.data.imgList)
          // _this.handleDataIndex(_this.data.imgList)
          _this.imgShow(_this.data.imgList)
          setTimeout(function(){
            wx.hideLoading()
          },500)
          // console.log("编号排序2",_this.data.imgList)
        }
      }
    })
  },
  handleDataimg:function(e){
    var b = [];
    var result = [];
    var k = 0;
    if(e===undefined||e.length == 0){
      return
    }
    for(var i = 0; i<e.length; ++i){
      if(i%30 == 0){
          b = [];
          for(var j = 0; j<30; ++j){
              if(e[i+j] == undefined){
                  continue;
              } else{
                  b[j] = e[i+j];
              }
          }
          result[k] = b;
          k++;
      }
    }
    // console.log('resultresult',result)
    this.setData({
      result:result,
      imgList:[...result[0]],
      imgListNull:false
    })
    // console.log("%%%%%%%%%%%%%%%%%%%%",result)
    // console.log("%%%%%%%%%%%%%%%%%%%%",this.data.imgList)
  },
  //获取输入框的内容
  inputBind:function(e){
    // console.log("输入框",e)
    this.setData({
      queryContent:e.detail.value
    })
  },
  //搜索
  searchSure:function(){
    let _this = this
    let url = getApp().domain2 + "/app/searchVotePic"
    let data = {content:this.data.queryContent}
    if(this.data.queryContent ==''||this.data.queryContent == undefined){
      // console.log("进来了吗")
      return
    }
    wx.request({
      url: url,
      data: data,
      header: wx.getStorageSync('sessionId'),
      success: function (res) {
        // console.log("搜索的数据1",res)
        
        if(res.data.code == 0){
          
          if (res.data.data === undefined || res.data.data.length == 0) {
            // console.log("搜索为空")
            // _this.handleDataimg(res.data.data)
            _this.setData({
              imgList:res.data.data,
              imgListNull:true
            })
          }else{
            // console.log("搜索不为空")
            // _this.setData({
            //   imgList:res.data.data,
            //   imgListNull:false
            // })
            _this.handleDataimg(res.data.data)
            _this.handlePreviewImg(_this.data.imgList)
            _this.handleDataIndex(_this.data.imgList)
            _this.imgShow(_this.data.imgList)
          }
          
          // console.log("搜索的数据2",_this.data.imgList)
        }
      }
    })
  },
  //投票
  votePic:function(x,y,z,q){
    let _this = this
    let url = getApp().domain2 + "/app/votePic"
    let data = {headImgUrl:x,nickName:y,picId:z}

    // if(this.data.imgList==3){
      
    //   _this.setData({
    //     showModal: true,
    //     [`imgList[${q}].num`]: 3,
    //     dataNum:0
    //   })
    //   console.log("值1",this.data.dataNum)
    // }else{
      
    //   _this.setData({
    //     [`imgList[${q}].voteNum`]: _this.data.imgList[q].voteNum+1,
    //     dataNum:this.data.dataNum+=1
    //   })
    //   console.log("值2",this.data.dataNum)
    // }
    // if(this.data.imgList[q]==dataNum){
    //   _this.setData({
    //     showModal: true,
    //     [`imgList[${q}].num`]: 3,
    //     dataNum:0
    //   })
    //   console.log("值1",this.data.dataNum)
    // }else{
      
    //   _this.setData({
    //     [`imgList[${q}].voteNum`]: _this.data.imgList[q].voteNum+1,
    //     dataNum:this.data.dataNum+=1
    //   })
    //   console.log("值2",this.data.dataNum)
    // }
    _this.setData({
      [`dataNum[${q}]`]: _this.data.dataNum[q]+1,
    })
    // console.log(_this.data.dataNum[q])
    console.log('_this.data.dataNum[q]',_this.data.dataNum[q])
    if(_this.data.dataNum[q]==3){
      _this.setData({
        [`imgList[${q}].num`]: 3,
        // showModal: true,
      })
    }else{
     
    }
    
    wx.request({
      url: url,
      data: data,
      header: wx.getStorageSync('sessionId'),
      success: function (res) {
        // console.log("投票返回来的数据1",res)
        console.log("res.data.data.status",res.data.data.status)
        if(res.data.code == 0){
          if(res.data.data.status==1){
            _this.setData({
              [`imgList[${q}].voteNum`]: _this.data.imgList[q].voteNum+1,
            })
            // _this.setData({
            //   [`imgList[${q}].voteNum`]: _this.data.imgList[q].voteNum+1,
            // })
            wx.showToast({
              title: '投票成功',
              image:'/images/selectd.png',
              duration: 2000
            })
            
          }else if(res.data.data.status == -1){
            // console.log('投票活动未到')
            wx.showToast({
              title: '投票活动未到',
              image:'/images/upload-del.png',
              duration: 2000
            })
            _this.setData({
              [`imgList[${q}].num`]: 3,
            })
          }else if(res.data.data.status == -2){
            // console.log('投票活动已结束')
            wx.showToast({
              title: '投票活动已结束',
              image:'/images/upload-del.png',
              duration: 2000
            })
            _this.setData({
              [`imgList[${q}].num`]: 3,
            })
          }else{
            // wx.showToast({
            //   title: '投票次数用完',
            //   image:'/images/upload-del.png',
            //   duration: 2000
            // })
            // wx.showModal({
            //   title: '温馨提醒',
            //   content: '1幅作品1天最多投3票，今天的投票到达上线，您还可以为其他作品投票哦!',
            //   cancelText:'关闭',
            //   confirmText:'确认',
            //   confirmColor:'#F25C4D',
            //   success (res) {
            //     if (res.confirm) {
            //       console.log('用户点击确定')
            //     } else if (res.cancel) {
            //       console.log('用户点击取消')
            //     }
            //   }
            // })
            // console.log('你为什么进来了')
            _this.setData({
              // showModal: true,
              [`imgList[${q}].num`]: 3,
            })
          }
        }
      }
    })
  },
  //处理图片的预览
  handlePreviewImg:function(e){
    let imgListPre=[]
    e.map(function(event){
      // console.log('event',event)
      let a = event.picUrl.split("?");
      // console.log("a的值是",a)
      imgListPre.push(a[0])
    })
    this.setData({
      imgPreviewList:imgListPre
    })
  },
  handleDataIndex:function(e){
    let imgListPre=[]
    for(let i = 0;i < e.length;i++){
      imgListPre.push(0)
    }
    this.setData({
      dataNum:imgListPre
    })
    // console.log("dataNumdataNumdataNum+++++",this.data.dataNum)
  },
  //图片懒加载
  imgShow:function(e){
    let imgListPre=[]
    for(let i = 0;i < e.length;i++){
      imgListPre.push(false)
    }
    this.setData({
      imgShow:imgListPre
    })
    // console.log("imgShow+++++",this.data.imgShow)
  },

  imgPreview:function(event){
    var src = event.currentTarget.dataset.src;//获取data-src
    var index = event.currentTarget.dataset.index;
    var imgList = event.currentTarget.dataset.list;//获取data-list
    wx.previewImage({
      // current: src, // 当前显示图片的http链接
      current:imgList[index],
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  goHome:function(){
    wx.reLaunch({
      url: '/pages/img/img'
    })
  },
  goMobileMatch:function(){
    wx.reLaunch({
      url: '/pages/activity/matchdetail/matchdetail?id=51',
    })
  },
  //获取滚动条当前位置
  scrolltoupper:function(e){
    
    
  },
  countIndex:function (offetHight, scrollTop, height, colunm) {
    // 单例获取屏幕宽度比
    // if (!countIndex.pix) {
    //     try {
    //       let res = wx.getSystemInfoSync()
    //       countIndex.pix = res.windowWidth / 375
    //     } catch (e) {
    //       countIndex.pix = 1
    //     }
    // }
    // let scroll = scrollTop - offetHight * countIndex.pix
    // let hei = height * countIndex.pix
    // return scroll > 0 ? Math.floor(scroll / hei) * colunm : 0
  },
  // onPageScroll: function (res) {
  //   console.log('scrollTopscrollTop++++=',res.scrollTop);
  // },
  goTop: function (e) {  // 一键回到顶部
    this.setData({
      topNum: this.data.topNum = 0
    });
  },

   /**
     * 弹窗
     */
    // showDialogBtn: function() {
    //   this.setData({
    //     showModal: true
    //   })
    // },
      /**
     * 隐藏模态对话框
     */
    hideModal: function () {
      this.setData({
        showModal: false
      });
    },
    onCancel: function () {
      this.hideModal();
    },
       /**
     * 对话框确认按钮点击事件
     */
    onConfirm: function () {
      this.hideModal();
    },











  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
    setTimeout(function(){
      wx.hideLoading()
    },2000)
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
    console.log('eeeeeeee')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('aaaaaaaa')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // console.log('111')
    this.onLoad()
    this.setData({
      _num: 1
    });
    setTimeout(function(){
      wx.stopPullDownRefresh()
    },3000)
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // console.log(222)
    if(this.data.imgList == 0 ||this.data.imgList.length===0||this.data.imgList.length===1){
      return
    }
    // var indexNum=this.data.indexNum;

    // if(this.data.indexNum >= 9){
    //   // console.log("大6999999999999")
    // }else{
      var indexNum=this.data.indexNum;
      indexNum++;
      this.setData({
        indexNum: indexNum
      })
      // console.log(indexNum)
      var result=this.data.result[this.data.indexNum];
      var imgList=this.data.imgList;
      imgList.push(...result)
      //console.log(imgList,222222222,result)
      // console.log(imgList,222222222,this.data.indexNum)
      this.setData({
        imgList: imgList
      })
      this.handlePreviewImg(this.data.imgList)
      // this.handlePreviewImg(this.data.imgList)
      // this.handleDataIndex(this.data.imgList)
      this.imgShow(this.data.imgList)
    //}
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '第五届中盈广场杯',
    }
  }
})