var postsData = require('../../../data/data.js')

Page({
  data: {
    searchPanelShow: false
  },

  onLoad: function () {


    this.setData({
      posts_key: postsData.postList
    });
  },

  onPostTap: function (event) {
    var postId = event.currentTarget.dataset.postid;

    //console.log("on post id is"+postId);
    wx.navigateTo({
      url: '../confirm/confirm?id=' + postId,
    })

  }


})