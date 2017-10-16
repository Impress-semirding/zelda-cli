'use strict';

/**
 * @class HeatmapGrid
 */
var L = require('./../leaflet');
var Utils = require('./../core/utils');
var Canvas = require('./../render/canvas');
var getColorFunc = Utils.getColorFunc;
var Anim = require('./../core/animator');
var TrailCanvas = require('./trail_canvas');

/**
 * @class TrailsCanvas 大量轨迹的绘制，基于canvas 包括2部分。 飞线(flying)部分， 看视窗内此刻的轨迹位置 背景线(bgLine)部分, 绘制视窗内所有的轨迹
 */

/**
 * TrailsCanvas 生成网格型点图
 * @param  {Object}  options
 */
function TrailsCanvas(options) {
  options = this.options = Utils.deepMerge(TrailsCanvas.options, options);
  this.initialize(options);
}

TrailsCanvas.options = {
    'lineN': 1000,
    'lifeSpeed': 1,
    'isAutoUpdate': true,
    'trail': {
      'delay': 2,
      'lifeSpeed': 1.5,
      'lengthLimit': 60,
      'lineSegmentLonger': 0,
      'isAutoUpdate': false,
      'spriteW': 200,
      'spriteH': 20,
      'flying': {
        'container': '#canvas',
        'isable': true,
        'blending': 'lighter',
        'type': 'line',
        'ptsN': 25,
        'weight': function (ki) {
          return 5 * Math.pow(ki, 3);
        },
        'isSpriteHead': true
      },
      'color': getColorFunc('rgba(150,0,0,0.3)', 'rgba(250,150,0, 1)', 'rgb', 'linear.Out.2'),
      // 'color': getColorFunc('rgba(0,100,170,0.3)', 'rgba(220, 20, 130, 1)', 'rgb', 'linear.Out.3'),
      'value': function (d, max, min) {return Math.min(1, d.length / 40);},
      'lng': Utils.getLng,
      'lat': Utils.getLat,
      'time': Utils.getTime,
    },
    'pts': function (d) {return d.p;},
    'id': Utils.getID,
    'lifeMin': 0,
    'lifeMax': 100000000000
  };
  
