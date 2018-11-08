var postsData = require('../../../data/data.js')

Page({
  data: {
    startTime: "请选择车位使用的预期开始时间",
    endTime: "请选择车位使用的预期结束时间"
  },


  onLoad: function (option) {
    var postId = option.id;
    this.data.currentPostId = postId;
    var postData = postsData.postList[postId];
    //this.data.postData = postData;
    this.setData(postData);


  },


  // onTap: function (event){
  //   wx.navigateTo({
  //     url: '../manage/manage',
  //   })
  // },

  //   onTap2: function (event) {
  //     wx.navigateTo({
  //       url: '../welcome/welcome',
  //     })
  // },
  bindStartTimeChange: function (event) {
    var time = event.detail.value;
    this.setData({
      startTime: time
    })
  },
  bindEndTimeChange: function (event) {
    var time = event.detail.value;
    this.setData({
      endTime: time
    })
  },

  onSubmit: function (event) {
    var startTime = event.detail.value.startTime;
    var endTime = event.detail.value.endTime;
    wx.navigateTo({
      url: '../order-info/order-info?start=' + startTime + '&end=' + endTime,
    })
  },
  onReset: function (event) {
    wx.navigateTo({
      url: '../search/search',
    })
  }
})