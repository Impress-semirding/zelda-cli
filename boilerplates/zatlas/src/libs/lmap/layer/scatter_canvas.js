var L = require('./../leaflet');
//
var Canvas = require('./../render/canvas');
require('./../core/utils');
var dmap = L.dmap = L.dmap || {};
var Utils = dmap.Utils;

var getSprite = Utils.getSprite;
/**
 * @class ScatterCanvas
 */

var ScatterCanvas = L.Class.extend({
  includes: [L.Mixin.Events],

  initialize: function (options) {
    options = this.options = Utils.deepMerge(ScatterCanvas.options, options);
    this.isable = true;
    this.sprite = this.updateSprite(options.sprite);
    this.updateGroups(options.groups);
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
    if(!data ||!data.length) return
    opt = opt || {};
    var map = this.map;
    var self = this;
    this._data = data;
    this.transfer = opt.transfer || function (lat, lng) { //将经纬度转化为平面坐标
      return self._map.latLngToContainerPoint(L.latLng(lat, lng));
    };
    this.processing();
  },
  processing: function(){
    this.range = Utils.getRange(this._data, this.options.value);
  },
  updateOptions: function (options) {
    if (options) this.options = Utils.deepMerge(this.options, options);
    this.sprite = this.updateSprite();
    this.updateBlending();
    this.draw();
  },
  updateSprite: function (sprite) {
    return getSprite(sprite || this.options.sprite);
  },
  updateGroups: function (groups){
    if (!groups) return;
    for (var i in groups) {
      var group = groups[i];
      if (group.sprite) {
        group.sprite = this.updateSprite(group.sprite);
      }
    }
  },
  updateFilter: function (filter) {
    if (!filter || typeof (filter) !== 'function') return;
    this.options.filter = filter;
    this.draw();
  },

  updateBlending: function (blending) {
    if(!this.dCanvas) return;
    this.dCanvas.ctx.globalCompositeOperation = this.options.blending || blending;
  },

  render: function (data, isNotClean) {
    if (data) this.data(data);
    this.draw(isNotClean);
  },
  draw: function (isNotClean) {
    if (!isNotClean) this.clean();
    var range = this.range || {};
    var min = range.min, max = range.max;
    var map = this._map;
    if (!this.isable || !map) return;
    var zoom = this._map.getZoom();
    var options = this.options;
    var isFilter = true;
    var filter = this.options.filter;
    var transfer = this.transfer;
    var ds = this._data;
    if(!ds || !ds.length) return
    var getValue = this.options.value;
    var sprite, sprites = this.sprites;
    var dCanvas = this.dCanvas;
    var getLng = options.lng.bind(options);
    var getLat = options.lat.bind(options);
    var w = dCanvas.w;
    var h = dCanvas.h;
    var d, lng, lat, pt, value, x, y, size;

    //
    var groups = options.groups;
    for (var k in ds) {
      d = ds[k];
      if (!d) continue;
      if (filter) isFilter = filter(d);
      if (!isFilter) continue;
      lng = getLng ? getLng(d) : d.lng;
      lat = getLat ? getLat(d) : d.lat;
      if (!lng || !lat) continue;
      pt = transfer(lat, lng);
      x = pt.x;
      y = pt.y;
      if (x < 0 || x > w || y < 0 || y > h) {
        continue;
      } else {
        if (groups) {
          for (var i in groups) {
            var group = groups[i];
            size = group.size(d, zoom, min, max);
            sprite = group.sprite;
            if (size && sprite && group.filter(d)) {
              dCanvas.pt(sprite, x, y, size);
              break;
            }
          }
        } else {
          sprite = this.sprite;
          dCanvas.pt(sprite, x, y, Utils.switchValue(options.size, d, zoom, min, max));
        }
      }
    }
  },
  clean: function (alpha) {
    if(this.dCanvas){
       this.dCanvas.clear(alpha);
    }
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

ScatterCanvas.options = {
    'lng': Utils.getLng,
    'lat': Utils.getLat,
    'refreshInterval': 1,
    'size': function (d) {
      return 20;
    },
    value: function(d) {
      return d[0] || d.value;
    },
    'blending': 'lighter',
    'clearAlpha': 1,
    'container': 'tilePane',
    'sprite': {
      'drawN': 1.15,
      'color': {
        'from': 'rgba(245,230,0,0.3)',
        'to': 'rgba(245,245,0,0.04)',
        'easing': 'Linear.None.1.7',
        'space': 'rgb'
      }
    }
  };

dmap.ScatterCanvas = ScatterCanvas;
dmap.scatterCanvas = function (opt) {
  return new ScatterCanvas(opt);
};

module.exports = ScatterCanvas;