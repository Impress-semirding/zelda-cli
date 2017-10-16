'use strict';

/**
 * @class HeatmapGrid
 */
var L = require('./../leaflet');
var Utils = require('./../core/utils');
var Canvas = require('./../render/canvas');
var getColorFunc = Utils.getColorFunc;
var switchValue = Utils.switchValue;
var Anim = require('./../core/animator');
var getSprite = require('./../core/utils').getSprite;


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
  'container': null, //传入
  //
  'isable': true,
  'isableDraw': true,
  'type': 'line',
  'ptsN': 9,
  'weight': function(d, percent) {
    return 5 * Math.pow(percent, 3);
  },
  pts: function(d){
    return d.pts;
  },
  'spriteHead': true,
  'color': getColorFunc('rgba(0,150,150,0.8)', 'rgba(0,100,255, 1)', 'rgb', 'linear.Out.1'),
  //
  'scale': function(d) {
    return 1;
  },
  'size': function(d, zoom){
    return 15;
  },
  'value': function(d, max, min) {
    return Math.min(1, d.length / 40);
  },
  'lng': Utils.getLng,
  'lat': Utils.getLat,
  'time': Utils.getTime
};

TrailCanvas.options = Utils.deepMerge(Anim.options, TrailCanvas.options);

TrailCanvas = Anim.extend(TrailCanvas, {
  events: {},
  includes: [L.Mixin.Events],
  initialize: function(options) {
    this.ctx = options.ctx;
    if (options.spriteHead) {
      this.spriteHead = options.spriteHead || this.initSpriteFlyingHead();
    }
    if (options.isAutoUpdate) this.initEventsAnim();
  },
  addTo: function(map) {
    if (this._map || !map) return;
    this._map = map;
    if (this._data) this.updateZoom();
  },

  /**
   * processing 处理数据 找到一条轨迹中，时间范围以及boundingbox的范围
   */
  processing: function() {
    var ds = this.pts;
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
  getBBox: function() {
    return this.bounds;
  },

  /**
   * [isInView 判断是否是在地图视图内
   * @param  {Object}  viewBounds L.latLngBounds格式的矩形区域 也可以没有
   * @return {Boolean}            是否在区域内
   */
  isInView: function(viewBounds) {
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
  data: function (ds) {
    if (!ds) return this._data;
    var options = this.options;
    var getPts = options.pts.bind(options);
    this._data = ds;
    this.pts = getPts(ds);
    this.processing();
    this.resetVariables();
    if (this.options.isAutoUpdate && this._map) this.startAnim();
  },

  append: function(d) {
    if (!this._data) return console.log('初始数据没有');
    this.pts.append(d);
  },

  /**
   * render 灌入数据(可选)并绘制
   * @return {Array} 灌入数据 轨迹经纬度的组合
   */
  render: function(d) {
    if (d) this.data(d);
    this.startAnim();
  },

  /**
   * updateFlying 更新飞线部分的计算和绘制 计算从上一帧的时间开始 到现在的时间， 需要绘制哪些数据。
   */
  updateFlying: function() {
    var options = this.options;
    if (!this.options.isable) return;
    var time = this.life;
    var ds = this.pts;
    var getTime = options.time;
    var indexLast = this.indexLast || 0;
    var t, d;
    for (var i = indexLast; i < ds.length; i++) {
      d = ds[i];
      if (!d) continue;
      t = getTime(d, i);
      if (t > time) {
        this.indexLast = i;
        break;
      }
      this._addFlyingPt(d);
    }
    this._drawFlying();
  },

  updateOptions: function(options) {
    options = this.options = Utils.deepMerge(this.options, options);
  },

  resetVariables: function() {
    this.indexLast = 0;
    this.flyingPts = [];
    this.enable('flying');
    this.life = this.options.lifeMin || this.lifeMin;
  },

  enable: function () {
    this.options.isable = true;
  },
  disable: function () {
    this.options.isable = false;
  },
  enableDraw: function () {
    this.options.isableDraw = true;
  },
  disableDraw: function () {
    this.options.isableDraw = false;
  },
  /**
   * _addFlyingPt 内部方法，维持一个飞线绘制所需要的点序列
   */
  _addFlyingPt: function (pt) {
    this.curPoint = pt;
    var options = this.options;
    var ptsN = options.ptsN;
    var getLat = options.lat,
      getLng = options.lng;
    this.flyingPts.push({
      lat: getLat(pt),
      lng: getLng(pt)
    });
    if (this.flyingPts.length > ptsN) this.flyingPts.splice(0, 1);
  },

  equalTo: function(line) {
    if (this.id === line.id) return true;
    return false;
  },

  /**
   * _drawFlying 绘制飞线部分
   */
  _drawFlying: function() {
    var map = this._map;
    var zoom = map.getZoom();
    //
    var options = this.options;
    var lengthLimit = options.lengthLimit;
    var lineSegmentLonger = options.lineSegmentLonger;
    if (!options.isable || !this.options.isableDraw) return;
    var spriteFlyingOpt = options.spriteFlying,
      spriteHeadOpt = options.spriteHead;
    var spriteFlying = getSprite(spriteFlyingOpt);
    var spriteHead = getSprite(spriteHeadOpt);
    var spriteW = spriteFlying.width,
      spriteH = spriteFlying.height;
    var flyingPts = this.flyingPts;
    var latLngToContainerPoint = map.latLngToContainerPoint.bind(map);
    var ctx = this.ctx;
    var pt, percent, N = flyingPts.length;
    var px, py, phi, distance, dx, dy;
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
        phi = Math.atan2(dy, dx); // * 180 / Math.PI;
        distance = Math.sqrt(dx * dx + dy * dy) + lineSegmentLonger;
        if (distance < lengthLimit) {
          var w = switchValue(options.weight, pt, percent);
          // console.log();
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(phi);
          var startX = percent * spriteW;
          ctx.drawImage(spriteFlying, startX, 0, dX, spriteH, 0, -w / 2, distance, w);
          ctx.restore();
        }
      }
      px = x;
      py = y;
    }
    //绘制头部
    if (spriteHead && N) {
      pt = flyingPts[flyingPts.length - 1 ];
      var p = latLngToContainerPoint(L.latLng(pt.lat, pt.lng));
      var x = p.x;
      var y = p.y;
      ctx.save();
      var tmp = ctx.globalCompositeOperation;
      ctx.globalCompositeOperation = 'destination-over';
      ctx.beginPath();
      var r = switchValue(options.size, p, zoom);
      ctx.drawImage(spriteHead, x - r, y - r, r * 2, r * 2);
      ctx.closePath();
      ctx.globalCompositeOperation = tmp;
      ctx.restore();
    }
  },

  /**
   * updateAnim 更新和动画有关的操作
   * @param  {Number} life 生命周期，在这里往往是时间，可选。
   */
  updateAnim: function(life) {
    //如果在视图范围外
    if (!this.isInView()) return;
    this.life = life = life || this.life || 0;
    if (this.isEnd()) return this.emit('lifeEnd');
    this.updateFlying();
  },

  isEnd: function() {
    return (this.life >= this.lifeMax + (this.options.delay || 0));
  },

  /**
   * updateMap 更新和地图平移，缩放有关的操作
   * @param  {Object} viewBounds 地图的视窗区域
   */
  updateMap: function(viewBounds) {},

  /**
   * initEventsAnim 和动画相关的事件，包括在动画周期停止的时候，停止主动动画，以及当主动更新发生时候，更新绘图
   * @return {[type]} [description]
   */
  initEventsAnim: function() {
    this
      .off('lifeEnd')
      .on('lifeEnd', function() {
        this.pause();
      })
      .off('update')
      .on('update', this.updateAnim.bind(this));
  },
  genOptions: function() {
    return TrailCanvas.prototype.options = Utils.deepMerge(Anim.prototype.genOptions(), TrailCanvas.prototype.options);
  }
});

TrailCanvas.prototype.genOptions();

var dmap = L.dmap = L.dmap || {};
dmap.TrailCanvas = TrailCanvas;
dmap.trailCanvas = function(options) {
  return new TrailCanvas(options);
};

module.exports = TrailCanvas;