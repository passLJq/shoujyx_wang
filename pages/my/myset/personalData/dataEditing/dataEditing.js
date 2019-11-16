const util = require("../../../../../utils/util.js");
//获取应用实例
const app = getApp();
Page({
  data: {
    updateUserInfoUrl: 'app/session/updateUserInfo',
    indicatorDots: true,
    autoplay: true,
    interval: 1000,
    duration: true,
    getMemberInfoUrl: "app/session/getMemberInfo", //获取个人资料信息url
    grade: {
      //等级相关
      grade: 4, //等级
      list: [], //等级数组
    },
    gender: {
      //选择性别逻辑部分
      active: "",
      text_man: "男",
      text_woman: "女"
    },
    content: {
      //页面回来缓存的数据
      genderName: "男",
      date: "2018-04-08",
      region: ["广东省", "深圳市", "福田区"]
    },
    region: ["广东省", "深圳市", "福田区"],
    getContent: null //页面回来的数据
  },
  onLoad: function() {
    //调用获取关注列表ajax
    this.getMemberInfoAjax();

    // 调用图片评论
    // this.getPictureComments();

    //禁止下拉刷新
    // wx.stopPullDownRefresh();

    this.gradeListFun(3);


  },
  //获取个人信息
  getMemberInfoAjax: function() {

    var _this = this;
    wx.request({
      url: app.domain2 + this.data.getMemberInfoUrl,
      data: {},
      header: getApp().header,
      success: function(res) {

        if (res.data.code == 0) {
          _this.gradeListFun(res.data.data.user_rank)
          _this.setData({
            dataList: res.data.data,
            background: res.data.data.background,
          })

        } else {}
      }
    });
  },

  changeHead: function() {
    //选择图片
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        for (var i = 0; i < res.tempFiles.length; i++) {
          if ((res.tempFiles[i].size / 1024 / 1024) > 19) {
            _this.Prompt('请上传小于20M的图片');
            return false;
          }
        }
        var url = 'app/session/changeHead';
        wx.uploadFile({
          url: getApp().domain2 + url,
          filePath: res.tempFilePaths[0],
          name: 'file',
          formData: {},
          header: getApp().header,
          success: (resp) => {
            if (resp.statusCode == 200) {
              let resData = JSON.parse(resp.data);
              if (resData.code == 0) {
                let dataList = _this.data.dataList;
                dataList.portrait = res.tempFilePaths[0];
                _this.setData({
                  dataList: dataList
                })
              } else {
                util.tips(resData.msg)
              }
            }
          },
        });
      },

    });
  },


  //上拉触底监听
  onReachBottom: function() {

  },



  //性别选择监听函数
  genderSelect: function(e) {

    //让选择性别逻辑盒子显示 active
    var str = "gender.active";
    this.setData({
      [str]: "active"
    });
  },
  genderMan: function(e) {
    var dataList = this.data.dataList;
    dataList.user_sex = e.currentTarget.dataset.gendermark;
    //改变content.genderName的值
    var str = "content.genderName";
    this.setData({
      [str]: e.currentTarget.dataset.gendermark,
      dataList: dataList,
    });

    //让选择性别逻辑盒子隐藏
    var strActive = "gender.active";
    this.setData({
      [strActive]: ""
    });
  },
  //日期选择器
  bindDateChange: function(e) {
    let dataList = this.data.dataList;
    dataList.user_birthday = e.detail.value;
    var str = "content.date";
    //修改content.date的值
    this.setData({
      [str]: e.detail.value,
      dataList: dataList
    });
  },
  //地址选择器
  bindRegionChange: function(e) {
    let dataList = this.data.dataList;
    dataList.address = e.detail.value;
    this.setData({
      region: e.detail.value,
      dataList: dataList
    });
  },

  onUserAddres: function(e) {
    let dataList = this.data.dataList;
    dataList.address = e.detail.value;
    this.setData({
      dataList: dataList
    })
  },

  //弹窗提示
  Prompt: function(content) {
    wx.showToast({
      title: content,
      icon: 'none',
      duration: 2000
    });
  },


  //保存按钮
  bindSave: function() {
    var data = this.data.dataList;
    let userName = data.user_name;
    console.log(userName)
    userName = userName.replace(/^\s+|\s+$/g, "");
    if (!userName) {
      this.Prompt('昵称不能为空');
      return false;
    }

    wx.request({
      url: app.domain2 + this.data.updateUserInfoUrl,
      data: data,
      header: getApp().header,
      success: function(res) {
        if (res.data.code == 0) {
          wx.navigateBack({
            delta: 1
          })
        } else {
          util.tips(res.data.msg)
        }
      }
    });

  },
  //等级函数
  gradeListFun: function(grade) {
    var str = "";
    var listCache = [];
    for (var i = 0; i < 5; i++) {
      if (i < grade) {
        listCache.push(1);
      } else {
        listCache.push(0);
      }
    }
    var list = "grade.list";
    this.setData({
      [list]: listCache
    });
  },


  //个人封面删除按钮
  imgDelect: function(e) {
    const index = e.currentTarget.dataset.imgindex;
    let background = this.data.background;
    background.splice(index, 1);
    this.setData({
      background: background
    })

    //根据索引值删除对应的值

  },

  changeBackground: function() {
    wx.navigateTo({
      url: '../selectImg/selectImg',
    })
  },
  //获取图片 相机或者本地相册
  getPicture: function() {
    var _this = this;
    //调用wx.chooseImage
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        //追加到哪里去
        var background = _this.data.background;
        background = tempFilePaths[0];
        _this.setData({
          background: background
        })
      }
    })
  },
  //用户名称
  onUserName: function(e) {
    let dataList = this.data.dataList;
    dataList.user_name = e.detail.value;
    this.setData({
      dataList: dataList
    })
  },
  //真是姓名
  onRealName: function(e) {
    let dataList = this.data.dataList;
    dataList.realName = e.detail.value;
    this.setData({
      dataList: dataList
    })
  },
  //手机
  onPhone: function(e) {
    let dataList = this.data.dataList;
    dataList.user_phone = e.detail.value;
    this.setData({
      dataList: dataList
    })
  },
  //邮箱
  onEmail: function(e) {
    let dataList = this.data.dataList;
    dataList.email = e.detail.value;
    this.setData({
      dataList: dataList
    })
  },
  onIdCard: function(e) {
    let dataList = this.data.dataList;
    dataList.user_idCard = e.detail.value;
    this.setData({
      dataList: dataList
    })
  },

  //签名
  onUserProfile: function(e) {
    let dataList = this.data.dataList;
    dataList.user_profile = e.detail.value;
    this.setData({
      dataList: dataList
    })
  },
  //qq
  qq: function(e) {
    let dataList = this.data.dataList;
    dataList.qq = e.detail.value;
    this.setData({
      dataList: dataList
    })
  },
  //微信
  weixin: function(e) {
    let dataList = this.data.dataList;
    dataList.weixin = e.detail.value;
    this.setData({
      dataList: dataList
    })
  },
  //微博
  weibo: function(e) {
    let dataList = this.data.dataList;
    dataList.weibo = e.detail.value;
    this.setData({
      dataList: dataList
    })
  },
  //支付宝
  alipay: function(e) {
    let dataList = this.data.dataList;
    dataList.alipayname = e.detail.value;
    this.setData({
      dataList: dataList
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (getApp().changeBackground) {

      let dataList = this.data.dataList;
      dataList.background = getApp().changeBackground;
      this.setData({
        dataList: dataList,
        background: getApp().changeBackground
      })
    }

  },


});