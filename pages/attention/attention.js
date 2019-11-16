var verify = require('../../pages/public/verify/verify.js');
const app = getApp();
Page({
    data: {
        page: 0,
        indicatorDots: true,
        autoplay: true,
        interval: 1000,
        duration: true,
        member_id: "", //登录用户id
        followUrl: 'app/session/changeFollowStatus',   //关注状态
        getFocusListUrl: "app/session/getFocusList", //关注列表url
        listData: [],
    },
    onLoad: function() {
      wx.showNavigationBarLoading();
      this.getFocusListAjax();
      let imgType = {
        id: '',
        name: '全部'
      }
      getApp().imgType = imgType;
    },
    changeFollow: function (e) {
      var thiss = this;
      var userId = e.currentTarget.dataset.userid;
      var key = e.currentTarget.dataset.key;
      var status = e.currentTarget.dataset.status;
      var listData = this.data.listData;
      status = status ? 0 : 1;
      let url = app.domain2 + this.data.followUrl;
      wx.request({
        url: url,
        data: { code: status, userId: userId},
        header:getApp().header,
        success: function (res) {
          if (res.data.code == 0) {
            // listData[key].isfollow = status;
            let data=[];
            for (var i=0;i<listData.length;i++){
              if (listData[i].author_id != userId){
                data.push(listData[i])
              }
            }
            thiss.setData({
              listData: data
            })

          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    },

    list: function (data) {
      var listData = this.data.listData;
      for (var i in data) {
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
    //点击用户
    onuser: function (e) {
      var userId = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/userhome/userhome?userId=' + userId,
      })
    },
    //点击图片
    onImg: function (e) {
      var code = e.currentTarget.dataset.group;
      var id = e.currentTarget.dataset.id;

      // if (code == 1){
      //   wx.navigateTo({
      //     url: '/pages/groupDetail/groupDetail?imgId=' + id,
      //   })
      //   return false;
      // } else 
      if (code == 2){
        wx.navigateTo({
          url: '/pages/worksShow/worksDetails/worksDetails?id=' + id,
        })
        return false;
      }

      wx.navigateTo({
        url: '/pages/pictureDetails/pictureDetails?imgId=' + id,
      })
    },
    getFocusListAjax: function() {
        var _this = this;
        var page = this.data.page + 1;
        wx.request({
            url: app.domain2 + this.data.getFocusListUrl,
            data: {
                code: 1,
                page: page
            },
            header:getApp().header,
            success: function(res) {
              wx.hideNavigationBarLoading()
              if (res.data.code == 0){

                _this.setData({
                  page: page
                });
                _this.list(res.data.data);
              }
            },
            fail:function(res){
              wx.hideNavigationBarLoading()
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
            //重新调用图片评论请求
            this.getPictureComments();
        }
    },
    //分享事件
    share: function() {
        //修改shareActive的值
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

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      getApp().tagPage = 'attention/attention';
      if (!getApp().loginStatus) {
        wx.navigateTo({
          url: '/pages/public/login/login',
        })
      }

    },
    onPullDownRefresh() {
      wx.showNavigationBarLoading();
      this.setData({
        page:0,
        listData: []
      })
      this.getFocusListAjax();
      setTimeout(function(){
        wx.stopPullDownRefresh();
      }, 1000);
    },

});