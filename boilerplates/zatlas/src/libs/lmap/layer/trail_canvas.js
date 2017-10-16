'use strict';

/**
 * @class HeatmapGrid
 */
var L = require('./../leaflet');
var Utils = require('./../core/utils');
var Canvas = require('./../render/canvas');
var getColorFunc = Utils.getColorFunc;
var Anim = require('./../core/animator');

/**
 * TrailCanvas 单根轨迹图
 * @param  {Object} 配置对象
 * @return {[type]}   [description]
 */
function TrailCanvas(options) {
  options = this.options = Utils.deepMerge(TrailCanvas.options, options);
  this.id = Math.floor(Math.random() * 10000000) + '_' + new Date().getTime();
  this.initialize(options);
}
TrailCanvas.options = {
    'lengthLimit': 15,
    'lifeSpeed': 0.5,
    'delay': 30,
    'isAutoUpdate': true,
    'lineSegmentLonger': 1, //比真实的线多出一段的像素值(绘制线的时候，为使接头更平滑)
    'spriteW': 200,
    'spriteH': 20,
    'flying': {
      'isable': true,
      'type': 'line',
      'ptsN': 9,
      'weight': function(ki){
        return 5 * Math.pow(ki, 3);
      },
      'spriteHead': null
    },
    'bgLine': {
      'isable': false,
      'opacity': 1,
      'color': 'rgba(105,105,105,1)',
      'weight': 5
    },
    'color': getColorFunc('rgba(0,150,150,0.8)', 'rgba(0,100,255, 1)', 'rgb', 'linear.Out.1'),
    'scale': function (d) {return 1;},
    'value': function (d, max, min) {return Math.min(1, d.length / 40);},
    'lng': Utils.getLng,
    'lat': Utils.getLat,
    'time': Utils.getTime
  };
  TrailCanvas.options = Utils.deepMerge(Anim.options, TrailCanvas.options);

  TrailCanvas = Anim.extend(TrailCanvas, {
  events: {
  },
  includes: [L.Mixin.Events],
  initialize: function (options) {
    var flyingOpt = options.flying;
    if (flyingOpt) {
      this.spriteFlying = flyingOpt.sprite || this.initSpriteFlying();
      this.ctxFlying = flyingOpt.ctx;
      if (options.flying.isSpriteHead) {
        this.spriteFlyingHead = options.flying.spriteHead || this.initSpriteFlyingHead();
      }
    }
    var bgLineOpt = options.bgLine;
    if (bgLineOpt) {
      this.ctxBgLine = bgLineOpt.ctx;
      this.spriteBgLine = bgLineOpt.sprite || this.initSpriteBgLine();
    }
    if (options.isAutoUpdate) this.initEventsAnim();
    this.isable = true;
  },
  addTo: function (map) {
    if (this._map || !map) return;
    this._map = map;
    if (this._data) this.updateZoom();
  },

  /**
   * processing 处理数据 找到一条轨迹中，时间范围以及boundingbox的范围
   */
  processing: function () {
    var ds = this._data;
    var options = this.options;
    var getTime = options.time;
    var getLat = options.lat;
    var getLng = options.lng;
    var lifeMax, lngMax, latMax;
    var lifeMin = lifeMax = getTime(ds[0], 0);
    var lngMin = lngMax = getLng(ds[0], 0);
    var latMin = latMax = getLat(ds[0], 0);
    latMin, latMax;
    var d, lat, lng, life;
    for (var i = 0; i < ds.length; i++) {
      d = ds[i];
      if (!d) continue;
      lat = getLat(d);
      lng = getLng(d);
      life = getTime(d, i);
      if (life > lifeMax) lifeMax = life;
      if (life < lifeMin) lifeMin = life;
      if (lat > latMax) latMax = lat;
      if (lat < latMin) latMin = lat;
      if (lng > lngMax) lngMax = lng;
      if (lng < lngMin) lngMin = lng;
    }
    this.lifeMax = options.lifeMax = lifeMax;
    this.lifeMin = options.lifeMin = lifeMin;
    var p1 = L.latLng(latMin, lngMin);
    var p2 = L.latLng(latMax, lngMax);
    this.bounds = L.latLngBounds(p1, p2);
  },

  /**
   * getBBox 获取此轨迹的boundingbox
   * @return {Object} L.latLngBounds格式的矩形区域
   */
  getBBox: function () {
    return this.bounds;
  },

  /**
   * [isInView 判断是否是在地图视图内
   * @param  {Object}  viewBounds L.latLngBounds格式的矩形区域 也可以没有
   * @return {Boolean}            是否在区域内
   */
  isInView: function (viewBounds) {
    viewBounds = viewBounds || this._map.getBounds();
    var bounds = this.bounds;
    var x2 = bounds._northEast.lng;
    var y2 = bounds._northEast.lat;
    var x1 = bounds._southWest.lng;
    var y1 = bounds._southWest.lat;
    var x4 = viewBounds._northEast.lng;
    var y4 = viewBounds._northEast.lat;
    var x3 = viewBounds._southWest.lng;
    var y3 = viewBounds._southWest.lat;
    return !((x3 < x1) && (x4 < x1) || (x3 > x2) && (x4 > x2) || (y3 < y1) && (y4 < y1) || (y3 > y2) && (y4 > y2));
  },

  /**
   * data 灌入数据
   * @param  {Object} data 带有经纬度的原始数据
   */
  data: function (d) {
    if (!d) return this._data;
    this._data = d;
    this.processing();
    this.resetVariables();
    if (this.options.isAutoUpdate && this._map) this.startAnim();
  },

  /**
   * render 灌入数据(可选)并绘制
   * @return {Array} 灌入数据 轨迹经纬度的组合
   */
  render: function (d) {
    if(d) this.data(d);
    this.startAnim();
  },

  /**
   * updateFlying 更新飞线部分的计算和绘制 计算从上一帧的时间开始 到现在的时间， 需要绘制哪些数据。
   */
  updateFlying: function () {
    var options = this.options;
    var flyingOpt = options.flying;
    if (!flyingOpt || !this.isable) return;
    var time = this.life;
    var ds = this._data;
    var getTime = options.time;
    var indexLast = this.indexLast || 0;
    var t, d;
    for (var i = indexLast; i < ds.length; i++) {
      d = ds[i];
      if(!d) continue;
      t = getTime (d, i);
      if (t > time) {
        this.indexLast = i;
        break;
      }
      this._addFlyingPt(d);
    }
    this._drawFlying();
  },

  updateOptions: function (options) {
    options = this.options = Utils.deepMerge(this.options, options);
    // this.initSpriteFlyingHead();
    // this.initSpriteBgLine();
  },

  resetVariables: function () {
    this.indexLast = 0;
    this.flyingPts = [];
    this.enable('flying');
    this.life = this.options.lifeMin || this.lifeMin;
  },

  enable: function (name) {
    if(!name || name === '') {
      this.enable('flying');
      this.enable('bgLine');
    }
    if(name === 'bgLine'){
      this.options.bgLine && (this.options.bgLine.isable = true);
    } 
    if(name === 'flying') this.options.flying && (this.options.flying.isable = true);
  },
  disable: function (name) {
    if(!name || name === '') {
      this.disable('flying');
      this.disable('bgLine');
    }
    if(name === 'bgLine') this.options.bgLine && (this.options.bgLine.isable = false);
    if(name === 'flying') this.options.flying && (this.options.flying.isable = false);
  },
 
  /**
   * _addFlyingPt 内部方法，维持一个飞线绘制所需要的点序列
   */
  _addFlyingPt: function (pt) {
    var options = this.options;
    var ptsN = options.flying.ptsN;
    var getLat = options.lat, getLng = options.lng;
    this.flyingPts.push({
      lat: getLat (pt),
      lng: getLng (pt)
    });
    if (this.flyingPts.length > ptsN) this.flyingPts.splice(0, 1);
  },

  equalTo: function(line){
    if(this.id === line.id) return true;
      return false;
  },

  /**
   * _drawFlying 绘制飞线部分
   */
  _drawFlying: function () {
    var options = this.options;
    var lengthLimit = options.lengthLimit;
    var lineSegmentLonger = options.lineSegmentLonger;
    var flyingOpt = options.flying;
    if (!flyingOpt || !flyingOpt.isable || !this.isable) return;
    var spriteFlying = this.spriteFlying, spriteFlyingHead = this.spriteFlyingHead;
    var spriteW = spriteFlying.width, spriteH = spriteFlying.height;
    var flyingPts = this.flyingPts;
    var latLngToContainerPoint = this._map.latLngToContainerPoint.bind(this._map);
    var ctx = this.ctxFlying;
    var pt, percent, N = flyingPts.length;
    var px, py, phi, distance, dx, dy;
    var weight = flyingOpt.weight;
    var getWeight = (typeof(weight) === 'function')?weight:function(){return weight;};
    var dX = 1 / N * spriteW * 1;
    for (var i = N - 1; i >= 0; i--) {
      pt = flyingPts[i];
      var p = latLngToContainerPoint(L.latLng(pt.lat, pt.lng));
      var x = p.x;
      var y = p.y;
      if (px || py) {
        percent = (i - 1) / N;
        dx = x - px;
        dy = y - py;
        phi = Math.atan2(dy, dx);// * 180 / Math.PI;
        distance = Math.sqrt(dx * dx + dy * dy) + lineSegmentLonger;
        if (distance < lengthLimit) {
          var w = getWeight(percent);
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(phi);
          var startX = percent * spriteW;
          ctx.drawImage(spriteFlying, startX, 0, dX, spriteH, 0, -w / 2, distance, w);
          ctx.restore();
          if (spriteFlyingHead && i >= N - 1) {
            var d = spriteFlyingHead.width;
            ctx.save();
            var tmp = ctx.globalCompositeOperation;
            ctx.globalCompositeOperation = 'destination-over';
            ctx.beginPath();
            ctx.drawImage(spriteFlyingHead,  x - w / 2, y - w / 2, w, w);
            ctx.closePath();
            ctx.globalCompositeOperation = tmp;
            ctx.restore();
          }
        }
      }
      px = x;
      py = y;
    }
  },

  /**
   * initSpriteFlying 新建飞线需要的sprite 即图片缓存 这步建议放在trails_canvas 组件里执行，因为新建图片的成本比较高 应该公用
   */
  initSpriteFlying: function () {
    var colorFunc = this.options.color;
    var canvas = document.createElement('canvas');
    var cw = this.spriteW = canvas.width = 1000;
    var ch = this.spriteH = canvas.height = 20;
    var ctx = canvas.getContext('2d');
    var ki, grd = ctx.createLinearGradient(0, 0, cw, ch), N = 300;
    for (var i = 0; i < N; i++) {
      ki = i / N;
      grd.addColorStop(ki, colorFunc(ki));
    }
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, cw, ch);
    this.spriteFlying = canvas;
    return canvas;
  },

  /**
   * initSpriteFlyingHead 新建飞线头上需要的sprite 即图片缓存 这步建议放在trails_canvas 组件里执行，因为新建图片的成本比较高 应该公用
   */
  initSpriteFlyingHead: function () {
    var colorFunc = this.options.color;
    var canvas = document.createElement('canvas');
    var r = canvas.width = canvas.height = 50;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = colorFunc(1);
    ctx.arc(r / 2, r / 2, r, 0, Math.PI * 2);
    ctx.fill();
    this.spriteFlyingHead = canvas;
    return canvas;
  },

  /**
   * initSpriteBgLine 新建bgLine需要的sprite 即图片缓存 这步建议放在trails_canvas 组件里执行，因为新建图片的成本比较高 应该公用
   */
  initSpriteBgLine: function () {
    var canvas = document.createElement('canvas');
    var cw = this.spriteW = canvas.width = 1000;
    var ch = this.spriteH = canvas.height = 20;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = this.options.bgLine.color;
    ctx.fillRect(0, 0, cw, ch);
    this.spriteBgLine = canvas;
    return canvas;
  },



  /**
   * updateBgLine 更新bgline的飞线
   */
  updateBgLine: function () {
    this._drawBgLine();
  },

  /**
   * drawBgLine 绘制bgLine的飞线
   */
  _drawBgLine: function () {
    var options = this.options;
    var bgLineOpt = options.bgLine;
    if (!bgLineOpt) return;
    if(!this.isable || !bgLineOpt.isable) return;
     var lengthLimit = options.lengthLimit;

    var lineSegmentLonger = options.lineSegmentLonger;
    var ctx = this.ctxBgLine;
    var spriteW = options.spriteW, spriteH = options.spriteH;
    var sprite = this.spriteBgLine;
    var latLngToContainerPoint = this._map.latLngToContainerPoint.bind(this._map);
    var ds = this._data, N = ds.length;
    var pt, percent;
    var px, py, phi, distance, dx, dy;
    var weight =  bgLineOpt.weight;
    var dX = 1 / N * spriteW * 1;
    for (var i = 0; i < N; i++) {
      pt = ds[i];
      var p = latLngToContainerPoint(L.latLng(pt.lat, pt.lng));
      var x = p.x;
      var y = p.y;
      percent = (i - 1) / N;
      if (px || py) {
        dx = x - px;
        dy = y - py;
        phi = Math.atan2(dy, dx);
        distance = Math.sqrt(dx * dx + dy * dy)  + lineSegmentLonger;
        if(lengthLimit > distance){
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(phi);
          var startX = percent * spriteW;
          ctx.drawImage(sprite, startX, 0, dX, spriteH, 0, -weight / 2, distance, weight);
          ctx.restore();
        }
      }
      px = x;
      py = y;
    }
  },

  /**
   * updateAnim 更新和动画有关的操作
   * @param  {Number} life 生命周期，在这里往往是时间，可选。
   */
  updateAnim: function (life) {
    //如果在视图范围外
    if (!this.isInView()) return;
    this.life = life = life || this.life || 0;
    if (this.isEnd()) return this.emit('lifeEnd');
    this.updateFlying();
  },

  isEnd: function () {
    return (this.life >= this.lifeMax + (this.options.delay || 0));
  },

  /**
   * updateMap 更新和地图平移，缩放有关的操作 包括bgLine的更新和飞线部分的更新
   * @param  {Object} viewBounds 地图的视窗区域
   */
  updateMap: function (viewBounds) {
    if (this.isInView(viewBounds)) {
      this._drawBgLine();
      // if(!this.isLooping) this._drawFlying();
    }
  },

  /**
   * initEventsAnim 和动画相关的事件，包括在动画周期停止的时候，停止主动动画，以及当主动更新发生时候，更新绘图
   * @return {[type]} [description]
   */
  initEventsAnim: function () {
    this
    .off('lifeEnd')
    .on('lifeEnd', function () {
      this.pause();
    })
    .off('update')
    .on('update', this.updateAnim.bind(this));
  },
  genOptions: function () {
    return TrailCanvas.prototype.options = Utils.deepMerge(Anim.prototype.genOptions(), TrailCanvas.prototype.options);
  }
});

TrailCanvas.prototype.genOptions();

var dmap = L.dmap = L.dmap || {};
dmap.TrailCanvas = TrailCanvas;
dmap.trailCanvas = function (options) {
  return new TrailCanvas(options);
};

module.exports = TrailCanvas;
