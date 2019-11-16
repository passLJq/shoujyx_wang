const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const http = ({ method = "GET", url, data, headers, success, error, hideLoading = true }) => {
  let newHeader = ""
  if (headers) {
    newHeader = wx.getStorageSync('sessionId') || getApp().header
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: method,
      data: data,
      header: newHeader,
      success(ret) {
        ret = ret.data
        // console.log(ret)
        var timer = setTimeout(function () {
          if (hideLoading) {
            clearTimeout(timer)
            timer = null
            wx.hideLoading()
            wx.stopPullDownRefresh()
            wx.hideNavigationBarLoading()
          }
          resolve(ret)
        }, 500)

      },
      fail(err) {
        console.log(err)
        wx.hideLoading()
        if (error) {
          reject(err)
        } else {
          if (err.errMsg == 'request:fail ') {
            tips('出错了，请检查网络~')
          } else {
            // tips(err.errMsg)
          }
        }
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  })
}

function showtips (message) {
  if (!message) return
  wx.showToast({
    title: message.toString(),
    duration: 1300,
    mask: true
  })
}
/**
  util.alerts({
    title: '提示',
    content: '内容~~~',
    success: () => {},
    cancel: () => {}
  })

  hideCancel -> 是否隐藏取消按钮
 */
function alerts({ title = '友情提示', content, hideCancel, confirmText = "确定", confirmColor ='#3CC51F', success, cancle}) {
  wx.showModal({
    title,
    content,
    showCancel: hideCancel ? false : true,
    confirmText: confirmText || "确定",
    confirmColor: confirmColor || "#3CC51F",
    success: function (res) {
      if (res.confirm) {
        success && success()
      } else if (res.cancel) {
        cancle && cancle()
      }
    }
  })
}
//没有图标的弹窗
function tips (message) {
  if (!message) return
  setTimeout(function () {
    wx.showToast({
      title: message.toString(),
      icon: 'none',
      duration: 3000
    });
  }, 100)
}
// 有内容的loading弹窗
function showLoading (message) {
  wx.showLoading({
    title: message ? message.toString() : '',
    icon: 'loading',
    mask: true
  });
}

// 跳外链
function goLink(url) {
  wx.navigateTo({
    url: '/pages/activity/contestInfo/contestInfo?matchRule='+url
  })
}

// 执行历史路由实例中的方法
function exec(url, num, fn) {
  let r = getCurrentPages()
  let router = r[r.length - num - 1]
  if (router && router.route == url) {
    router[fn] && router[fn]()
  }
}
// 获取url后面带?号的参数
const getUrlData = (url) => {
  var arr = null
  if (url.indexOf('?') > -1) {
    arr = url.split('?')[1]
  } else {
    arr = url
  }
  arr = url.indexOf('&') > -1 ? url.split('&') : [arr]
  let obj = {}
  for (let i = 0; i < arr.length; i++) {
    var data = arr[i].split('=')
    obj[data[0]] = data[1]
  }
  return obj
}

// 深拷贝
function deepCopy(obj) {
  var result = Array.isArray(obj) ? [] : {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        result[key] = deepCopy(obj[key]);   //递归复制
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
}


module.exports = {
  formatTime: formatTime,
  http,
  tips,
  showLoading,
  alerts,
  showtips,
  goLink,
  exec,
  getUrlData,
  deepCopy
}
