const innerAudioContext = wx.createInnerAudioContext()
var verify = require('../../pages/public/verify/verify.js');
var login = require('../../utils/login.js');
const util = require('../../utils/util.js')
Page({
  data: {
    Interface: 'app/session/uploadData',
    uploadUrl: 'app/session/upload',
    maxlength: 30,
    TotalMessageNumLength: 0,
    images: [],
    matchData: {
      id: 0,
      name: '不参赛'
    },
    categoryData: {
      id: 0,
      name: '请选择分类'
    },
    albumData: {
      id: 0,
      name: '全部'
    },
    data: [],
    isPublic: 1,
    selectPerson: true,
    getTotalMessage: '',
    title: '',
    label: [],
    inputVal: "",
    memberId: '',
    video: "",
    videoTitle: "",
    docType: 1,
    spotId: 0,
    spotIdTag: 0,
    radioValue: 2, //拍摄类型


    //影集
    worksUploadUrl: 'app/session/worksShowUpload',
    worksSaveUrl: 'app/session/worksSave',
    worksShowData: 'app/session/worksShowData',
    // musicListUrl: 'app/session/musicList',
    imgListCache: '',   // 影集图片列表缓存
    worksData: {
      imgList: [],
      worksTitle: '',
      worksDesc: '',
      worksShowId: '',
      isChange: 0,
      isPublic: 1,
      musicId: 1,
      code: 0,
      spotId: 0
    },
    tempFile: [],
    loadImg: false,
    isPublicWorks: true,
    musicList: [],
    musicSrc: 'http://image.91sjyx.com/sjyx/music/1.mp3',
    musicData: {
      id: 1,
      name: '清晨',
      status: 0,
      index: 0
    },
    hidden: false,
    submitStyle: false
  },
  onLoad: function(options) {
    if (options.type) {
      this.setData({
        docType: options.type
      })
    }
    if (options.spotId) {
      this.setData({
        spotId: options.spotId,
        ['worksData.code']: 2,
        ['worksData.spotId']: options.spotId,
        url: options.url,
        spotName: options.spotName,
        spotIdTag: 1
      })
    }
    if (options.matchId && options.name) {
      this.setData({
        matchData: {
          id: options.matchId,
          name: options.name
        }
      })
    }

    var url = getApp().domain2 + this.data.Interface
    this.query(url);
    wx.setNavigationBarTitle({
      title: '上传'
    });
    
    // if (!getApp().loginStatus) {
    //   wx.navigateTo({
    //     url: '/pages/public/login/login',
    //   })
    // }

    let imgType = {
      id: '',
      name: '全部'
    }
    getApp().imgType = imgType;

    //影集
    if (options.code == undefined) {
      this.setData({
        ['worksData.code']: 0
      })
    } else {
      this.setData({
        ['worksData.code']: options.code
      })
    }

    options.id && this.setData({
      ['worksData.worksShowId']: options.id,
    })
    if (options.id != undefined) {
      this.getWorksDetail(options.id, options.code);
      this.setData({
        ['worksData.isChange']: 1,
      })
    }
    // this.musicList();
    //innerAudioContext.autoplay = true
    innerAudioContext.src = this.data.musicSrc
    innerAudioContext.obeyMuteSwitch = false;
    innerAudioContext.loop = true,
    innerAudioContext.pause();
  },

  reset: function() {
    this.setData({
      maxlength: 30,
      TotalMessageNumLength: 0,
      images: [],
      matchData: {
        id: 0,
        name: '不参赛'
      },
      categoryData: {
        id: 0,
        name: '请选择分类'
      },
      albumData: {
        id: 0,
        name: '全部'
      },
      data: [],
      isPublic: 1,
      selectPerson: true,
      getTotalMessage: '',
      title: '',
      label: [],
      inputVal: "",
      memberId: '',
      video: "",
      videoTitle: "",
      docType: 1,
      spotId: 0,
      spotIdTag: 0,

      worksData: {
        imgList: [],
        worksTitle: '',
        worksDesc: '',
        worksShowId: '',
        isChange: 0,
        isPublic: 1,
        musicId: 1,
        code: 0,
        spotId: 0
      },
      tempFile: [],
      loadImg: false,
      isPublicWorks: true,
      musicList: [],
      musicSrc: 'http://image.91sjyx.com/sjyx/music/1.mp3',
      musicData: {
        id: 1,
        name: '清晨',
        status: 0,
        index: 0
      },
      hidden: false
    })

  },

  onswitch: function(e) {
    this.setData({
      docType: e.currentTarget.dataset.type
    })
    this.MusicSwitch(e.currentTarget.dataset.type)
  },
  //选择拍摄设备
  choiceLabel: function(e) {
    console.log('e.currentTarget.dataset.label', e.currentTarget.dataset.label)
    this.setData({
      radioValue: e.currentTarget.dataset.label,
    })

  },
  //点击选择类型
  clickPerson: function() {
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
  //增加标签
  // mySelect: function () {
  //   let temp = this.data.temp;
  //   let label = this.data.label;
  //   label.push(temp)
  //   this.setData({
  //     label: label,
  //     selectPerson: true
  //   })
  // },
  // abc:function(e){
  //   this.setData({
  //     inputVal:''
  //   })
  // },
  // onblur:function(e){
  //    this.setData({
  //      temp: e.detail.value,
  //      selectPerson: true
  //    })
  // },
  query: function(url) {
    let thiss = this;
    wx.request({
      url: url,
      data: {},
      header: getApp().header,
      success: function(res) {
        thiss.setData({
          type: res.data.data
        })
      }
    })
  },
  // calling: function () {
  //   wx.makePhoneCall({
  //     phoneNumber: '10086',
  //   })
  // },

  //选择图片
  addImg: function() {
    var _this = this;
    let images = this.data.images;
    if (images.length < 9) {
      wx.chooseImage({
        count: 9,
        sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
        success: res => {
          for (var i = 0; i < res.tempFiles.length; i++) {
            if ((res.tempFiles[i].size / 1024 / 1024) > 19) {
              _this.Prompt('请上传小于20M的图片');
              return false;
            }
          }
          let images = this.data.images;
          for (var i = 0; i < res.tempFilePaths.length; i++) {
            images.push(res.tempFilePaths[i]);
          }
          this.setData({
            images: images,
          });
        },
        fail: res => {}
      });
    } else {
      wx.showToast({
        title: '最多可选择9张图片',
        icon: 'none',
        duration: 2000
      })
    }

  },

  DocTitle: function(event) {
    let title = event.detail.value;
    let data = this.data.data;
    data.title = title;
    this.setData({
      data: data,
      title: title
    });
    console.log('title++++++++++', this.data.title)
    console.log('data++++++++++', this.data.data)
  },
  DocDescribe: function(event) {
    let desc = event.detail.value;
    let data = this.data.data;
    data.desc = desc;
    this.setData({
      data: data
    });
    // console.log(this.data.data)
  },
  Doclabel: function(e) {
    let data = this.data.data
    data.label = e.detail.value,
      this.setData({
        data: data
      });
  },
  getVideoTitle: function(e) {
    this.setData({
      videoTitle: e.detail.value,
    })
  },

  ismatch: function(e) {
    let data = e.currentTarget.dataset;
    if (data.val == 'match') {
      this.setData({
        match: true
      })
    }
    if (data.val == 'category') {
      this.setData({
        category: true
      })
    }
    if (data.val == 'album') {
      this.setData({
        album: true
      })
    }

  },
  //选择关键词
  selectKeyword: function(e) {
    var data = e.currentTarget.dataset;
    switch (data.type) {
      case 'match':
        this.setData({
          match: false,
          matchData: {
            id: data.id,
            name: data.name
          }
        })
        break;
      case 'category':
        this.setData({
          category: false,
          categoryData: {
            id: data.id,
            name: data.name
          }
        })
        break;
      case 'album':
        this.setData({
          album: false,
          albumData: {
            id: data.id,
            name: data.name
          }
        })
    }
  },

  //监听文本域值的改变
  getMessage: function(e) {
    this.setData({
      getTotalMessage: e.detail.value,
      TotalMessageNumLength: e.detail.value.length
    })

  },

  //删除图片
  delImg: function(e) {
    let id = e.currentTarget.dataset.id;
    var images = this.data.images;
    images.splice(id, 1);
    this.setData({
      images: images
    })
  },
  delLabel: function(e) {
    let id = e.currentTarget.dataset.id;
    var label = this.data.label;
    label.splice(id, 1);
    this.setData({
      label: label
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

  //提交上传页面
  onSubmit: function() {
    console.log(this.data.radioValue)
    if (!getApp().loginStatus) {
      wx.navigateTo({
        url: '/pages/public/login/login',
      })
      return
    }
    let data = this.data;
    let submitData = this.data.data;
    submitData.matchId = data.matchData.id;
    submitData.categoryId = data.categoryData.id;
    submitData.albumId = data.albumData.id;
    submitData.isPublic = data.isPublic;
    submitData.spotId = this.data.spotId;
    submitData.deviceType = parseInt(this.data.radioValue);
    submitData.docType = 0;
    let title = data.title;
    title = title.replace(/^\s+|\s+$/g, "");
    if (!title) {
      this.Prompt('标题不能为空！请输入标题');
      return false;
    }

    if (!data.categoryData.id && !this.data.spotId) {
      this.Prompt('请选择作品分类');
      return false;
    }

    if (!data.images[0]) {
      this.Prompt('请选择上传文件');
      return false;
    }
    this.setData({
      total_num: data.images.length,
      set_num: 0
    })
    submitData.id = 0;
    if (data.images.length > 1) {
      submitData.id = 1;
    }
    // wx.showNavigationBarLoading();
    this.setData({
      submitStyle: true,
      loadImg: true,
    })
    var url = getApp().domain2 + this.data.uploadUrl;

    console.log(submitData);

    this.uploadimg({
      url: url,
      path: data.images,
      data: submitData
    });
  },


  //视频
  videoSubmit: function() {
    if (!getApp().loginStatus) {
      wx.navigateTo({
        url: '/pages/public/login/login',
      })
      return
    }
    var videoPath = this.data.videoPath;
    if (!videoPath) {
      this.Prompt('请选择上传视频');
      return false;
    }
    var video = this.data.video;
    video.title = this.data.videoTitle;
    video.desc = this.data.getTotalMessage;
    video.spotId = this.data.spotId;
    video.deviceType = 0
    let title = this.data.videoTitle;
    title = title.replace(/^\s+|\s+$/g, "");
    if (!title) {
      this.Prompt('视频标题不能为空！');
      return false;
    }
    // wx.showNavigationBarLoading();
    this.setData({
      submitStyle: true,
      loadImg: true,
      total_num: 1,
      set_num: 0
    })
    var url = getApp().domain2 + this.data.uploadUrl;
    console.log(video)
    this.uploadvideo({
      url: url,
      filePath: videoPath,
      data: video
    });
  },
  //视频上传
  uploadvideo: function(data) {
    var thiss = this;
    wx.uploadFile({
      url: data.url,
      filePath: data.filePath,
      name: 'file',
      formData: data.data,
      header: getApp().header,
      success: function(res) {
        if (res.statusCode == 200) {
          let resData = JSON.parse(res.data)
          if (resData.code == 0) {
            thiss.setData({
              set_num: 1
            })
            var r = getCurrentPages()
            console.log(r)
            if (r[r.length - 2].route == 'pages/activity/matchVideo/matchVideo') {
              r[r.length - 2].reload()
            }
            setTimeout(function() {
              wx.showToast({
                title: '上传成功',
                icon: 'none',
                duration: 2000
              })
              let spotId = thiss.data.spotId;
              let spotName = thiss.data.spotName;
              let url = thiss.data.url;
              if (spotId) {
                thiss.reset();
                wx.redirectTo({
                  url: '/pages/tourism/' + url + '?spotId=' + spotId + '&spotName=' + spotName
                })
              } else {
                wx.navigateBack({
                  delta: 1
                })
              }
            }, 2000)
          } else if (resData.code == 3 || resData.code == 4) {
            wx.showToast({
              title: resData.msg,
              icon: 'none',
              duration: 2000
            })
            thiss.setData({
              loadImg: false
            })
          } else {
            wx.showToast({
              title: '上传失败',
              icon: 'none',
              duration: 2000
            })
            thiss.setData({
              videoPath: '',
              video: [],
              total_num: false
            })
          }
        }
      },
      fail: function(res) {},
      complete: function(res) {
        // wx.hideNavigationBarLoading()
        thiss.setData({
          submitStyle: false,
          loadImg: true
        })
      }

    })
  },

  // 图片上传
  uploadimg: function(data) {
    // data.data.memberId = '76048356-FD7A-4EEC-8717-E5ECE5AC9755'
    var thiss = this,
      i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0;
    wx.uploadFile({
      url: data.url,
      // url: 'http://192.168.1.236:8080/app/session/upload',
      filePath: data.path[i],
      name: 'file',
      formData: data.data,
      header: getApp().header,
      success: (res) => {
        if (res.statusCode == 200) {
          let resData = JSON.parse(res.data);
          if (resData.code == 0) {
            data.data.id = resData.data.id;
            success++;
            if (data.return && data.return == 1) {
              this.setData({
                submitStyle: false
              })
              return
            }
            i++;
            thiss.setData({
              set_num: thiss.data.set_num + 1
            })

            if (i == data.path.length) {
              // wx.hideNavigationBarLoading()
              this.setData({
                submitStyle: false,
                loadImg: false
              })
              wx.showToast({
                title: '上传成功',
                icon: 'none',
                duration: 2000
              })
              setTimeout(function () {
                let spotId = thiss.data.spotId;
                let spotName = thiss.data.spotName;
                let url = thiss.data.url;
                if (spotId) {
                  thiss.reset();
                  wx.redirectTo({
                    url: '/pages/tourism/' + url + '?spotId=' + spotId + '&spotName=' + spotName
                  })
                } else {
                  // wx.redirectTo({
                  //   url: '/pages/upload/upload?type=1'
                  // })
                  wx.navigateBack({
                    delta: 1
                  })
                }

              }, 2000)
            } else {
              console.log(i);
              data.i = i;
              data.success = success;
              thiss.uploadimg(data);
            }
          } else if (resData.code == 3 || resData.code == 4) {
            util.tips(resData.msg)
            data.return = 1
            this.setData({
              loadImg: false
            })
            wx.hideLoading()
            return
          } else {
            this.setData({
              submitStyle: false
            })
            util.tips('上传失败')
            return
          }
        } else {
          this.setData({
            submitStyle: false
          })
          util.tips('上传失败')
          return
        }
      },
      fail: (res) => {
        this.setData({
          submitStyle: false
        })
        util.tips('上传失败')
        return
      },
    });
  },

  //是否公开
  radioChange: function(e) {
    this.setData({
      isPublic: e.detail.value
    })
  },

  //添加视频
  addvideo: function() {
    var thiss = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      compressed: true,
      maxDuration: 60,
      camera: 'back',
      success: function(res) {
        let video = {};
        video.size = (res.size / (1024 * 1024)).toFixed(2);
        video.height = res.height;
        video.width = res.width;
        video.docType = 1;
        thiss.setData({
          video: video,
          videoPath: res.tempFilePath,
        })
      }
    })
  },


  //影集
  //类别弹出
  worksShowSelect: function() {
    this.setData({
      worksShowSelect: true,
      hidden: true
    })
  },
  //类别选择
  worksShowTypeSelect: function(e) {
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    this.setData({
      worksShowSelect: false,
      ['worksData.code']: id,
      ['worksData.typeName']: name,
      hidden: false
    })
  },

  //重新选择
  musicSelect: function() {
    this.setData({
      musicSelect: true,
      hidden: true
    })
    wx.setNavigationBarTitle({
      title: '选择音乐'
    });
  },

  //暂停，播放
  musicPaly: function() {
    let data = this.data.musicData;
    this.setData({
      ['musicData.status']: !data.status
    })
    if (data.status) {
      innerAudioContext.play();

    } else {
      innerAudioContext.pause();
    }
  },

  MusicSwitch: function(docType) {
    var status = '';
    if (docType == 3) {
      // innerAudioContext.play();
      // status = true
    } else {
      innerAudioContext.pause();
      status = false
    }
    this.setData({
      ['musicData.status']: status
    })
  },

  //选择音乐
  onMusic: function(e) {
    let index = e.currentTarget.dataset.index;
    let src = e.currentTarget.dataset.src;
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    let status = e.currentTarget.dataset.status;
    status = status ? 0 : 1;
    if (this.data.musicTag != undefined) {
      let musicStatus = 'musicList[' + this.data.musicTag + '].status';
      innerAudioContext.pause();
      innerAudioContext.src = '';
      this.setData({
        [musicStatus]: 0,
      })
    }
    let musicStatus = 'musicList[' + index + '].status';
    this.setData({
      [musicStatus]: status,
      musicTag: index,
      musicSrc: true,
      ['musicData.id']: id,
      ['musicData.name']: name,
      ['worksData.musicId']: id,
    })
    if (status) {
      innerAudioContext.src = src;
      innerAudioContext.play()
    } else {

      innerAudioContext.pause();
      this.setData({
        ['musicData.name']: '',
        ['musicData.status']: 0,
        ['worksData.musicId']: '',
        // hidden: false,
        musicSrc: false,
      })

    }
  },


  music: function(id, name, path) {
    innerAudioContext.src = path;
    if (id && path) {
      this.setData({
        musicSrc: true,
        ['musicData.name']: name,
        ['musicData.status']: 0,
        ['worksData.musicId']: id,
      })
    }

  },

  //确认音乐
  musicConfirm: function() {
    innerAudioContext.pause();
    this.setData({
      ['musicData.status']: 0,
      musicSelect: false,
      hidden: false,

    })
    wx.setNavigationBarTitle({
      title: '影集制作'
    });
    if (this.data.musicTag == undefined) {
      this.setData({
        ['worksData.musicId']: 0,
        musicSrc: false
      })
    }

  },
  //获取音乐列表
  // musicList: function() {
  //   var _this = this;
  //   let url = getApp().domain2 + this.data.musicListUrl;
  //   let code = 0;
  //   wx.request({
  //     url: url,
  //     data: {
  //       code: code,
  //       page: 1
  //     },
  //     header: getApp().header,
  //     success: function(res) {
  //       if (res.statusCode == 200) {
  //         if (res.data.code == 0) {
  //           let data = res.data.data;
  //           _this.setData({
  //             musicList: data
  //           })
  //         }
  //       }
  //     }
  //   })
  // },

  //获取影展数据
  getWorksDetail: function(id, code) {
    let _this = this;
    let url = getApp().domain2 + this.data.worksShowData;
    wx.request({
      url: url,
      data: {
        code: code,
        worksShowId: id
      },
      header: getApp().header,
      success: function(res) {
        if (res.statusCode == 200) {
          if (res.data.code == 0) {
            let data = res.data.data;
            let worksData = {
              imgList: data.imgList,
              worksTitle: data.title,
              worksDesc: data.explain,
              worksShowId: data.works_id,
              isChange: 1,
              code: data.code,
            }
            _this.setData({
              worksData: worksData
            })
            getApp().worksShow = data.imgList;


            _this.music(res.data.data.musicId, res.data.data.musicName, res.data.data.musicPath);
          }
        }
      }
    })
  },


  //影展标题
  worksTitle: function(e) {
    let worksTitle = e.detail.value;

    this.setData({
      ['worksData.worksTitle']: worksTitle
    })

    // console.log(this.data.worksTitle)
  },
  //影展介绍
  worksDesc: function(e) {
    let worksDesc = e.detail.value;
    this.setData({
      ['worksData.worksDesc']: worksDesc
    })
  },

  albumAdd: function() {
    wx.navigateTo({
      url: '/pages/worksShow/albumSelect/albumSelect',
    })
  },

  //选择图片
  phoneAdd: function() {
    var _this = this;
    let imgList = this.data.worksData.imgList;
    let tempFile = this.data.tempFile;
    if (imgList.length < 30) {
      wx.chooseImage({
        count: 9,
        sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
        success: res => {
          for (var i = 0; i < res.tempFiles.length; i++) {
            if ((res.tempFiles[i].size / 1024 / 1024) > 19) {
              _this.Prompt('请上传小于20M的图片');
              return false;
            }
          }
          for (var i = 0; i < res.tempFilePaths.length; i++) {
            let img = {
              id: 0,
              image: res.tempFilePaths[i],
              desc: ''
            }
            imgList.push(img);
            //tempFile.push(res.tempFilePaths[i]);
          }
          this.setData({
            ['worksData.imgList']: imgList,
            imgListCache: imgList,
            worksDataCount: imgList.length
          });
          getApp().worksShow = imgList;
        },
        fail: res => {}
      });
    } else {
      wx.showToast({
        title: '最多可选择9张图片',
        icon: 'none',
        duration: 2000
      })
    }
  },

  //取消
  worksList: function() {
    let data = this.data.worksData;
    wx.navigateTo({
      url: '/pages/worksShow/myShowList/myShowList?code=' + data.code,
    })
  },

  message: function(msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 2000
    })
  },

  showRadioChange: function() {
    let isPublic = this.data.isPublicWorks ? 0 : 1;
    this.setData({
      ['worksData.isPublic']: isPublic,
      isPublicWorks: !this.data.isPublicWorks,
    })
  },

  //保存影集
  worksSave: function() {
    if (!getApp().loginStatus) {
      wx.navigateTo({
        url: '/pages/public/login/login',
      })
      return
    }
    wx.setStorageSync('cache', JSON.stringify(this.data.imgListCache))
    let worksData = this.data.worksData;
    let imgList = worksData.imgList;
    let title = worksData.worksTitle;
    let worksDesc = worksData.worksDesc;
    title = title.replace(/^\s+|\s+$/g, "");

    if (!worksData.code && !this.data.spotId) {
      this.message('请选择类型')
      return false;
    }
    if (!title) {
      this.message('标题不能为空');
      return false;
    }
    worksDesc = worksDesc.replace(/^\s+|\s+$/g, "");
    if (!worksDesc) {
      this.message('描述不能为空');
      return false;
    }

    if (imgList.length == 0) {
      this.message('请添加作品内容')
      return false;
    }
    let total_num = imgList.length

    if (total_num < 6) {
      this.message('作品数量不小于6张');
      return false;
    }
    if (total_num > 30) {
      this.message('作品数量不大于30张');
      return false;
    }


    this.setData({
      isSubmit: true
    })
    let tempFile = this.data.tempFile
    for (var i = 0; i < imgList.length; i++) {
      if (imgList[i].id == 0) {
        tempFile.push(imgList[i].image);
      }
    }
    this.setData({
      ['worksData.imgList']: imgList,
    });
    // getApp().worksShow = imgList;

    for (var key in imgList) {
      imgList[key].image = ''
    }

    worksData.imgList = JSON.stringify(imgList)
    // wx.showNavigationBarLoading();
    this.setData({
      loadImg: true,
      total_num: total_num,
      set_num: total_num - tempFile.length
    })
    if (tempFile.length == 0) {
      this.setData({
        total_num: total_num + tempFile.length,
      })
      // console.log(worksData);
      let url = getApp().domain2 + this.data.worksSaveUrl;
      this.worksSubmit({
        url: url,
        code: worksData.code,
        data: worksData
      });
      return false;
    }
    worksData.count = 1;
    let url = getApp().domain2 + this.data.worksUploadUrl
    this.worksUpload({
      url: url,
      code: worksData.code,
      data: worksData,
      path: tempFile,
      i: 0,
      success: 0,
      fail: 0,
    })
    console.log(123,worksData)
  },

  //影展保存
  worksSubmit: function(data) {
    console.log(data.data);
    let _this = this;
    wx.request({
      url: data.url,
      data: data.data,
      method: 'POST',
      header: getApp().header,
      success: function(res) {
        if (res.statusCode == 200) {
          if (res.data.code == 0) {
            _this.setData({
              worksData: {},
              isSubmit: false,
            })
            getApp().worksShow = []
            wx.showToast({
              title: '保存成功',
              icon: 'none',
              duration: 2000
            })

            setTimeout(function() {
              let spotId = _this.data.spotId;
              let spotName = _this.data.spotName;
              let url = _this.data.url;
              wx.setStorageSync('cache', '')
              if (spotId) {
                _this.reset();
                wx.navigateTo({
                  url: '/pages/tourism/' + url + '?spotId=' + spotId + '&spotName=' + spotName
                })
              } else {
                wx.navigateTo({
                  url: '/pages/worksShow/myShowList/myShowList?code=' + data.code //?id='+ res.data.data.worksShowId
                  //url: '/pages/upload/upload?type=3'
                })
              }

            }, 2000)
          } else if (res.data.code == 3 || res.data.code == 4) {
            util.tips(res.data.msg)
            let cache = JSON.parse(wx.getStorageSync('cache'))
            _this.setData({
              tempFile: [],
              isSubmit: false,
              loadImg: false,
              imgListCache: cache,
              ['worksData.imgList']: cache,
              set_num: 0
            })
          }
        }
      },
      complete: () => {
        _this.setData({
          isSubmit: false,
          loadImg: false
        })
      }

    })
  },

  // 图片上传
  worksUpload: function(data) {
    let _this = this
    let i = data.i ? data.i : 0
    let success = data.success ? data.success : 0
    let fail = data.fail ? data.fail : 0;
    console.log(data.data.count, data)
    console.log(i)
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'file',
      formData: data.data,
      header: getApp().header,
      success: (res) => {
        if (res.statusCode == 200) {
          let resData = JSON.parse(res.data);
          if (resData.code == 0) {
            success++;
            if (resData.data.worksShowId) {
              data.data.worksShowId = resData.data.worksShowId;
              _this.setData({
                ['worksData.worksShowId']: resData.data.worksShowId
              })
            }
          } else if (resData.code == 3 || resData.code == 4) {
            util.tips(resData.msg)
            data.return = 1
            this.setData({
              loadImg: false
            })
            return
          } else {
            fail++
          }
        } else {
          fail++
        }
      },
      fail: (res) => {
        fail++;
      },
      complete: () => {
        if (data.return && data.return == 1) {
          let imgList = JSON.parse(wx.getStorageSync('cache'))
          this.setData({
            tempFile: [],
            isSubmit: false,
            imgListCache: imgList,
            ['worksData.imgList']: imgList,
            set_num: 0
          })
          return
        }
        i++;
        data.data.count++;
        _this.setData({
          set_num: _this.data.set_num + 1
        })
        if (i == data.path.length) {
          // wx.hideNavigationBarLoading()
          wx.showToast({
            title: '保存成功',
            icon: 'none',
            duration: 2000
          })
          setTimeout(function() {
            let worksData = {}
            _this.setData({
              worksData: worksData,
              tempFile: [],
              isSubmit: false,
              loadImg: false,
            })
            getApp().worksShow = []
            wx.setStorageSync('cache', '')
            let spotId = _this.data.spotId;
            let spotName = _this.data.spotName;
            let url = _this.data.url;
            if (spotId) {
              _this.reset();
              wx.navigateTo({
                url: '/pages/tourism/' + url + '?spotId=' + spotId + '&spotName=' + spotName
              })
            } else {
              wx.navigateTo({
                url: '/pages/worksShow/myShowList/myShowList?code=' + data.code,
                // url: '/pages/upload/upload?type=3'
              })
            }



          }, 2000)
        } else {
          data.i = i;
          data.success = success;
          data.fail = fail;
          _this.worksUpload(data);
        }
      }
    });
  },


  getDesc: function(e) {
    let desc = e.detail.value;
    let index = e.currentTarget.dataset.id;
    let listDesc = 'worksData.imgList';
    let imgList = this.data.imgListCache
    imgList[index].desc = desc
    this.setData({
      imgListCache: imgList,
      [listDesc]: imgList
    })
    // var imgList = this.data.worksData.imgList;
    getApp().worksShow = imgList;
    // console.log(this.data.worksData.imgList[index])
  },


  //影集图片删除
  worksDelImg: function(e) {
    let index = e.currentTarget.dataset.id;
    var imgList = this.data.imgListCache
    imgList.splice(index, 1);
    
    this.setData({
      imgListCache: imgList,
      ['worksData.imgList']: imgList
    })
    getApp().worksShow = imgList;
  },

  quit: function() {
    var spotId = this.data.spotId;
    if (spotId) {
      var spotName = this.data.spotName;
      var url = this.data.url;
      this.reset();
      getApp().tagPage = 'img/img';
      wx.navigateTo({
        url: '/pages/tourism/' + url + '?spotId=' + spotId + '&spotName=' + spotName
      });
      return false;
    }
    var tagPage = getApp().tagPage;
    wx.switchTab({
      url: '/pages/' + tagPage
    })
    getApp().worksShow = [];
  },

  typeSelect: function(e) {
    var code = e.currentTarget.dataset.code;
    this.setData({
      docType: code,
      uploadSelect: 1
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      total_num: 0,
      set_num: 0,
    })

    if (this.data.spotId) {
      this.setData({
        uploadSelect: true,
      })
    } else {
      this.setData({
        uploadSelect: false,
      })
    }

    if (getApp().loginStatus) {
      var url = getApp().domain2 + this.data.Interface
      this.query(url);
    } else {
      wx.navigateTo({
        url: '/pages/public/login/login',
      })

    }

    this.setData({
      ['worksData.imgList']: getApp().worksShow,
      imgListCache: getApp().worksShow,
      worksDataCount: getApp().worksShow.length,
      total_num: 0,
      set_num: 0
    })

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    if (this.data.docType == 3) {
      innerAudioContext.pause();
      this.setData({
        ['musicData.status']: 0,
      })
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    if (this.data.docType == 3) {
      innerAudioContext.stop()
    }


  },

})