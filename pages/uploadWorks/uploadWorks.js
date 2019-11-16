// pages/uploadWorks/uploadWorks.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFocus: false,
    title: '', // 标题
    content: '', // 描述
    list: [],
    showChoose: false, // 显示图片选择
    chooseIndex: -1, // 正在操作的list索引
    tips: '',
    isNew: true, // 是否新建图文  false为修改
    worksData: null, // 音乐数据 只有修改图文才可能有
    textFocus: -1,
    isTis: true // 提示添加图片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id) {
      this.setData({
        isTis: false
      })
      wx.showLoading()
      util.http({
        url: app.domain2 + 'app/session/worksShowData',
        headers: 1,
        data: {
          worksShowId: options.id,
          code: 2
        }
      }).then(ret => {
        if (ret.code == 0) {
          let imgList = util.deepCopy(ret.data.imgList)
          imgList = app.checkHolder(imgList)
          this.setData({
            title: ret.data.title, // 标题
            content: ret.data.explain, // 描述
            list: imgList,
            isNew: false,
            worksData: {
              musicId: ret.data.musicId,
              musicPath: ret.data.musicPath,
              id: ret.data.works_id,
              coverurl: ret.data.coverurl
            }
          })
        } else {
          ret.msg || ret.message ? util.tips(ret.msg || ret.message) : null
        }
      })
    }
  },
  bindFocus(e) {
    this.setData({
      textFocus: e.currentTarget.dataset.i
    })
  },
  lostFocus() {
    this.setData({
      textFocus: -1
    })
  },
  // 获取标题内容
  getTitle(e) {
    console.log(e)
    this.setData({
      title: e.detail.value
    })
  },
  // 失去焦点
  offTitle() {
    this.setData({
      isFocus: false
    })
  },
  // 获取图文作品描述
  getContent(e) {
    this.setData({
      content: e.detail.value
    })
  },
  // 删除列表图片
  delImg(e) {
    let {
      index
    } = e.currentTarget.dataset
    this.setData({
      [`list[${index}].image`]: ''
    })
  },
  // 添加列表图片
  addImg(e) {
    // e.currentTarget.dataset.index
    var type = e.currentTarget.dataset.type
    var index = -1
    // 点击列表中的添加图则只能选一张
    if (type && type == 'justOne') {
      index = e.currentTarget.dataset.index
    }
    this.setData({
      showChoose: true,
      chooseIndex: index,
      isTis: false
    })
  },
  // 获取图片说明
  getItemContent(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index
    this.setData({
      [`list[${index}].desc`]: e.detail.value
    })
  },

  // 关闭图片选择弹窗
  closeChoose() {
    this.setData({
      showChoose: false
    })
  },
  // 图片选择操作
  chooseHandler(e) {
    let type = e.detail
    let list = this.data.list
    if (type != 2) {
      var sourceType = type == 0 ? ['camera'] : ['album'] // album 从相册选图，camera 使用相机，默认二者都有
      console.log(sourceType)
      wx.chooseImage({
        count: this.data.chooseIndex == -1 ? 9 : 1, // 增加图片就选九张 替换就一张
        sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: sourceType,
        success: res => {
          console.log(res)
          res.tempFiles.forEach(item => {
            if ((item.size / 1024 / 1024) > 19) {
              util.tips('请上传小于20M的图片');
              return false;
            }
            // push会修改data中的数据
            if (this.data.chooseIndex == -1) {
              list.push({
                image: item.path,
                desc: '',
                id: ''
              })
            }
          })
          // 增加图片就替换图片列表，有选择索引就替换对应索引图片
          if (this.data.chooseIndex == -1) {
            this.setData({
              list
            })
          } else {
            this.setData({
              [`list[${this.data.chooseIndex}].image`]: res.tempFiles[0].path
            })
          }
        },
        fail: res => {}
      });
    } else if (type == 2) {
      var str = '?from=uploadWorks'
      str += this.data.chooseIndex > -1 ? '&type=justOne' : ''
      wx.navigateTo({
        url: '/pages/worksShow/albumSelect/albumSelect' + str,
      })
    }
    this.setData({
      showChoose: false,
    })
  },
  // 获取云库图片
  getCloudImg(data) {
    console.log(data)
    let list = this.data.list
    data.forEach(item => {
      if (this.data.chooseIndex > -1) {
        list[this.data.chooseIndex].image = item.image
        list[this.data.chooseIndex].id = item.doc_id
      } else {
        list.push({
          image: item.image,
          id: item.doc_id,
          desc: item.doc_title
        })
      }
    })
    this.setData({
      list,
      chooseIndex: -1
    })
  },
  // 顺序操作
  itemHandler(e) {
    let type = e.currentTarget.dataset.type
    let index = e.currentTarget.dataset.index
    let list = this.data.list
    if (type == 0) {
      let temp = list[index - 1]
      list[index - 1] = list[index]
      list[index] = temp
    } else if (type == 1) {
      let temp = list[index + 1]
      list[index + 1] = list[index]
      list[index] = temp
    } else if (type == 2) {
      list.splice(index, 1)
    }
    this.setData({
      list
    })
  },

  // 跳转预览
  preview() {
    var that = this
    if (this.data.title == '' || this.data.title == null) {
      this.setData({
        tips: {
          title: '标题不能为空',
          content: '好的文章标题很重要，标题是文章精华的提炼，试试用简短的一句话概括文章要讲述的内容吧！',
          confirm: '填写标题'
        }
      })
      return
    }
    if (this.data.list.length > 30) {
      this.setData({
        tips: {
          title: '图文最多30张',
          content: '唯美的图文，最佳页面展示效果不得超过30张图片，好的作品，能打动人的心！',
          confirm: '好的，我知道了'
        }
      })
      return
    }
    var userInfo = JSON.parse(wx.getStorageSync('userInfo'))
    // 筛掉没有图片的
    let imgArr = []
    this.data.list.forEach(i => {
      if (i.image || i.desc) {
        /**
         * 图片为空时，但是有图片说明，则默认给一个云库图片地址，在展示时识别并隐藏
         */
        let temp = util.deepCopy(i)
        if (!temp.image) {
          temp.image = app.imgHolder
          temp.id = app.idHolder
        }
        imgArr.push(temp)
      }
    })
    app.worksData = {
      explain: this.data.content,
      user_name: userInfo.nickName,
      title: this.data.title,
      HeadImg: userInfo.avatarUrl,
      imgList: imgArr,
      rank: wx.getStorageSync('user_rank'),
      isChange: this.data.worksData ? 1 : 0,
      musicId: app.worksData.musicId ? app.worksData.musicId : this.data.worksData ? this.data.worksData.musicId : 0,
      musicPath: app.worksData.musicPath ? app.worksData.musicPath : this.data.worksData ? this.data.worksData.musicPath : '',
      coverurl: app.worksData.coverurl ? app.worksData.coverurl : this.data.worksData ? this.data.worksData.coverurl : 'http://image.91sjyx.com/sjyx/worksData/defaultCover.jpg'
    }
    // wx.setStorageSync('worksData', app.worksData)
    let id = this.data.worksData ? this.data.worksData.id ? this.data.worksData.id : '' : ''
    wx.navigateTo({
      url: `/pages/worksShow/worksDetails/worksDetails?isEdit=1&id=${id}`,
    })
  },
  // tips组件
  tipsHandler(e) {
    var isFocus = false
    if (e.detail == 'success' && !this.data.title) {
      isFocus = true
    }
    this.setData({
      tips: '',
      isFocus
    }, () => {
      // 填写标题则回到顶部
      if (isFocus) {
        wx.pageScrollTo({
          scrollTop: 0
        })
      }
    })
  },
  // 清空内容
  reset() {
    this.setData({
      title: '',
      content: '',
      list: [],
      chooseIndex: -1,
      tips: '',
      isNew: true,
      worksData: null
    })
    app.worksData = null
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})