var L = require('./../leaflet');
var tData = require('./tilelayer_data');
delete tData.__filename;
var Utils = require('./../core/utils');
var switchValue = Utils.switchValue;

var Browser = L.Browser;
var DomUtil = L.DomUtil;
var Util    = L.Util;
var Bounds  = L.Bounds;
var Point   = L.Point;

function getVariantOptions(tOptions, parts, options) {
  var opt = Utils.deepMerge(tOptions.options, options);
  var variants = tOptions.variants;
  var variant;
  if (!variants) return opt;
  if (parts && parts.length === 2) {
    var name1 = parts[1];
    variant = variants[name1];
    opt[name1] = variant.value;
    return opt;
  }
  if (opt.variant && variants) {
    var name = opt.variant;
    variant = variants[name];
    if (!variant) return opt;
    opt.variant = (typeof(variant) === 'string') ? variant : variant.value;
    if (variant.options) opt = Utils.deepMerge(opt, variant.options);
  }
  return opt;
}

function getAttribution(options) {
  var attr = options.attribution;
  if (!attr) return options;
  if (attr.indexOf('{attribution.') === -1) {
    return options;
  }
  options.attribution = attr.replace(/\{attribution.(\w*)\}/,
    function (match, attributionName) {
      return getAttribution(tData[attributionName].options);
    }
  );
  return options;
}

function isNone(d){
  return d === undefined || d === null;
}
/**
 * @class TileLayer
 */
const defaultOptions = {
  pane: 'tilePane',
  tileSize: 256,
  bounds: null,
  subdomains: 'abc',
  zoomOffset: 0,
};

const TileLayer =  L.TileLayer.extend({
  initialize: function (names, options){
    var o = Utils.deepMerge(defaultOptions, options);
    var options = Util.setOptions(this, o);
    
    this.update(names, options, true);
  },
  update: function (names, options, isInitialize){
    options = undefined;
    if (typeof (names) === 'object') {
      options = names;
      names = options.url;
    }

    if (names.indexOf('{') === -1) {
      this.tileName = names;
    }

    this.tData = tData;
    if (typeof(names) !== 'string') return console.log('输入必须为字符形式');
    if (names.indexOf('{') !== -1){
      L.TileLayer.prototype.initialize.call(this, names, options);
      if (isInitialize) return;
      return L.TileLayer.prototype.setUrl.call(this, names, options);
    }

    var parts = names.split('.');
    var tName = parts[0];


    var tOptions = tData[tName] || tData['GeoQBlue'];
    var q = this.options.isCache ? null : 'ldmap=' + Math.floor(Math.random() * 10000000);
    var url = tOptions.url;
    if (url && typeof(url) ==='string' && q) {
      var f = (url.indexOf('?') === -1) ? '?' : '&';
      url += (f + q);
    }
  
    options = getVariantOptions(tOptions, parts, options);
    options = getAttribution(options);

    // this.initializeT(url, options);
    L.TileLayer.prototype.initialize.call(this, '//webrd03.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}&ldmap=8630347');
    if (isInitialize) return;
    this.setUrl(url, options);
    this.redraw();
  },

  updateOptions : function(options) {
    return;
  },
  // onAdd: function () {
  //   this._initContainer();

  //   this._levels = {};
  //   this._tiles = {};

  //   this._resetView();
  //   this._update();
  // },

  help: function () {
    console.log('L.dmap.tileLayer(name, options)\n---name可以是:\n\n\n');
    for (var name in tData) {
      var options = tData[name].options;
      var cname = options.name;
      console.log(name + ' | ' + cname);
    }
  },
  getTileUrl: function (tilePoint) {
    var x = tilePoint.x,  y = tilePoint.y, z = tilePoint.z;
    if(isNone(tilePoint.x) || isNone(tilePoint.y) || isNone(tilePoint.z)) return;
    if(typeof (this._url) === 'function') return this._url(x, y, z);
    return L.Util.template(this._url, L.extend({
      s: this._getSubdomain(tilePoint),
      z: tilePoint.z,
      x: tilePoint.x,
      y: tilePoint.y
    }, this.options));
  },
  setVariables: function() {}
});

TileLayer.options = {
  isCache: false,
  pane: 'tilePane',
  tileSize: 256,
  bounds: null,
  subdomains: 'abc',
  zoomOffset: 0,
};

var dmap = L.dmap = L.dmap || {};
dmap.TileLayer = TileLayer;
dmap.tileLayer = function (name, options) {
  return new dmap.TileLayer(name, options);
};
module.exports = TileLayer;
