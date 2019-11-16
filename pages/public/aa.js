 const state = {
     // 可用区域body
    window: { width: 0, height: 0 },
     // 原始图片信息
     originImg: { width: 0, height: 0 },
     // 第一次图片缩放信息
     firstScaleImg: { width: 0, height: 0 },
     // 截取区域信息
    interArea: { width: 0, height: 0 },
     // 单手触摸位置
    touchLast: { x: 0, y: 0 },
    // 滑动距离
   touchMove: { x: 0, y: 0 },
   // 滑动离开时图片状态
   moveImgState: {
        width: 0,
       height: 0,
      top: 0,
       left: 0,
     },
   // 双手触摸位置
   touchList: [{ x: 0, y: 0 }, { x: 0, y: 0 }],
  // 图片缩放比例
   scale: 1,
   }
 Component({
    /**
    * 组件的属性列表
   */
   properties: {
     //宽（非实际值）
    width: {
           type: Number,
            value: 600
    },
       //高
     height: {
            type: Number,
             value: 300
    },
       //图片路径
     src: {
          type: String,
           value: ""
     },
         //显示隐藏
    hidden: {
          type: Boolean,
           value: false
    },
        //截取框的信息
     margin: {
           type: Object,
           value: {
            left: 15,
            right: 15,
           top: 200,
           bottom: 200,
         }
    }
    },
 
   ready() {
      this.initialize();
      // const canvas = wx.createCanvasContext('imgCanvas', this);
    // canvas.draw(false, () => { console.log('ccc') }, this);
   },
 
   /**
    * 组件的初始数据
   */
  data: {
        touchRange: 8,
      img: {
       width: 0,
         height: 0,
        top: 0,
         left: 0,
       },
     canvas: {},
      ratio: 0,
   originImg: {
       width: 0,
       height: 0
    }
  },

  /**
   * 组件的方法列表
   */
   methods: {
     touchstart(e) {
      // console.log("touchstart", e);

    },
     touchmove(e) {
         if (e.touches.length === 1) { this.singleSlip(e.touches[0]) } else {
               this.doubleSlip(e.touches)
      }
    },
    touchend(e) {
        // console.log("touchend", e);
     const x = 0, y = 0;
         state.touchLast = { x, y };
           state.touchMove = { x, y };
          state.touchList = [{ x, y }, { x, y }];
           state.moveImgState = this.data.img;
         // console.log(this.data.img);
     },
     // 单手滑动操作
     singleSlip(e) {
         const { clientX: x, clientY: y } = e;
           const that = this;
          if (state.touchLast.x && state.touchLast.y) {
             state.touchMove = { x: x - state.touchLast.x, y: y - state.touchLast.y };
               state.touchLast = { x, y };
             const move = (_x = false, _y = false) => {
                  const bottom = that.data.img.height + that.data.img.top;
                  const right = that.data.img.width + that.data.img.left;
                const h = state.interArea.height;
                   const w = state.interArea.width;
                 const param = {};
                  if (_x) {
                  if (right > w && that.data.img.left < 0) {
                         param.left = that.data.img.left + state.touchMove.x * 0.1
           
          } else if (right <= w && state.touchMove.x > 0) {
                        param.left = that.data.img.left + state.touchMove.x * 0.1
            
          } else if (that.data.img.left >= 0 && state.touchMove.x < 0) {
                       param.left = that.data.img.left + state.touchMove.x * 0.1
           
          }
          
        };
                 if (_y) {
                     if (bottom > h && that.data.img.top < 0) {
                           param.top = that.data.img.top + state.touchMove.y * 0.1
           
          } else if (bottom <= h && state.touchMove.y > 0) {
                         param.top = that.data.img.top + state.touchMove.y * 0.1
            
          } else if (that.data.img.top >= 0 && state.touchMove.y < 0) {
                        param.top = that.data.img.top + state.touchMove.y * 0.1
            
          }
         
        };
                 // console.log(param);
                 that.setImgPos(param)
        
      };
            if (state.scale == 1) {
               if (that.data.img.width == state.interArea.width) {
                      move(false, true)
         
        } else {
                      move(true, false)
          
        }
        
      } else {
                 move(true, true)
        
      }
      
    } else {
              state.touchLast = { x, y }
      }
     },
     // 双手缩放操作
     doubleSlip(e) {
         const that = this;
          const { clientX: x0, clientY: y0 } = e[0];
         const { clientX: x1, clientY: y1 } = e[1];
          if (state.touchList[0].x && state.touchList[0].y) {
             let changeScale = (Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0)) - Math.sqrt((state.touchList[1].x - state.touchList[0].x) * (state.touchList[1].x - state.touchList[0].x) + (state.touchList[1].y - state.touchList[0].y) * (state.touchList[1].y - state.touchList[0].y))) * 0.0005;
              changeScale = changeScale >= 1.5 ? 1.5 : (changeScale <= -1 ? -1 : changeScale);
               state.scale = that.data.img.width / state.firstScaleImg.width < 1 ? 1 : (state.scale > 2.5 ? 2.5 : 1 + changeScale);
              let width = state.firstScaleImg.width * (state.scale - 1) + state.moveImgState.width;
             width = width < state.firstScaleImg.width ? state.firstScaleImg.width : width;
              let height = state.firstScaleImg.height * (state.scale - 1) + state.moveImgState.height;
             height = height < state.firstScaleImg.height ? state.firstScaleImg.height : height;
              let left = width * (1 - state.scale) / 4 + state.moveImgState.left;
              left = left * (-1) > width - state.interArea.width ? state.interArea.width - width : left > 0 ? 0 : left;
             let top = height * (1 - state.scale) / 4 + state.moveImgState.top;
              top = top * (-1) > height - state.interArea.height ? state.interArea.height - height : top > 0 ? 0 : top;
             const setImgObj = { width, height, left, top };
             that.setImgPos(setImgObj)
      
    } else {
             state.touchList = [{ x: x0, y: y0 }, { x: x1, y: y1 }]
       }
     },
     // 获取可用区域宽高
    getScreenInfo() {
         const that = this;
          return new Promise((resolve, reject) => {
             wx.getSystemInfo({
              success: function(res) {
                    const { windowHeight, windowWidth } = res;
                   state.window = { windowHeight, windowWidth };
                     that.setData({ windowHeight, windowWidth })
                  // console.log(state.window);
                    resolve(res);
        
        },
              })
   
    })
    },
    setShowArea() {
         const that = this;
       const w = state.window.windowWidth - that.data.margin.left - that.data.margin.right;
        const h = (that.data.height / that.data.width) * w;
       },
     outputImg() {
          this.setData({
            hidden: true,
            })
    },
      getImgInfo(path) {
         return new Promise((resolve, reject) => {
             wx.getImageInfo({
                 src: path,
                 success(res) {
                    console.log(res);
                      resolve(res);
                    },
                 fail(err) {
                      reject(err)
          }
        })
       })
    },
    // 设置图片
    setImgPos({ width, height, top, left }) {
       width = width || this.data.img.width;
        height = height || this.data.img.height;
        top = top || this.data.img.top;
        left = left || this.data.img.left
        this.setData({
            img: { width, height, top, left }
      })
     },
     // 初始化图片位置大小
     initialize() {
         const that = this;
         const ratio = that.data.width / that.data.height;
         this.getScreenInfo().then(res => {
             console.log(res);
             state.interArea = { width: res.windowWidth - that.data.margin.left - that.data.margin.right + 2, height: (res.windowWidth - that.data.margin.left - that.data.margin.right) / ratio };
             console.log("interArea", state.interArea)
             that.getImgInfo(that.data.src).then(imgInfo => {
                 const { width, height } = imgInfo;
                 const imgRatio = width / height;
                 state.originImg = { width, height };
                 that.setData({
                     ratio: ratio
           });
                 if (imgRatio > ratio) {
                     that.setImgPos({
                         height: state.interArea.height,
                         width: state.interArea.height * imgRatio
             })
        
      } else {
                     that.setImgPos({
                         height: state.interArea.width / imgRatio,
                         width: state.interArea.width,
                       })
        
      };
                 state.firstScaleImg = { width: that.data.img.width, height: that.data.img.height }
      
    });
    
  });
  
},
     // 截图
     getImg(){
         const that = this;
         // console.log('dudu', that.data.img);
         const canvas = wx.createCanvasContext('imgCanvas', this);
         const { width, height, left, top } = that.data.img;
         const saveImg = () => {
         console.log('开始截取图片');
             wx.canvasToTempFilePath({
                 canvasId:"imgCanvas",
                 success(res){
                     // console.log(res);
             that.setData({
                         hidden:true,
                         // src:""
             });
             that.triggerEvent("putimg", { imgUrl: res.tempFilePath }, {});
                   },
                 fail(err){
                     console.log(err)
           }
         }, that)
  
};
       canvas.drawImage(that.data.src, left, top, width, height);
       canvas.draw(false, () => { saveImg() }, that)
     }
   }
 })