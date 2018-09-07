Page({
  leftMove: 0,
  rightMove: 0,
  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    desc: '',
    voice:0,
    leftAnimationData: {},
    rightAnimationData: {},
    leftTime: 0,
    rightTime:0,
    src: '/assets/sound/countdown.mp3',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.audioCtx = wx.createAudioContext('myAudio')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var configs = wx.getStorageSync('configs');
    var first = true;
    for (var i in configs) {
      var config = configs[i];
      var desc = config.desc.replace(/@/g, config.time+'秒')
      if (config.state) {
        if (first) {
          this.setData({ title: config.name, desc: desc, leftTime: config.time, rightTime: config.time, voice: config.voice})
          first = false;
        }
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  actionSheetTap: function (e) {
    this.rightStop();
    this.leftStop();
    var configs = wx.getStorageSync('configs');
    var itemList = [];
    var page = this;

    for (var i in configs) {
      var config = configs[i];
      if (config.state) {
        itemList.push(config.name);
      }
    }

    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        var index = res.tapIndex;
        var configs = wx.getStorageSync('configs');
        var arr = [];

        for (var i in configs) {
          var config = configs[i];
          if (config.state) {
            arr.push(config);
          }
        }

        for (var j=0;j<arr.length;j++) {
          if (index == j) {
            var desc = arr[index].desc.replace(/@/g, arr[index].time + '秒')
            page.setData({ title: arr[index].name, desc: desc, leftTime: arr[index].time, rightTime: arr[index].time, voice: arr[index].voice})
          }
        }
        
      },
      fail: function (res) {
        //console.log(res.errMsg)
      }
    })
  },
  leftStop: function () {
    clearInterval(this.leftInterval);
    this.leftInterval = 0;
    this.audioPause();
  },
  rightStop: function () {
    clearInterval(this.rightInterval);
    this.rightInterval = 0;
    this.audioPause();
  },
  leftStart: function () {
    this.rightStop();
    if (this.leftInterval && this.leftInterval != 0) {
      this.leftStop();
      return;
    }

    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
    })
    animation.rotate(this.leftMove+=100).step()
    this.setData({
      leftAnimationData: animation.export()
    })

    var leftInterval = setInterval(function () {
      if (this.data.leftTime <= 0) {
        this.leftStop();
        return;
      }

      if(this.data.leftTime <= this.data.voice) {
        this.audioPlay();
      }

      animation.rotate(this.leftMove += 100).step()
      this.setData({
        leftAnimationData: animation.export()
      })
      this.setData({leftTime: this.data.leftTime-1})
    }.bind(this), 1000)

    this.leftInterval = leftInterval;
  },
  rightStart: function () {
    this.leftStop();
    if (this.rightInterval && this.rightInterval != 0) {
      this.rightStop();
      return;
    }

    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
    })
    animation.rotate(this.rightMove += 100).step()
    this.setData({
      rightAnimationData: animation.export()
    })

    var rightInterval = setInterval(function () {
      if (this.data.rightTime <= 0) {
        this.rightStop();
        return;
      }

      if (this.data.rightTime <= this.data.voice) {
        this.audioPlay();
      }

      animation.rotate(this.rightMove += 100).step()
      this.setData({
        rightAnimationData: animation.export()
      })
      this.setData({ rightTime: this.data.rightTime - 1 })
    }.bind(this), 1000)

    this.rightInterval = rightInterval;
  },
  audioPlay: function () {
    this.audioCtx.play()
  },
  audioPause: function () {
    this.audioCtx.pause()
  }
})