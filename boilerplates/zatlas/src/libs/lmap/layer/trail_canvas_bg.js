'use strict';

/**
 * @class HeatmapGrid
 */
var L = require('./../leaflet');
var Utils = require('./../core/utils');
var Canvas = require('./../render/canvas');
var getColorFunc = Utils.getColorFunc;
var switchValue = Utils.switchValue;
var Event = require('bcore/event');
var getSprite = require('./../core/utils').getSprite;

/**
 * TrailCanvas 单根轨迹图
 * @param  {Object} 配置对象
 * @return {[type]}   [description]
 */
function TrailCanvasBg(options) {
  options = this.options = Utils.deepMerge(TrailCanvasBg.options, options);
  this.id = Math.floor(Math.random() * 10000000) + '_' + new Date().getTime();
  this.initialize(options);
}
TrailCanvasBg.options = {
  'container': null,
  'lengthLimit': 15,
  'lifeSpeed': 0.5,
  'delay': 30,
  'isAutoUpdate': true,
  'lineSegmentLonger': 1, //比真实的线多出一段的像素值(绘制线的时候，为使接头更平滑)
  'container': null, //传入
  'blending': 'lighter',
  //
  'sprite': { //飞线中间的部分
      'type': 'linear',
      'isContinue': true,
      'width': 200,
      'height': 20,
      'color': {
        'from': 'rgba(0,233,233,0.3)',
        'to': 'rgba(0,233,233,0.3)',
        'space': 'hsl',
        'easing': 'linear.Out.3'
      }
    },
  //
  'isable': true,
  'isableDraw': true,
  'type': 'line',
  'ptsN': 9,
  'weight': function(d, percent) {
    return 5 * Math.pow(percent, 1);
  },
  pts: function(d){
    return d.pts;
  },
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


TrailCanvasBg = Event.extend(TrailCanvasBg, {
  events: {},
  includes: [L.Mixin.Events],
  initialize: function(options) {
  },

  addTo: function(map) {
    if (this._map || !map) return;
    this._map = map;
    this.initCanvas();
    if (this._data) this.draw();
  },

  initCanvas: function(){
    var options = this.options;
    if (options.ctx) return this.ctx = options.ctx;
    //
    this.lcanvas = new Canvas(this._map, options.container, {
      'clearAlpha': 1
    });
    var ctx = this.ctx = this.lcanvas.ctx;
    ctx.globalCompositeOperation = options.blending;
    this.ctx = ctx;
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
  data: function(ds) {
    if (!ds) return this._data;
    var options = this.options;
    var getPts = options.pts.bind(options);
    this._data = ds;
    this.pts = getPts(ds);
    this.processing();
    this.resetVariables();
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
    this.draw();
  },

  updateOptions: function(options) {
    options = this.options = Utils.deepMerge(this.options, options);
  },

  resetVariables: function() {
    this.enable();
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

  equalTo: function(line) {
    if (this.id === line.id) return true;
    return false;
  },

  /**
   * draw 绘制飞线部分
   */
  draw: function() {
    var options = this.options;
    if(!options.isable || !options.isableDraw) return;
     var lengthLimit = options.lengthLimit;

    var lineSegmentLonger = options.lineSegmentLonger;
    var ctx = this.ctx;
    var sprite = getSprite(options.sprite);
    var latLngToContainerPoint = this._map.latLngToContainerPoint.bind(this._map);
    var ds = this.pts;
    if(!ds) return;
    var N = ds.length;
    var pt, percent;
    var px, py, phi, distance, dx, dy, weight;
    var spriteW = sprite.width, spriteH = sprite.height;
    var dX = 1 / N * spriteW * 1;
    var getLat = options.lat.bind(options);
    var getLng = options.lng.bind(options);
    for (var i = 0; i < N; i++) {
      pt = ds[i];
      var lat = getLat(pt);
      var lng = getLng(pt);
      var p = latLngToContainerPoint(L.latLng(lat, lng));

      var x = p.x;
      var y = p.y;
      percent = (i - 1) / N;
      if (px || py) {
        dx = x - px;
        dy = y - py;
        phi = Math.atan2(dy, dx);
        distance = Math.sqrt(dx * dx + dy * dy)  + lineSegmentLonger;
        // if(lengthLimit > distance){
          weight = switchValue(options.weight, pt, percent);
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(phi);
          var startX = percent * spriteW;
          ctx.drawImage(sprite, startX, 0, dX, spriteH, 0, - weight / 2, distance, weight);
          ctx.restore();

        // }
      }
      px = x;
      py = y;
    }
  },



  isEnd: function() {
    return (this.life >= this.lifeMax + (this.options.delay || 0));
  },

  /**
   * updateMap 更新和地图平移，缩放有关的操作
   * @param  {Object} viewBounds 地图的视窗区域
   */
  updateMap: function(viewBounds) {
    this.draw();
  },
});


var dmap = L.dmap = L.dmap || {};
dmap.TrailCanvasBg = TrailCanvasBg;
dmap.trailCanvasBg = function(options) {
  return new TrailCanvasBg(options);
};

module.exports = TrailCanvasBg;