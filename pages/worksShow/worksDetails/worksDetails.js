// pages/worksShow/worksDetails/worksDetails.js
const app = getApp()
const util = require('../../../utils/util.js')
const winWidth = wx.getSystemInfoSync().windowWidth;
const ratepx = 750 / winWidth
/// 获取canvas转化后的rpx
const rate = function(rpx) {
  return rpx / ratepx
}
const innerAudioContext = wx.createInnerAudioContext()
console.log(winWidth, ratepx)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEdit: false, // 是否编辑图文
    id: '', // 影集id
    worksData: '', // 影集数据
    commentList: [], // 评论数据
    commentNum: 0, // 评论数量
    page: 1, // 评论页数
    hasMore: true, // 是否加载更多
    showKbi: 0, // 显示k币
    showComm: false, // 显示评论框
    // comm_uid: '',       // 回复评论的用户id 如果没有则是评论影集
    // comm_uname: '',     // 回复的用户名
    commentIndex: -1, // 当前回复第几条评论 为-1则是评论图文
    commLength: 0, // 当前回复内容的长度
    comm: '', // 当前评论内容
    stars: [0, 0, 0, 0, 0],
    playIng: false, // 是否播放音乐
    showEditMusic: 0, // 底部显示编辑 0 不显示 1 是音乐 2 是封面
    musicList: '', // 音乐列表
    showChoose: false, // 显示图片选择弹窗
    isSubmit: false, // 控制重复提交
    showCan: false,
    coverList: [], // 封面列表
    // addDz: false,
    coverWidth: winWidth,
    coverTop: 0,
    coverLeft: 0,
    isIphoneX: false,
    // imgInfo: [],    // 图文图片的详细信息 用于生成海报时
    showGoodNum: 0,     // 用来显示在下面变化之前的点赞数字
    changeNum: false,   // 切换点赞数字
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.scene)
    if (options.scene) {
      var scene = decodeURIComponent(options.scene)
      scene = util.getUrlData(scene)
      console.log(scene)
      var id = scene.id
    } else {
      var id = options.id || ''
    }
    this.setData({
      id,
      isEdit: options.isEdit && options.isEdit == 1 ? true : false,
      isIphoneX: app.iphoneX
    }, () => {
      // 编辑则直接从app拿数据
      if (this.data.isEdit) {
        // let data = app.worksData || wx.getStorageSync('worksData')
        let data = app.worksData
        let curl = data.coverurl
        data.coverurl = ''
        data.imgList = app.checkHolder(data.imgList)
        this.setData({
          worksData: data
        })
        this.coverSize(curl)
        wx.setNavigationBarTitle({
          title: '预览中',
        })
        this.countStars(data.rank)
        this.getMusicList()
        this.getCover()
        if (data.musicPath) {
          this.getMusic(data.musicPath)
        }
      } else {
        this.bindData()
        this.bindComment()
      }
    })

    innerAudioContext.obeyMuteSwitch = false;
    // setTimeout(() => {
    //   wx.pageScrollTo({
    //     scrollTop: 11100,
    //   })
    // }, 1000)
  },
  // 计算封面高度展示
  coverSize(urls, scrollTop) {
    if (!urls) return
    let url = urls.indexOf('http://tmp') > -1 ? urls : urls.toString().replace('http://', 'https://')
    console.log(url)
    wx.getImageInfo({
      src: url,
      success: res => {
        var scale = res.width / res.height
        var h = rate(500)     // 500rpx的实际高度
        var w = winWidth      // 当前屏幕宽度
        // console.log(h, res)
        var imgH = w / scale  /* */
        if (imgH < h) {
          let s = imgH / h
          w = w / s
          var coverLeft = (w - winWidth) / 2
        } else if (imgH > h) {
          var coverTop = (imgH - h) / 2
        }
        this.setData({
          coverWidth: parseInt(w),
          coverTop: coverTop ? parseInt(coverTop) : 0,
          coverLeft: coverLeft ? parseInt(coverLeft) : 0,
          ['worksData.coverurl']: urls
        }, () => {
          if (scrollTop) {
            setTimeout(() => {
              wx.pageScrollTo({
                // scrollTop: 0,
                selector: '.header',
                duration: 500,
              })
            }, 0)
          }
        })
      }
    })
  },
  // 获取图片详情信息
  // getImageInfo(e) {
  //   // console.log(e)
  //   if (!this.data.isEdit) {
  //     let i = e.currentTarget.dataset.index
  //     this.data.imgInfo[i] = e.detail.width / e.detail.height
  //   }
  // },
  // 计算星星
  countStars(num) {
    console.log(num)
    var stars = []
    for (let i = 1; i <= 5; i++) {
      if (i > num) {
        stars.push(0)
      } else {
        stars.push(1)
      }
    }
    this.setData({
      stars
    })
  },
  // 获取数据
  bindData() {
    // 获取影集数据
    util.http({
      url: app.domain2 + 'worksShowDetail',
      headers: 1,
      data: {
        worksShowId: this.data.id
      }
    }).then(ret => {
      console.log(ret)
      if (ret.code == 0) {
        let data = ret.data
        this.coverSize(data.coverurl)
        data.coverurl = ''
        data.imgList = app.checkHolder(data.imgList) // 检查有没有包含占位的图片
        this.setData({
          worksData: data,
          showGoodNum: data.good_num
        })
        wx.setNavigationBarTitle({
          title: data.title,
        })
        this.countStars(data.rank)
        if (data.musicPath) {
          this.getMusic(data.musicPath)
        }
      }
    })
  },
  // 获取评论数据
  bindComment() {
    util.http({
      url: app.domain2 + 'app/getWorksShowComment',
      headers: 1,
      data: {
        worksShowId: this.data.id,
        page: this.data.page
      }
    }).then(ret => {
      console.log(ret)
      if (ret.code == 0) {
        let data = ret.data
        if (this.data.page == 1) {
          var commentList = [...data.comment]
          var commentNum = data.comment_num
        } else {
          var commentList = [...this.data.commentList, ...data.comment]
          var commentNum = data.comment_num + this.data.commentNum
        }

        this.setData({
          commentList,
          commentNum
        })
        if (!data.comment || data.comment.length <= 0) {
          this.setData({
            hasMore: false
          })
        }
      } else {
        util.tips(ret.msg)
      }
    })
  },
  // 获取封面
  getCover() {
    util.http({
      url: app.domain2 + 'app/session/coverlist',
      headers: 1,
    }).then(ret => {
      if (ret.code == 0) {
        this.setData({
          coverList: ret.data
        })
      } else {
        util.tips(ret.msg)
      }
    })
  },
  // 选择封面
  bindCover(e) {
    let i = e.currentTarget.dataset.index
    let data = this.data.coverList[i]
    console.log(data)
    if (data) {
      this.coverSize(data.coverurl)
      // this.setData({
      //   ['worksData.coverurl']: data.coverurl
      // })
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 500,
      })
    }
  },
  // 获取音乐列表
  getMusicList() {
    util.http({
      url: app.domain2 + 'app/session/musicList',
      data: {
        code: 0,
        page: 1
      },
      headers: 1,
    }).then(ret => {
      if (ret.code == 0) {
        this.setData({
          musicList: ret.data
        })
      } else {
        util.tips(ret.msg)
      }
    })
  },
  // 显示打赏k币 
  showKBox(close) {
    let showKbi = close ? 0 : 1
    this.setData({
      showKbi
    })
  },

  // 评论的
  // 关闭评论框
  cancelComment() {
    this.setData({
      showComm: false
    })
  },
  goComm() {
    this.setData({
      showComm: true
    })
  },
  goComms(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      commentIndex: index,
      showComm: true
    })
  },
  getCommInp(e) {
    this.setData({
      comm: e.detail.value,
      commLength: e.detail.cursor
    })
  },
  // 回复评论ajax
  commentAjax() {
    app.checkLogin()
    if (!this.data.comm) {
      util.tips('评论内容不能为空')
      return
    }
    this.setData({
      showComm: false
    })
    let index = this.data.commentIndex
    // 为-1 表示评论图文
    if (index == -1) {
      this.commentWorks()
      return
    }
    let data = this.data.commentList[index]
    util.http({
      url: app.domain2 + 'app/session/userShowComment',
      headers: 1,
      data: {
        userId: data.user_id,
        commentId: data.comment_id,
        comment: this.data.comm
      }
    }).then(ret => {
      console.log(ret)
      if (ret.code == 0) {
        util.tips('回复成功!')
        this.setData({
          comm: '',
          commLength: 0,
          commentIndex: -1,
          page: 1,
          hasMore: true,
          showComm: false
        }, () => {
          this.bindComment()
        })
      } else {
        util.tips(ret.msg)
      }

    })
  },
  // 评价图文
  commentWorks() {
    util.http({
      url: app.domain2 + 'app/session/worksShowComment',
      headers: 1,
      data: {
        worksShowId: this.data.id,
        comment: this.data.comm
      }
    }).then(ret => {
      if (ret.code == 0) {
        util.tips('评论成功!')
        let commNum = this.data.worksData.comment_num
        this.setData({
          comm: '',
          commLength: 0,
          commentIndex: -1,
          page: 1,
          hasMore: true,
          showComm: false,
          ['worksData.comment_num']: commNum + 1
        }, () => {
          this.bindComment()
        })
      }
    })
  },
  // 评论的 ===== end ======
  // 播放音乐
  getMusic(musicPath) {
    this.setData({
      playIng: true
    }, () => {
      innerAudioContext.stop()
      innerAudioContext.src = musicPath
      innerAudioContext.loop = true
      innerAudioContext.play()
    })
  },
  stopMusic() {
    let playIng = this.data.playIng
    if (!playIng) {
      playIng = true
      this.getMusic(this.data.worksData.musicPath)
    } else {
      playIng = false
      innerAudioContext.stop()
    }
    this.setData({
      playIng
    })
  },
  // 选择音乐
  chooseMusic(e) {
    let index = e.currentTarget.dataset.index
    if (index != -1) {
      let data = this.data.musicList[index]
      this.setData({
        ['worksData.musicPath']: data.musicurl,
        ['worksData.musicId']: data.id
      }, () => {
        this.getMusic(this.data.worksData.musicPath)
      })
    } else {
      this.setData({
        ['worksData.musicPath']: ''
      })
      innerAudioContext.stop()
    }
  },
  //进入更多点赞列表
  onUserList: function() {
    wx.navigateTo({
      url: '/pages/my/myUserList/myUserList?code=5&worksShowId=' + this.data.id
    })
  },
  //更多推荐
  recommendMore: function(e) {
    let code = e.currentTarget.dataset.code;
    wx.navigateTo({
      url: '../worksList/worksList?code=' + code
    })
  },
  recommend(e) {
    wx.navigateTo({
      url: '/pages/worksShow/worksDetails/worksDetails?id=' + e.currentTarget.dataset.id,
    })
  },
  // 点赞
  dianz() {
    app.checkLogin()
    util.http({
      url: app.domain2 + 'app/session/worksShowGood',
      data: {
        worksShowId: this.data.id
      },
      headers: 1
    }).then(ret => {
      console.log(ret)
      if (ret.code == 0) {
        let goodList = this.data.worksData.goodList
        // 用户是否已在点赞用户数组中
        let isConcatUser = goodList.some(item => item.userId == wx.getStorageSync('userId'))
        // 否则添加进数据
        if (!isConcatUser) {
          goodList.push({
            userId: wx.getStorageSync('userId'),
            userHeading: JSON.parse(wx.getStorageSync('userInfo')).avatarUrl
          })
        }
        this.setData({
          ['worksData.goodList']: goodList,
          ['worksData.isGood']: 1,
          ['worksData.good_num']: this.data.worksData.good_num + 1,
        }, () => {
          this.setData({
            changeNum: true
          })
        })
      } else {
        util.tips(ret.msg || ret.message)
      }
    })
  },
  // 关注作者
  goFollow() {
    app.checkLogin()
    let code = this.data.worksData.is_follow == 1 ? 0 : 1
    util.http({
      url: app.domain2 + 'app/session/changeFollowStatus',
      data: {
        code,
        userId: this.data.worksData.user_id
      },
      headers: 1
    }).then(ret => {
      console.log(ret)
      if (ret.code == 0) {
        this.setData({
          ['worksData.is_follow']: code
        })
      } else {
        util.tips(ret.msg)
      }
    })
  },
  // 新建图文
  newWorks() {
    wx.navigateTo({
      url: '/pages/uploadWorks/uploadWorks',
    })
  },
  // 查看图片
  zoom: function(e) {
    if (this.data.isEdit) return
    // wx.getSystemInfo({
    //   success: (res) => {
    //     var w = res.windowWidth;
    //     let img = e.currentTarget.dataset.img;
    //     let title = this.data.worksData.title;
    //     let imgh = e.currentTarget.dataset.h;
    //     let imgw = e.currentTarget.dataset.w;
    //     let scale = imgh / imgw;
    //     let h = w * scale;
    //     wx.navigateTo({
    //       url: '/pages/public/main/main?title=' + title + '&w=' + w + '&h=' + h + '&img=' + img
    //     })
    //   }
    // })
    let img = e.currentTarget.dataset.img
    img = img.split('?')[0]
    let imgArr = []
    this.data.worksData.imgList.forEach(i => {
      if (i.image) {
        imgArr.push(i.image.split('?')[0])
      }
    })
    // console.log(imgArr)
    wx.previewImage({
      current: img,
      urls: imgArr,
    })
  },
  // 设置编辑框
  setChoose(e) {
    let type = e.currentTarget.dataset.type
    this.setData({
      showEditMusic: type
    })
  },
  closeChoose(e) {
    let bool = false
    if (e.currentTarget.dataset.type == 'open') {
      bool = true
    }
    this.setData({
      showChoose: bool
    })
  },
  // 图片选择操作
  chooseHandler(e) {
    let type = e.detail
    if (type != 2) {
      var sourceType = type == 0 ? ['camera'] : ['album'] // album 从相册选图，camera 使用相机，默认二者都有
      console.log(sourceType)
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: sourceType,
        success: res => {
          console.log(res)
          if (res.errMsg == 'chooseImage:ok') {
            if (res.tempFiles[0].size >= 20 * 1024 * 1024) {
              util.tips('选择图片不能大于20m')
            } else {
              this.coverSize(res.tempFiles[0].path, 1)
              // this.setData({
              //   ['worksData.coverurl']: res.tempFiles[0].path
              // })
            }
          } else {
            util.tips('选择图片失败！')
          }
        },
        fail: res => {}
      });
    } else if (type == 2) {
      wx.navigateTo({
        url: '/pages/worksShow/albumSelect/albumSelect?from=uploadWorks&type=justOne',
      })
    }
    this.setData({
      showChoose: false,
      showEditMusic: 0
    })
  },
  // 获取云库图片
  getCloudImg(data) {
    console.log(data)
    let img = data[0]
    this.coverSize(img.image)
    setTimeout(() => {
      wx.pageScrollTo({
        // scrollTop: 0,
        selector: '.header',
        duration: 500,
      })
    }, 500)
    // this.setData({
    //   ['worksData.coverurl']: img.image
    // })
  },
  // 上传封面
  coverUpload() {
    return new Promise((resolve, reject) => {
      // 自定义封面就执行上传 否则直接下一步
      if (this.data.worksData.coverurl && this.data.worksData.coverurl.indexOf('://tmp') > -1) {
        wx.uploadFile({
          url: app.domain2 + 'app/session/coverUpload',
          filePath: this.data.worksData.coverurl,
          name: 'file',
          header: getApp().header || wx.getStorageSync('sessionId'),
          success: ret => {
            ret = JSON.parse(ret.data)
            if (ret.code == 0) {
              this.data.worksData.coverurl = ret.data.coverurl
              resolve()
            } else {
              util.tips(ret.msg || ret.message)
              reject()
            }
          }
        })
      } else {
        setTimeout(() => {
          resolve()
        }, 200)
      }
    })
  },
  // 保存提交
  submit() {
    util.showLoading('保存中...')
    let num = 0
    let path = []
    let imgList = []
    // foreach竟然会改变data里的值 所以用for循环
    let arr = this.data.worksData.imgList
    for (let i = 0; i < arr.length; i++) {
      if (!arr[i].id) {
        path.push(arr[i].image)
        imgList.push({
          id: 0,
          image: '',
          desc: arr[i].desc
        })
      } else {
        let d = util.deepCopy(arr[i])
        // 有id没image地址 则赋予占位图片 显示时判断隐藏占位图片（有文字但没图片）
        if (!d.image) {
          d.image = app.imgHolder
        }
        imgList.push(d)
      }
    }
    // console.log(path.length)
    // console.log(path)
    // console.log(imgList)
    // return
    // 有本地上传的图片就跑upload 没有就直接save
    this.setData({
      isSubmit: true
    })
    let worksShowId = this.data.worksData.isChange == 1 ? this.data.id : ''
    this.coverUpload().then(() => {
      if (path.length > 0) {
        let data = {
          i: 0,
          y: this.data.worksData.imgList.length - path.length, // 有几张云库的图片，方便显示进度条
          path,
          data: {
            code: 2,
            isPublic: 1,
            worksShowId,
            isChange: this.data.worksData.isChange ? this.data.worksData.isChange : 0,
            musicId: this.data.worksData.musicId || 0,
            count: 1,
            imgList: JSON.stringify(imgList),
            worksDesc: this.data.worksData.explain,
            worksTitle: this.data.worksData.title,
            // typeName: "游记",
            spotId: 0,
            coverurl: this.data.worksData.coverurl || 'http://image.91sjyx.com/sjyx/worksData/defaultCover.jpg'
          }
        }
        console.log(worksShowId)
        console.log(data)
        this.worksUpload(data)
      } else {
        this.worksSave(imgList)
      }
    }).catch(() => {
      wx.hideLoading()
      this.setData({
        isSubmit: false
      })
    })
  },
  worksUpload(d) {
    var that = this
    // console.log(d)
    var num = d.i + d.y
    util.showLoading(`${num} / ${this.data.worksData.imgList.length}`)
    // 表示上传完了
    if (num >= this.data.worksData.imgList.length) {
      wx.hideLoading()
      util.tips('保存成功')
      setTimeout(() => {
        util.exec('pages/uploadWorks/uploadWorks', 1, 'reset') // 清空数据
        app.worksData = '' // 清空app数据
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/worksShow/myShowList/myShowList',
          })
        }, 200)
      }, 1000)
      return
    } 
    wx.uploadFile({
      url: app.domain2 + 'app/session/worksShowUpload',
      filePath: d.path[d.i],
      name: 'file',
      formData: d.data,
      header: getApp().header || wx.getStorageSync('sessionId'),
      success: (res) => {
        console.log(res)
        if (res.statusCode == 200) {
          let ret = JSON.parse(res.data);
          if (ret.code == 0) {
            d.i++
            d.data.count++
            if (!d.data.worksShowId) {
              d.data.worksShowId = ret.data.worksShowId;
              that.setData({
                ['worksData.worksShowId']: ret.data.worksShowId
              })
              // getApp().worksShow = [];
            }
            this.worksUpload(d)
          } else {
            let msg = ''
            if (ret.code == '2' && d.data.isChange == 0) {
              msg = `第 ${d.data.count} 张图片不合法`
            } else {
              msg = ret.msg || ret.message
            }
            util.tips(msg)
            this.setData({
              isSubmit: false
            })
          }
        } else {
          this.setData({
            isSubmit: false
          })
          wx.hideLoading()
          setTimeout(() => {
            util.tips('上传失败')
          }, 500)
          app.worksData.musicId = this.worksData.musicId
          app.worksData.musicPath = this.worksData.musicPath
          app.worksData.coverurl = this.worksData.coverurl
        }
      },
      fail: (res) => {
        wx.hideLoading()
        setTimeout(() => {
          util.tips('上传失败')
        }, 500)
        this.setData({
          isSubmit: false
        })
        app.worksData.musicId = this.worksData.musicId
        app.worksData.musicPath = this.worksData.musicPath
        app.worksData.coverurl = this.worksData.coverurl
      }
    })
  },
  worksSave(img) {
    let _this = this;
    util.http({
      url: app.domain2 + 'app/session/worksSave',
      method: 'POST',
      data: {
        code: 2,
        isPublic: 1,
        worksShowId: this.data.worksData.isChange == 1 ? this.data.id : '',
        musicId: this.data.worksData.musicId || 0,
        isChange: this.data.worksData.isChange || 0,
        imgList: JSON.stringify(img),
        worksDesc: this.data.worksData.explain,
        worksTitle: this.data.worksData.title,
        spotId: 0,
        coverurl: this.data.worksData.coverurl || 'http://image.91sjyx.com/sjyx/worksData/defaultCover.jpg'
      },
      headers: 1
    }).then(ret => {
      console.log(ret)
      if (ret.code == 0) {
        util.tips('保存成功!')
        // 保存成功就把上一页新建图文的数据清空
        util.exec('pages/uploadWorks/uploadWorks', 1, 'reset')
        app.worksData = '' // 清空app数据
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/worksShow/myShowList/myShowList' //?id='+ res.data.data.worksShowId
          })
        }, 500)
      } else {
        util.tips(ret.msg)
        this.setData({
          isSubmit: false
        })
      }
    })
  },
  onuser() {
    if (this.data.isEdit) return
    //检查是否登录
    if (!getApp().loginStatus) {
      wx.navigateTo({
        url: '/pages/public/login/login',
      })
      return false;
    }

    wx.navigateTo({
      url: '/pages/userhome/userhome?userId=' + this.data.worksData.user_id,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (this.data.worksData.musicPath && this.data.playIng) {
      innerAudioContext.play()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    innerAudioContext.stop()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    innerAudioContext.stop()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  goIndex() {
    if (this.data.isEdit) return
    wx.reLaunch({
      url: '/pages/img/img',
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.hasMore && !this.data.isEdit) {
      let page = this.data.page
      page += 1
      this.setData({
        page
      }, () => {
        this.bindComment()
      })
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
    if (this.data.isEdit) return // 编辑状态阻止分享
    this.setData({
      showCan: false
    })
    let _this = this
    return {
      title: this.data.worksData.title,
      desc: this.data.worksData.explain,
      path: 'pages/worksShow/worksDetails/worksDetails?id=' + _this.data.worksData.works_id,
      success: function(res) {
        util.tips('分享成功')
      }
    }
  }
})