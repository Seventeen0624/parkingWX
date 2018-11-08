Page({

  data: {
    startTime: '',
    endTime: ''
  },
  onLoad: function(options) {
    var startTime = options.start;
    var endTime = options.end;
    this.setData({
      startTime:startTime,
      endTime:endTime
    })
  }
})