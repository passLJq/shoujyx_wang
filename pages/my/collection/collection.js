const util = require("../../../utils/util.js");
const app = getApp();
Page({
    data: {
        page: 0,
        indicatorDots: true,
        autoplay: true,
        interval: 1000,
        duration: true,
        member_id: "", //登录用户id
        collectUrl: 'app/session/collect',   //取消收藏
        getFocusListUrl: "app/session/getFocusList", //关注列表url
        listData: [],
    },
    onLoad: function() {
         this.getFocusListAjax();
        //禁止下拉刷新
        // wx.stopPullDownRefresh();
    },
    onuser:function(e){
      var userId = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/userhome/userhome?userId='+userId,
      })
    },
    onImg:function(e){
      var group = e.currentTarget.dataset.group;
      var imgId = e.currentTarget.dataset.id;
      var fileType = e.currentTarget.dataset.type;
      fileType = (fileType==1)?1:0;
      // if (group == 1) {
      //   wx.navigateTo({
      //     url: '/pages/groupDetail/groupDetail?imgId=' + imgId,
      //   })
      //   return false;
      // }

      wx.navigateTo({
        url: '/pages/pictureDetails/pictureDetails?imgId=' + imgId + '&fileType=' + fileType,
      })
    },
    changeCollection: function (e) {
      var thiss = this;
      var userId = e.currentTarget.dataset.userid;
      var docId = e.currentTarget.dataset.id;
      var key = e.currentTarget.dataset.key;
      var status = e.currentTarget.dataset.status;
      var memberId = this.data.memberId;
      var listData = this.data.listData;
      status = 0
      let url = app.domain2 + this.data.collectUrl;
      wx.request({
        url: url,
        data: { memberId: memberId, collect: status, docId: docId},
        header:getApp().header,
        success: function (res) {
          if (res.data.code = "0") {
           // listData[key].isfollow = status;
            listData.splice(key,1)
            thiss.setData({
              listData: listData
            })
          }
        }
      })
    },

    list: function (data) {
      var listData = this.data.listData;
      for (var i = 0; i < data.length; i++) {
        data[i].rank = this.stars(data[i].rank);
        listData.push(data[i])
      }
      this.setData({
        listData: listData
      })
    },
    stars: function (num) {
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
    },

    getFocusListAjax: function() {
        var _this = this;
        var page = this.data.page + 1;
        wx.request({
            url: app.domain2 + this.data.getFocusListUrl,
            data: {
                code: 2,
                page: page
            },
            header: getApp().header,
            success: function(res) {
              if (res.data.code == '0' && res.data.msg =='success'){
                _this.setData({
                  page: page
                });
                _this.list(res.data.data);
              }
            }
        });
    },

    //上拉触底监听
    onReachBottom: function() {
      this.getFocusListAjax()
    },
    //评论信息下一页函数
    commentNext: function() {
        var _this = this;
        if (!_this.data.pictureCommentStop) {
            //修改页码
            _this.setData({
                pictureCommentPage: _this.data.pictureCommentPage += 1
            })
            console.log(123);
            //重新调用图片评论请求
            this.getPictureComments();
        }
    },
    //分享事件
    share: function() {
        this.setData({
            shareActive: "active"
        })
    },
    
    //分享里面的删除事件
    shareDelect: function() {
        //修改shareActive的值
        this.setData({
            shareActive: ""
        })
    },
});