var L = require('./../leaflet');
var Utils = require('./../core/utils');
var dmap = L.dmap = L.dmap || {};
/**
 * @class FlyingLinePath
 */

var FlyingLinePath = L.Path.extend({
  options: {
    weight: 10,
    opacity: 1,
    color: 'blue',
    kHeight: 0.5
  },
  initialize: function (options) {
    this.options = Utils.deepMerge(this.options, options);
    this.isInit = false;
    L.Path.prototype.initialize.call(this, options);
  },

  initSvg: function () {
    if (this.isInit) return;
    var options = this.options;
    var id = Utils.getId('flyingPath2d');
    var color = options.color;

    var linearGradientId = this.linearGradientId = id + 'grad';

    var svg = document.getElementsByTagName('svg')[0];
    if(!svg) return console.log('svg节点尚未建立');

    var stop1a, stop1b, stop1c;
    var defs = document.getElementsByTagName('defs')[0];
    if (!defs) {
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      svg.appendChild(defs);
    }

    var path = this._path;
    if (!path) return console.log('path不存在');
    var linearGradient = this.linearGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    if (this.direction === 'left') {
      linearGradient.setAttribute('x1', '100%');
      linearGradient.setAttribute('y1', '0%');
      linearGradient.setAttribute('x2', '0%');
      linearGradient.setAttribute('y2', '0%');
    }

    linearGradient.setAttribute('id', linearGradientId);
    defs.appendChild(linearGradient);

   if (this._init){
      this._init(path, linearGradient);
    }

    this.isInit = true;
  },

  updateOptions: function (options) {
    options = this.options = Utils.deepMerge(this.options, options);
    this._path.setAttribute('stroke-width', options.weight);
    this.updatePath();
    this.redraw();
  },

  data: function (data) {
    if (!data || !data.from || !data.to) return;
    this._data = data;
    var from = this.from = L.latLng(data.from.lat, data.from.lng);
    var to = this.to = L.latLng(data.to.lat, data.to.lng);
    this._latlngs = [from, to];


    var linearGradient = this.linearGradient;
    if (to.lng > from.lng) {
      this.direction = 'right';
      linearGradient.setAttribute('x1', '0%');
      linearGradient.setAttribute('x2', '100%');
    } else {
      this.direction = 'left';
      linearGradient.setAttribute('x1', '100%');
      linearGradient.setAttribute('x2', '0%');
    }
    this.wake();
    this.updatePath();
    this.redraw();
    this.addEventsMap();
  },

  addTo: function (map) {
    if (!map) return;
    this._map = map;
    map.addLayer(this);
    this.initSvg();
    this.updatePath();
    this.redraw();
    return this;
  },

  addEventsMap: function () {
    this._map.on('viewreset', this.updatePath.bind(this));
    this.updatePath();
  },

  updatePath: function () {
    var from = this.from;
    var to = this.to;
    var options = this.options;
    if(!from || !to) return;
    var map = this._map;
    var kHeight = options.kHeight;
    var fromPt = this.fromPt = map.latLngToLayerPoint([from.lat, from.lng]);
    var toPt = this.toPt = map.latLngToLayerPoint([to.lat, to.lng]);
    var controlsX = (toPt.x + fromPt.x) / 2;
    var controlsY = (toPt.y + fromPt.y) / 2;
    var dx = toPt.x - fromPt.x;
    var yOffset = dx * kHeight;
    controlsY += -Math.abs(yOffset);
    var weight = Utils.switchValue(options.weight, this._data);
    this._path.setAttribute('stroke-width', weight);
    this._customData = 'M' + fromPt.x + ' ' + fromPt.y + ' ' + 'Q' + ' ' + controlsX + ' ' + controlsY + ' ' + toPt.x + ' ' + toPt.y;
    this.getPathString();
  },

  getPathString: function () {
    var data = this._customData;
    return data instanceof Array ? data.join(' ') : data;
  },

  hide: function () {
    this._path.setAttribute('display', 'none');
  },

  wake: function () {
    this._path.setAttribute('display', 'block');
  },

  destroy: function () {
    //dom销毁
    var defs = document.getElementsByTagName('defs')[0];
    var linearGradient = document.getElementById(this.linearGradientId);
    if (linearGradient && defs) {
      defs.removeChild(linearGradient);
    }
    var path = this._path;
    var g = path.parentNode;
    var svg = document.getElementsByTagName('svg')[0];
    if (g && svg) {
      try{
        svg.removeChild(g);
      }catch(e){
      }
    }
  }
});

dmap.FlyingLinePath = FlyingLinePath;
dmap.flyingLinePath = function (opt) {
  return new dmap.FlyingLinePath(opt);
};
module.exports = FlyingLinePath;
