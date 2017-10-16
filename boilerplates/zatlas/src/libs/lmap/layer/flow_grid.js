var L = require('./../leaflet');
//
var Canvas = require('./../render/canvas');
require('./../core/utils');
var dmap = L.dmap = L.dmap || {};
var Utils = dmap.Utils;

var getSprite = Utils.getSprite;
/**
 * @class FlowGrid
 */
function getValue(f, a, b, c) {
  if (typeof (f) === 'function') return f(a, b, c);
  return f;
}

var FlowGrid = L.Class.extend({
  includes: [L.Mixin.Events],

  initialize: function (options) {
    options = this.options = Utils.deepMerge(FlowGrid.options, options);
    this.isable = true;
    // this.sprite = this.updateSprite(options.sprite);
    // this.updateGroups(options.groups);
  },
  disable: function () {
    this.isable = false;
  },
  enable: function () {
    this.isable = true;
  },
  addTo: function (map) {
    if (this._map || !map) return;
    this._map = map;
    this.initCanvas();
    this.initEventsMap();
    this.updateBlending();
  },

  initCanvas: function () {
    var map = this._map;
    var options = this.options;
    var container = options.container;
    this.dCanvas = new Canvas(map, container, options);
  },

  /**
   * data 传入可视化数据
   * @param  {Object} _data 需要可视化的数据
   * @param  {Object} opt      配置参数
   */
  data: function (data, opt) {
    var sort = this.options.sort;
    data = _.sortBy(data, sort);
    opt = opt || {};
    var map = this.map;
    var self = this;
    this._data = data;
    this.transfer = opt.transfer || function (lat, lng) { //将经纬度转化为平面坐标
      return self._map.latLngToContainerPoint(L.latLng(lat, lng));
    };
    this.valueFunc = function (d) {
      return d.value;
    } || opt.valueFunc; //从列表中提取展示数据的方式
  },
  updateOptions: function (options) {
    if (options) this.options = Utils.deepMerge(this.options, options);
    // this.sprite = this.updateSprite();
    this.updateBlending();
    this.draw();
  },
  updateSprite: function (sprite) {
    sprite = sprite || this.options.sprite;
    sprite = getSprite(sprite);
    return sprite;
  },
  updateFilter: function (filter) {
    if (!filter || typeof (filter) !== 'function') return;
    this.options.filter = filter;
    this.draw();
  },

  updateBlending: function (blending) {
    if (blending) return this.dCanvas.ctx.globalCompositeOperation = this.options.blending = blending;
    this.dCanvas.ctx.globalCompositeOperation = this.options.blending;
  },

  render: function (data, isClean) {
    if (data) this.data(data);
    this.draw(isClean);
  },
  updateGrid: function(){
    var data = this._data;
    if(!data) return;
    var len = 500;
    var result = {};
    data.forEach(function(d){
      var key = Math.floor(d.lat * len) / len + '_' +  Math.floor(d.lng * len) / len;
      var dc = result[key];
      if(dc){
        var count = dc.count + 1;
        dc.vx = (dc.vx * dc.count + d.vx) / count;
        dc.vy = (dc.vy * dc.count + d.vy) / count;
        dc.lat = (dc.lat * dc.count + d.lat) / count;
        dc.lng = (dc.lng * dc.count + d.lng) / count;
        dc.count = count;
      } else {
        result[key] = {
          vx: d.vx,
          vy: d.vy,
          lat: d.lat,
          lng: d.lng,
          count: 1
        }
      }
    });
    this.dataAggregate = _.values(result);
  },
  draw: function (isClean) {
    if (isClean === true || isClean === undefined) this.clean();
    var map = this._map;
    var zoom = this._map.getZoom();
    var options = this.options;
    var isFilter = true;
    var filter = this.options.filter;
    if (!this.isable) return;
    var transfer = this.transfer;
    this.updateGrid();
    var ds = this.dataAggregate;
    var valueFunc = this.valueFunc;
    var sprite, sprites = this.sprites;
    var dCanvas = this.dCanvas;
    var getLng = options.lng, getLat = options.lat;
    var getVx = options.vx, getVy = options.vy;
    var w = dCanvas.w;
    var h = dCanvas.h;
    var d, lng, lat, pt, value, x, y, size, vx, vy;

    var stroke = Utils.getColorFunc(options.stroke);
    //
    var groups = options.groups;
    for (var k in ds) {
      d = ds[k];
      if (!d) continue;
      if (filter) isFilter = filter(d);
      if (!isFilter) continue;
      lng = Utils.switchValue(getLng, d),
      lat = Utils.switchValue(getLat, d),
      vx =  Utils.switchValue(getVx,  d),
      vy =  Utils.switchValue(getVy,  d);
      pt = transfer(lat, lng);
      if (!lng || !lat) continue;
     
      x = pt.x;
      y = pt.y;
      
      var ctx = dCanvas.ctx;
      ctx.beginPath();
      var maxLength = options.maxLength;
      var kx = Math.max(Math.min(1, vx / 1000), -1);
      var dx = kx * maxLength;
      var ky = Math.max(Math.min(1, vy / 1000), -1);
      var dy = ky * maxLength;
      var ki = Math.max(Math.min(1, (Math.abs(vx) + Math.abs(y)) / 800), 0);
      ctx.strokeStyle = stroke(ki);
      ctx.lineWidth = options.weight;
      ctx.moveTo(x, y);
      ctx.lineTo(x + dx , y + dy);
      ctx.stroke();
      ctx.closePath();
    }
  },
  clean: function (alpha) {
    this.dCanvas.clear(alpha);
  },

  /**
   * initEventsMap 和地图移动绑定的事件
   */
  initEventsMap: function () {
    this.dCanvas.onUpdate(function(){
      this.draw();
    }.bind(this));
  },

  /**
   * destroy  销毁canvas
   */
  destroy: function () {
    this.dCanvas.destroy();
  }
});

FlowGrid.options = {
    lng: Utils.getLng,
    lat: Utils.getLat,
    vx: function(d){return d.vx},
    vy: function(d){return d.vy},
    filter: function(d){
      // var k = Math.abs(d.vx) + Math.abs(d.vy);
      return 1;
    },
    weight: 1,
    blending: 'source-over',
    container: 'tilePane',
    stroke: {
     from: 'rgba(0,233,333,0.2)',
     to: 'rgba(233, 0, 0, 0.5)',
     space: 'hsl',
     easing: 'linear.Out.3'
    },
    maxLength: 30,
    sort: function(d){
      return -Math.abs(d.vx) + Math.abs(d.vy);
    },
    sprite: {
      drawN: 1.15,
      color: {
        from: 'rgba(245,230,0,0.3)',
        to: 'rgba(245,245,0,0.04)',
        easing: 'Linear.None.1.7',
        space: 'rgb'
      }
    }
  };

dmap.FlowGrid = FlowGrid;
dmap.flowGrid = function (opt) {
  return new FlowGrid(opt);
};

module.exports = FlowGrid;