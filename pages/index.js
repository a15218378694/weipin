var util = require('../utils/util.js');
var WxAutoImage = require('../utils/WxAutoImage/WxAutoImage.js');//返回计算后的图片宽高

const ImgLoader = require('../utils/img-loader/img-loader.js')//图片预加载组件

Page({
  data:{
      "URL" : 1,
      'autoplay': true,
      'interval': 3500,
      'duration': 500,
      'loaded': false,
      'indicator-dots' : false,
      "is_over" : false,
      "no_data" : false,
      "goods_img" : {
        "imageWidth" : 0,
        "imageheight" : 0
      },
      "banner_img" : {
        "imageWidth" : 0,
        "imageheight" : 0
      },
      "nav_scroll_left" : 0,
      "page_cate" : [], // page_cate_{id}
      "current" : 1
   },
  onLoad:function(options){
      
     wx.hideShareMenu();

     var self = this;
     
     self.getConfig();//设置了很多东西   包括各种情况的提示信息   没有返回值
    //检查网络  有网就执行成功回调
     util.checkNet({
        success : function() {
          util.succNetCon(self);//成功检测到网络后设置的标记
          self.goodsCate();//发起请求
          self.imgLoader = new ImgLoader(self, self.imageOnLoad.bind(self))
        },
        error : function() {
          util.notNetCon(self,1);//没网络设置的标记
        }
     });
     
    // 页面初始化 options为页面跳转所带来的参数
  },
  loadImages() {
       util.loadding(this,1);  //self.setData({page : {"load" : 0,"operate" : operate}}); 
      //同时发起全部图片的加载
      this.data.goods.forEach(item => {
          this.imgLoader.load(item.image_url)
      })

      if(this.data.goods.length <= 0) {
          this.setData({'image_load' : 1});
      }
  },
  //加载完成后的回调
  imageOnLoad(err, data) {
     const goods = this.data.goods.map(item => {
          if (item.image_url == data.src)
              item.loaded = true
          return item
      })

     if(this.data.goods_img.imageheight == 0) {
        this.setData({'image_load' : 1});
        this.setData({"goods_img" : WxAutoImage.wxAutoImageCal(data.ev)});
     }
      
      this.setData({ goods : goods })
      util.loaded(this);
  },
  //配置方法
  getConfig:function() {
     this.baseApiUrl = util.config('baseApiUrl'); //得到baseURL
     this.size = util.config('page_size');//得到数字20
     this.offset = util.config('page_offset');//偏移是0
     this.page = 1;//当前页数是1

     this.setData({
       "pullload_text" :  util.config('pullload_text')//下拉页面加载提示信息  是一个对象
     });
  },
  pullDown: function( e ) {
    this.setData({"pullDown" : 1});
    this.page = this.page + 1;
    this.goodsList();
  },
  pullUpLoad: function(e) {
    
  },
  goTop: function(e) {
    this.setData({
      "scroll_Top" : -Math.random()
    });
  },
  scroll:function(e) {
    if(this.data.windowHeight < e.detail.scrollTop) {
       this.setData({"goTopClass" : 'top-button-show-nav'});
    } else {
      this.setData({"goTopClass" : 'top-button-hide'});
    }
  },
  onReady:function(){
    //wx.hideNavigationBarLoading();
    // 页面渲染完成
  },
  onShow:function(){
    wx.getSystemInfo( {
      success: ( res ) => {
        this.setData( {
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
    
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  //监听用户下拉动作
  onPullDownRefresh:function() {

     wx.hideShareMenu();

     var self = this;
     
     self.getConfig();

     util.checkNet({
        success : function() {
          util.succNetCon(self);
          self.goodsCate();
          self.imgLoader = new ImgLoader(self, self.imageOnLoad.bind(self))
        },
        error : function() {
          util.notNetCon(self,1);
        }
     });
     
    //this.refresh();
    //this.bannerList();
   
  },
  error:function(data) {
    this.setData({page : {load : 1}});
    if(data['result'] == 'fail') {
       util.toast(this,data.error_info);
    }
  },
  bannerList:function() {
    var url = this.baseApiUrl + "?g=Api&m=Banner&a=lists";
    
    var self = this;
    var page = 0;
    if(this.cate_id != undefined) {
       page = this.cate_id;
       console.log("page",page)
    }

    if(self.pagedata == undefined) {
      self.pagedata  = {};
    }

    if(self.pagedata != undefined && self.pagedata[page] != undefined) {
      var pagedata = self.pagedata[page];
      var agoData = page.goods;
    } else {
      self.pagedata[page] = {};
    }
   
    util.ajax({
      "url" :  url,
      "success" : function(data) {
          self.pagedata[page].banners = data.banners;
          self.setData({
            "banners" : data.banners
          });
        }
     });
  },   
  goodsList:function() {
    if(this.data.no_data) return true;
    var offset = (this.page - 1) * this.size;
    var size = this.size;//20
    var data = {
      "offset" : offset,//0
      "size" : size//20
    };

    var url = this.baseApiUrl + "?g=Api&m=Goods&a=lists";
    
    var page = 0;
    if(this.cate_id != undefined && this.cate_id != 0) {
       //data.cate_id = this.cate_id; //当前分类商品
       data.parent_cate = this.cate_id; //获取当前分类 及 孩子 商品
       page = this.cate_id;
    } 

    if(offset == 0 && this.cate_id) {
      util.loadding(this,1);//不是第一次进入加上加载背景 
    }
    
    var self = this;
 

    util.ajax({
      "url" : url,
      "data" : data,
      "success" : function(data){

          wx.showShareMenu();

          // 先加载 商品 后加载公告  //这时候商品已加载  这是成功回调
          if(page == 0 && self.cate_id == 0) {
            
            self.bannerList();
          }   

         var allData = '';

         if(self.pagedata == undefined) {
            self.pagedata  = {};
         }

         
         if(self.pagedata != undefined && self.pagedata[page] != undefined) {
            var pagedata = self.pagedata[page];
            var agoData = pagedata.goods;
         } else {
            self.pagedata[page] = {};
         }
          
        var goods = data.shopList[data.shopList];
        if(data.goods.length != 0) {
            if(data.goods.length < self.size) {
              self.setData({
                "is_over" : 1,
                "no_data" : 1
              });
              
            }
            if(agoData) {
              allData = agoData;
              goods.map(function(good) {
                allData.push(good);
              });
            } else {
              allData = goods;
            }
            self.setData({loaded:true});

            self.pagedata[page].goods = allData;
            
            self.setData({
              goods : allData
            });

            self.loadImages();
        }  else {
          if(self.data.goods == false) {
            self.setData({goods : []});
            self.pagedata[page].goods = [];
          }
          self.setData({
            "is_over" : 1,
            "no_data" : 1
          });
         
        } 
        
     
       //self.loaded();
      }
    });
  },
  cusImageLoad: function (e){

    var id = e.currentTarget.dataset.id;
    var that = this;
    var data = {};
    
    if( data[id] == undefined) {
      data[id] = WxAutoImage.wxAutoImageCal(e);
      that.setData(data);
      this.setData({'image_load' : 1});
    }
    util.loaded(this);
  },
  cusImageGoods:function (e){
      var that = this;
      that.setData(util.imageUtil(e));
  },
  //goodsCate代表商品分类  导航栏
  goodsCate:function(e){
    var offset = 0;
    var size = 100;
    var data = {
      "offset" : offset,
      "size" : size
    };
    var url = this.baseApiUrl + "?g=api&m=goodsCate&a=lists";
    var self = this; 
    util.ajax({
      "url" : url,
      "data" : data,
      "success" : function(data){
        self.loaded();//设置page为对象load:1
        if(data.result == 'ok') {
           self.cate_id = 0;
           self.goodsList(); //设置了偏移0和size20   发送了请求商品列表
           self.setData({
              "cates" : data.cates//拿到一个数组  里面包含所有内容
           });
        }
      }
    });
  },
  loadding:function() {
    this.setData({page : {load : 0}});
 },
 loaded : function() {
    this.setData({page : {load : 1}});
 },
 //首页分类选择
 channelRendered:function(e) {
      
      var nav_scroll_left = 0;
      this.cate_id = e.currentTarget.dataset.cate_id;
      this.current_index = e.currentTarget.dataset.index;
      var nav_temp = 0;
      if(this.data.current_index == undefined || this.data.current_index < this.current_index) {
         if(this.data.cates.length  - this.current_index >= 2 &&  this.current_index >= 2) {
            nav_scroll_left =  parseInt((this.current_index - 2)) *  this.data.windowWidth + this.data.windowWidth / 5;
            this.setData({"nav_scroll_left" : nav_scroll_left - 20});
         }  
      } else if(this.data.current_index > this.current_index) {
        if(this.data.cates.length - this.current_index > 3) {
          if(this.current_index > 1) {
            nav_scroll_left =  -(parseInt((this.current_index - 2)) *  this.data.windowWidth - this.data.windowWidth / 5);
          }
          this.setData({"nav_scroll_left" : nav_scroll_left - 20});
        }  
      }
      this.setData({"current_index" : this.current_index});
      this.refresh();
      
      
  },
  //初始化数据
  refresh:function() {
     //判断缓存中是否有数据
     var page = 0;
     var self = this;

     //读取缓存数据
     if(this.cate_id != undefined) {
        page = this.cate_id;
     }

     if(this.pagedata != undefined && this.pagedata[page] != undefined) {
       wx.showShareMenu();
       this.setData(this.pagedata[page])
       util.loaded(this);
       return ;
     } 

     //后端加载数据
     util.loadding(this,1);
     
     //检查网络
     util.checkNet({
       success : function() {
          if(self.data.notNetCon.error) {
             util.succNetCon(self);
             self.goodsCate();
             self.imgLoader = new ImgLoader(self, self.imageOnLoad.bind(self))
          } else {
              //正常刷新数据
              self.setData({
              'goods' : false,
              'is_over' : 0,
              'no_data' : 0,
              "scroll_Top" : -Math.random(),
              "pullDown" : 0,
              "banners" : []
            });
            self.page = 1;
            self.goodsList();
            util.loaded(self);
          }
        },
      error : function() {
        self.setData({goods : false});
        util.notNetCon(self,0);
      }
    });     
  },
  onShareAppMessage: function () {
     return getApp().share({title : "",desc : "",path : ""});
  },
  bindRedirect:function(e) {
    var url = e.currentTarget.dataset.url;
    if(!url) return false;
    wx.navigateTo({
      "url": url,
    })
  },
  bannerDetail:function(e) {
    var index = e.target.dataset.index;
    var url = this.data.banners[index].target_url;
    if(!url) return false;
    if(this.data.banners[index].banner_type == '0') return false;
    wx.navigateTo({
      url: url 
    })
  },
  bindchange:function(e) {
    var current = e.detail.current + 1;
    this.setData({current : current});
  },
})