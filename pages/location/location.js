// pages/location/location.js
const app = getApp();
const AMapWX = app.globalData.AMapWX;
const amapKey = app.globalData.amapKey;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    map_height: 0,
    searchPanelShow: false,
    tips: {},
    longitude: '',
    latitude: '',
    markers: [],
    //detailStatus: false,
    //status: '',
    points: [],
    distance: '',
    cost: '',
    polyline: []
  },
  //输入框获得焦点时打开搜索面板
  onBindFocus: function(event) {
    console.log("focus");
    this.setData({
      searchPanelShow: true
    })
  },
  //按下enter键时触发
  onBindConfirm: function(event) {
    var that = this;
    var keywords = event.detail.value;
    console.log(keywords)
    var myAmap = new AMapWX({
      key: amapKey
    });
    myAmap.getInputtips({
      keywords: keywords,
      location: '',
      success: function(res) {
        if (res && res.tips) {
          that.setData({
            tips: res.tips
          });
        }
      }
    })
    //取tips中的第一个数据显示在地图上
    var firstItem = this.data.tips[0];
    var name = firstItem.name;
    var location = firstItem.location.split(',');
    this.setData({
      searchPanelShow: false,
      longitude: location[0],
      latitude: location[1],
      markers: [{
        id: 0,
        longitude: location[0],
        latitude: location[1],
        iconPath: '../../images/ding.png',
        width: 32,
        height: 32,
        anchor: {
          x: .5,
          y: 1
        },
        // label: {
        //   content: name,
        //   color: 'blue',
        //   fontSize: 12,
        //   borderRadius: 5,
        //   bgColor: '#fff',
        //   padding: 3,
        //   textAlign: 'center'
        // }
        callout: {
          content: "    语言：珊珊是不是傻    \n    预计到达时间：10分钟    \n    车牌号：12345 ",
          color: "#ff0000",
          fontSize: "16",
          borderRadius: "10",
          bgColor: "#ffffff",
          padding: "10",
          display: "ALWAYS"
        }
      }]
    })
  },
  //获取输入框内容并向服务器索取信息
  onBindInput: function(event) {
    var that = this;
    var keywords = event.detail.value;
    console.log(keywords)
    var myAmap = new AMapWX({
      key: amapKey
    });
    myAmap.getInputtips({
      keywords: keywords,
      location: '',
      success: function(res) {
        if (res && res.tips) {
          that.setData({
            tips: res.tips
          });
        }
      }
    })
  },
  //点击搜索项
  bindSearch: function(event) {
    var keywords = event.target.dataset.keywords;
    var location = event.target.dataset.location;
    location = location.split(',');
    if (this.data.markers.length > 1 && this.data.points.length > 1) {
      this.data.markers.pop();
      this.data.points.pop();
      this.setData({
        polyline: []
      });
    }
    //先出栈再获取markers和points
    var markers = this.data.markers;
    var points = this.data.points;

    markers.push({
      id: 1,
      longitude: location[0],
      latitude: location[1],
      iconPath: '../../images/navi_e.png',
      width: 32,
      height: 32
    });
    points.push({
      longitude: location[0],
      latitude: location[1]
    });
    this.setData({
      searchPanelShow: false,
      markers: markers,
      points: points
    })

    this.goTo();

    // this.setData({
    //   searchPanelShow: false,
    //   longitude: location[0],
    //   latitude: location[1],
    //   markers: [{
    //     id: 0,
    //     longitude: location[0],
    //     latitude: location[1],
    //     iconPath: '../../images/ding.png',
    //     width: 32,
    //     height: 32,
    //     anchor: {
    //       x: .5,
    //       y: 1
    //     },
    // label: {
    //   content: keywords,
    //   color: 'blue',
    //   fontSize: 12,
    //   borderRadius: 5,
    //   bgColor: '#fff',
    //   padding: 3,
    //   textAlign: 'center'
    // }
    //   }]
    // })
  },

  goTo:function() {
    var myAmap = new AMapWX({
      key: amapKey
    });
    myAmap.getDrivingRoute(this.getDataObj());
  },

  getDataObj() {
    var that = this;
    var color ="#0091ff";

    return {
      origin: that.data.points[0].longitude + ',' + that.data.points[0].latitude,
      destination: that.data.points[1].longitude + ',' + that.data.points[1].latitude,
      success(data) {
        var points = [];
        if (!data.paths || !data.paths[0] || !data.paths[0].steps) {
          wx.showToast({
            title: '失败！'
          });
          return;
        }
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        that.setData({
          distance: data.paths[0].distance,
          cost: parseInt(data.paths[0].duration / 60),
          polyline: [{
            points: points,
            color: color,
            width: 6
          }]
        });
      },
      fail(info) {
        wx.showToast({
          title: '失败！'
        })
      }
    }
  },
  //取消搜索，关闭搜索界面
  onCancelSearch: function(event) {
    this.setData({
      searchPanelShow: false
    })
    console.log('CancelSearch')
  },

  onBindMarkerTap: function(event) {
    var markerID = event.markerId;
    var longitude = this.data.markers[markerID].longitude;
    var latitude = this.data.markers[markerID].latitude;
    console.log(longitude + '\n' + latitude)
  },

  onPrivate: function() {
    wx.navigateTo({
      url: '../my/my',
    })
  },

  onUseParkingSpace: function(event) {
    wx.showActionSheet({
      itemList: [
        '预约车位',
        '发布车位'
      ],
      itemColor: '#405f80',
      success: function(res) {
        //res.cancel
        //res.tapInde
      }
    })

  },

  onMoveToLocation: function(event) {
    this.mapCtx.moveToLocation()
    console.log('asdsa')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    this.mapCtx = wx.createMapContext('myMap')
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          map_height: res.windowHeight - 80
        })
      },
    })
    wx.getLocation({
      success: function(res) {
        if (res && res.longitude) {
          that.setData({
            longitude: res.longitude,
            latitude: res.latitude,
            points: [{
              longitude: res.longitude,
              latitude: res.latitude
            }],
            markers: [{
              id: 0,
              longitude: res.longitude,
              latitude: res.latitude,
              iconPath: '../../images/ding.png',
              width: 32,
              height: 32
            }]
          })
        }
      }
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