var TrailsCanvas = Anim.extend(TrailsCanvas, {
  events: {
  },
  initialize: function (options) {
    this.isable = true;
    //
    var trail = options.trail;
    this.lifeMax = options.lifeMax;
    this.lifeMin = options.lifeMin;
    this.life = this.lifeMin;
    this.initSpriteFlying();
    trail.flying && this.initSpriteFlyingHead();
    if (options.isAutoUpdate) this.initEventsAnim();
  },
  /**
   * initCanvas 生成可视化需要的各个图层
   */
  initCanvas: function () {
    var options = this.options;
    var trail = options.trail;
    var bgLineOpt = trail.bgLine;
    if (bgLineOpt) {
      var opacityBgline = bgLineOpt.opacity;
      var blendingBgline = bgLineOpt.blending;
      this.lcanvasBg = new Canvas(this._map, bgLineOpt.container, {
        clearAlpha: 0.9
      });
      var ctxBg = this.ctxBg = this.lcanvasBg.ctx;

      ctxBg.globalAlpha = opacityBgline;
      ctxBg.globalCompositeOperation = blendingBgline;
      bgLineOpt.ctx = ctxBg;
    }
    //
    var flyingOpt = trail.flying;
    if (flyingOpt) {
      var blendingFlying = flyingOpt.blending;
      this.lcanvas = new Canvas(this._map, flyingOpt.container, {
        clearAlpha: 1
      });
      var ctxFlying = this.ctxFlying = this.lcanvas.ctx;
      ctxFlying.globalCompositeOperation = blendingFlying;
      flyingOpt.ctx = ctxFlying;
    }
  },

  addTo: function (map) {
    if (this._map || !map) return;
    this._map = map;
    this.initCanvas();
    this.initTrails();
    this.initEventsMap();
    if (this._data) this.updateZoom();
  },

  clear: function() {
    var using = this.using;
    var unusing = this.unusing;
    var flyingline;
    for (var i in using) {
      flyingline = using[i];
      flyingline.reset();
    }
    this.using = [];
    unusing = [];
    var trails = this.trails;
    for (var j in trails) {
      unusing[j] = trails[j];
    }
    this.unusing = unusing;
  },
  reset: function () {
    var unusing = this.unusing = [];
    this.using = [];
    var trails = this.trails;
    for (var i = 0; i < trails.length; i++) {
      var trail = trails[i];
      trail.stop && trail.stop();
      trail.pause && trail.pause();
      trail.resetVariables();
    }
    this.life = this.options.lifeMin;
    //
    this.using = [];
    var  trails = this.trails;
    for (var j = 0; j < trails.length; j++) {
      unusing.push(trails[j]);
    }
    this.resume();
  },

  initCacheColor: function () {},

  /**
   * data 灌入数据
   * @param  {Object} data 带有经纬度的原始数据
   */
  data: function (d) {
    if (!d) return this._data;
    var unusing = this.unusing, using = this.using;
    if (!unusing || !unusing.length) return;
    var trail = unusing.pop();
    //
    var options = this.options;
    var getPts = options.pts;
    var pts = getPts(d);
    trail.updateOptions({
      lifeMin: 0,
      lifeMax: pts.length
    });
    trail.data(pts);
    //
    using.push(trail);
    if (this.options.isAutoUpdate && this._map && !this.loopid) this.startAnim();
    // this.updateMap();
  },

  datas: function (ds) {
    if (!ds) return this._data;
    for(var i in ds){
      this.data(ds[i]);
    }
  },
  /**
   * initTrails 初始化所有的轨迹
   */
  initTrails: function () {
    var options = this.options;
    var trailOpt = options.trail;

    var using = this.using = [], unusing = this.unusing = [];
    //
    var map = this._map;
    var trails = this.trails = [];
    var lineN = options.lineN;
    
    // var ctxFlying = this.ctxFlying;
    // var ctxBg = this.ctxBg;
    // trailOpt.flying.ctx = this.ctxFlying;
    var d, pts, trail;
    for (var i = 0; i < lineN; i++) {
      trail = new TrailCanvas(trailOpt);
      trail.addTo(map);
      this.initEventsTrail(trail);
      trails.push(trail);
      unusing.push(trail);
    }
  },

  checkTrail: function(line) {
    if(!line.isEnd()) return;
    var using = this.using;
    var bol = false;
    for (var i in using) {
      if (using[i].equalTo(line)) {
        bol = true;
        using.splice(i, 1);
        break;
      }
    }
    if (bol){
      this.unusing.push(line);
    } 
  },

  initEventsTrail: function (line) {
    var self = this;
    line
    .on('lifeEnd', function (e) {
      self.emit('flying-end', line._data);
    });
  },

  updateOptions: function () {
    var options = this.options;
    var trail;
    //
    var trails = this.trails;
    for (var i in trails) {
      trail = trails[i];
      trail.updateOptions(options);
    }
  },
  render: function () {
  },

  /**
   * updateAnim 更新和动画（时间）变化有关的绘制
   */
  updateAnim: function (life) {
    if(!this.isable) return;
    this.iii = this.iii || 0;
    // if(this.iii++ % 100 === 0) console.log(this.using.length + '并行绘制;' + this.unusing.length + '空闲');
    var ctx = this.ctxFlying;
    this.lcanvas.clear();
    // ctx && ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    life = life || this.life;
    var using = this.using;
    var trailOpt = this.options.trail;
    for (var i = using.length - 1; i >= 0; i--) {
      var trail = using[i];
      life = trail.life + trailOpt.lifeSpeed;
      trail.updateAnim(life);
      this.checkTrail(trail);
    }
  },

  /**
   * updateMap 更新和地图视窗变化有关的绘制
   */
  updateMap: function () {
    if(!this.isable) return;
    var ctxBg = this.ctxBg;
    ctxBg && ctxBg.clearRect(0, 0, ctxBg.canvas.width, ctxBg.canvas.height);
    var ctxFlying = this.ctxFlying;
    ctxFlying && ctxFlying.clearRect(0, 0, ctxFlying.canvas.width, ctxFlying.canvas.height);
    var viewBounds = this._map.getBounds();
    var using = this.using;
    for (var i = 0; i < using.length; i++) {
      var trail = using[i];
      if (trail) trail.updateMap(viewBounds);
    }
  },

  clean: function () {
    var ctxBg = this.ctxBg;
    ctxBg && ctxBg.clearRect(0, 0, ctxBg.canvas.width, ctxBg.canvas.height);
    var ctxFlying = this.ctxFlying;
    ctxFlying && ctxFlying.clearRect(0, 0, ctxFlying.canvas.width, ctxFlying.canvas.height);
  },

  enable: function () {
    this.isable = true;
    this.resume();
    this.updateMap();
  },
  disable: function () {
    this.clean();
    this.pause();
    this.isable = false;
  },

  /**
   * initEventsMap 和地图有关的事件
   */
  initEventsMap: function () {
    var self = this;
    this._map
    .on('movestart', function () {
      self.clean();
      // self.pause();
    })
    .on('moveend', function () {
      // self.resume();
      self.updateMap();
    }.bind(this));
    // .on('zoomend', function () {
    //   self.updateMap();
    // });
  },
  /**
   * initSpriteFlying 新建飞线需要的sprite 即图片缓存 这部 建议放在trails_canvas 组件里执行，因为新建图片的成本比较高 应该公用
   */
  initSpriteFlying: function () {
    var trailOpt = this.options.trail;
    var colorFunc = trailOpt.color;
    var canvas = document.createElement('canvas');
    var cw = this.spriteW = canvas.width = trailOpt.spriteW;
    var ch = this.spriteH = canvas.height = trailOpt.spriteH;
    var ctxFlying = canvas.getContext('2d');
    var ki, grd = ctxFlying.createLinearGradient(0, 0, cw, ch), N = 100;
    for (var i = 0; i < N; i++) {
      ki = i / N;
      grd.addColorStop(ki, colorFunc(ki));
    }
    ctxFlying.fillStyle = grd;
    ctxFlying.fillRect(0, 0, cw, ch);
    this.spriteFlying = canvas;
    trailOpt.flying.sprite = canvas;
  },

  /**
   * initSpriteFlyingHead 新建飞线头上需要的sprite 即图片缓存 这步建议放在trails_canvas 组件里执行，因为新建图片的成本比较高 应该公用
   */
  initSpriteFlyingHead: function () {
    var trailOpt = this.options.trail;
    var colorFunc = trailOpt.color;
    var canvas = document.createElement('canvas');
    var d = canvas.width = canvas.height = 50;
    var r = d / 2;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = colorFunc(1);
    ctx.arc(r, r, r, 0, Math.PI * 2);
    ctx.fill();
    this.spriteFlyingHead = canvas;
    trailOpt.flying.spriteHead = canvas;
    return canvas;
  },

  select: function (obj) {
    var trail, id, trails = this.trails;
    this.clean();
    for(var i = 0; i < trails.length; i++){
      trail = trails[i];
      id = trail.id;
      if(obj && id in obj){
        trail.enable();
        trail.updateBgLine();
      } else {
        trail.disable();
      }
    }
  },

  unselect: function () {
    var trail, id, trails = this.trails;
    this.clean();
    for(var i = 0; i < trails.length; i++){
      trail = trails[i];
      trail && trail.enable('flying');
      trail && trail.disable('bgLine');
    }
  },


  /**
   * initEventsAnim 和动画有关的事件
   */
  initEventsAnim: function () {
    this
    .on('update', function (life) {
      this.updateAnim(life);
    });
  },
  genOptions: function(){
    return TrailsCanvas.prototype.options = Utils.deepMerge(Anim.prototype.genOptions(), TrailsCanvas.prototype.options);
  },
});

var dmap = L.dmap = L.dmap || {};
dmap.TrailsCanvas = TrailsCanvas;
dmap.trailsCanvas = function (options) {
  return new TrailsCanvas(options);
};
TrailsCanvas.prototype.genOptions();

module.exports = TrailsCanvas;
