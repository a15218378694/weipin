var t = getApp(),
    e = require("../../utils/api.js"),
    i = require("../../template/tooltip/index.js");
Page({
    data: {
        list: 
        [
        //   {
        //     url: "/pages/face/index",
        //     icon: "../../images/drupal.png",
        //     title: "群聊逗比表情",
        //     tip: "想要的表情包，这里都有～"
        // }, {
        //     url: "/pages/photo/index",
        //     icon: "../../images/female.png",
        //     title: "群好友颜值榜",
        //     tip: "看看谁最美，比比谁最帅～"
        // }
        ],
        myJson:[
          {
            // appId: "wx89e6b26f2bd907c1",
            url: "/pages/face/index",
            icon: "../../images/drupal.png",
            title: "斗图法宝",
            tip: "想要的表情包，这里都有～"
          },
          // {
          //   "appId": "wxf31e1f0d969d341e",
          //   "url": "/pages/index/index?cid=1&from=qwzs",
          //   "icon": "../../images/clock.png",
          //   "title": " 百万节日祝福",
          //   "tip": "好友祝福，满满的爱意~"
          // },
          // {
          //   "appId": " wxcd26fddd8702f0a7",
          //   "url": "/pages/list/index?cid=1&from=qwzs",
          //   "icon": "../../images/clock.png",
          //   "title": "种树送大礼",
          //   "tip": "好友祝福，满满的爱意~"
          // },
          // {
          //   "appId": "wxcd26fddd8702f0a7",
          //   "url": "/pages/list/index?cid=1&from=qwzs",
          //   "icon": "../../images/clock.png",
          //   "title": "猜歌",（不知道 不是我做，是文总拿给别人调通 ）
          //   "tip": "好友祝福，满满的爱意~"
          // },
          // {
          //   "appId": "wxcd26fddd8702f0a7",
          //   "url": "/pages/list/index?cid=1&from=qwzs",
          //   "icon": "../../images/clock.png",
          //   "title": "超级惠选",
          //   "tip": "好友祝福，满满的爱意~"
          // },
          {
            // "appId": "wx7f5cb3f08c6704bb",
            "url": "/pages/list/index?cid=1&from=qwzs",
            "icon": "../../images/clock.png",
            "title": "好友祝福",
            "tip": "好友祝福，满满的爱意~"
          
          },
          {
            // "appId": "wx7f5cb3f08c6704bb",
            // "url": "/pages/list/index?cid=1&from=qwzs",
            "url":"/pages/cishi/cishi",
            "icon": "../../images/iphone.png",
            "title": "植树",
            "tip": "好友祝福，满满的爱意~"
          },
          {
            // "appId": "wx89e6b26f2bd907c1",
            // "url": "/pages/photo/index?cid=1&from=qwzs",
            // "appId": "wx89e6b26f2bd907c1",
            "url": "/pages/list/index?c?from=qwzs", 
            "icon": "../../images/clock.png",
            "title": "猜歌",
            "tip": "好友祝福，满满的爱意~"
          },
          {
            // "appId": "wx7f5cb3f08c6704bb",
            "url": "/pages/list/index?cid=1&from=qwzs",
            "icon": "../../images/clock.png",
            "title": "超级惠选",
            "tip": "好友祝福，满满的爱意~"
          },
        ],
        listAll:[],
        link: 1,
        show: 0,
        errMsg: "",
        tooltip: {
            show: !0,
            linkUrl: "/pages/link/guide",
            content: "点这关注群玩助手公众号，获取最新动态"
        }
    },
    // onLoad:function(){    
    //   wx.request({
    //     url: 'http://xcx.shengmiguo.com/link.php', 
    //     data: {
    //     },
    //     header: {
    //       'content-type': 'application/json' // 默认值
    //     },
    //     success: function (res) {
    //       this.listAll = res.data.list
    //       console.log(102310, this.listAll)
  
         
    //     }
    //   })
    // },
    // https://wxshow.vipsinaapp.com
    onShow: function() {
      console.log(t.globalData.userInfo,3030)
        i.init(this);
        var a = this;
        e.request({
            url: e.config.conf,
            params: {
                token: t.globalData.userInfo.token || ""
            },
            success: function(t) {
                if (t) {
                    var e = {
                        link: t.link || 0
                    };
                    t.list && (e.list = t.list), a.setData(e)
                }
            }
        })
    },
    linkTo: function(t) {

        var e = t.currentTarget.dataset.index,
          i = this.data.list[e]
          console.log(i,565656)
            i.appId ? wx.navigateToMiniProgram({
            appId: i.appId,
            path: i.url || "",
            extraData: i.params || {},
            success: function(t) {
              console.log("成功")
            }
        }) 
        :
         i.url ? wx.navigateTo({
            url: i.url
        }) : 
        /^\d+[-\s]*\d+$/.test(i.tel) && wx.makePhoneCall({
            phoneNumber: i.tel
        })
    }
});