'use strict';

const _ = require('lodash');
var L = require('./../leaflet');
var Utils = require('./../core/utils');
var isNone = Utils.isNone;
var getColorFunc = require('./../core/utils').getColorFunc;
var colorFunc = getColorFunc({
  'from': '#002170',
  'to': '#c5f2e7',
  'easing': 'Quadratic.Out.1.1',
  'space': 'rgb'
});
const {switchValue} = Utils;

var Area = L.Class.extend({
  includes: [L.Mixin.Events],
  /**
   * @param  {String} id 地理id
   * @param  {Object} opt 加载完成后的回调函数
   * @param  {Function} cb 整体配置
   */
  addTo: function(map) {
    this._map = map;
    // this.initEvents();
    if (this.geojson) this.initGeojson();
    return this;
  },
  geoJson: function(geojson) {
    if (!geojson) return;
    this.geojson = _.cloneDeep(geojson);
    var map = this._map;
    if (!map) return;
    this.removeGeojson();
    this.initGeojson();
  },
  removeGeojson: function(geojsonLayer){
    geojsonLayer = geojsonLayer || this.geojsonLayer;
    if (geojsonLayer) this._map.removeLayer(geojsonLayer);
  },
  initGeojson: function() {
    var options = this.options;
    var style = this.genStyle(options.style);
    var geojson = this.geojson;
    var getGeoId = options.geoid.bind(options);
    var layers = this.layers = [];
    let i = 0;
    var geojsonLayer = this.geojsonLayer = L.geoJson(geojson, {
       style,
      'draggable': false,
      'onEachFeature': (feature, layer) => {
        const id = getGeoId(feature) || i++;
        layers[id] = layer;
        layer.__feature = feature;
        this.initEventChild(layer, feature);
      }
    });
    geojsonLayer.addTo(this._map);
    geojsonLayer.bringToBack();
    this.initEventsPopup();
  },
  initEventChild: function(child, feature) {
    var d = {
      feature: feature,
      layer: child
    };
    var self = this;
    var popup, getPopup = this.options.popup;
    var map = this._map;
    var events = _.filter(Utils.EVENTSBasic, d => d !== 'mousedown');
    events.forEach(function(evtName) {
      child.on(evtName, function() {
        if (child.__data) d.data = child.__data;
        self.fire('child-' + evtName, d);
        return true;
      });
    });
    var options = this.options;
    var hover = options.style.hover;
    if (hover) {
      child
        .on('mouseover', function() {
          map.closePopup();
          child.setStyle(hover);
        })
        .on('mouseout', function() {
          child.setStyle(child.__style);
        });
    }
  },

  initEventsPopup: function() {
    var map = this._map;
    var popup = this.options.popup;
    //
    this.each(function(child) {
      if (!child) return;
      this.updatePopupPostion(child);
      //
      Utils.initEventsPopup({
        parent: this,
        child: child,
        map: map,
        datas: [child.__feature, child.__data],
        popup: popup,
      });
    }.bind(this));
  },

  updatePopupPostion: function(child) {
    var map = this._map;
    var top = Utils.getTopPoint(child.__feature);
    child.popupPosition = L.latLng(top[1], top[0]);
  },

  initialize: function(options) {
    this.options = Utils.deepMerge(Area.options, options);
  },
  /**
   * getLayer  获取区域中的某一块
   * @param  {String} id 地理id
   * @return {Object}    layer对象
   */
  getLayer: function(id) {
    if (id && this.layers) return this.layers[id];
  },
  genStyle: function(style, a, b, c, d) {
    var styleOption = {};
    for (var id in style) {
      styleOption[id] = switchValue(style[id], a, b, c, d);
    }
    return styleOption;
  },
  /**
   * each 对每个feature对应的几何体进行操作
   * @param  {Function} handler 操作处理的函数
   */
  each: function(handler) {
    if (!handler) return;
    var layers = this.layers;
    for (var id in layers) {
      handler(layers[id], id);
    }
  },

  data: function(ds) {
    this._data = ds;
    this.updateRange();
  },

  updateRange: function(){
    this.range = Utils.getRangePercentTile(this._data, this.options.value);
  },

  render: function(ds) {
    if (ds) this.data(ds);
    this.draw();
  },

  updateOptions: function(options) {
    this.options = Utils.deepMerge(this.options, options);
    this.updateRange();
    this.draw();
  },
  draw: function() {
    if (!this.isable) return;
    var d, id, layer, value, ds = this._data;
    var dataObj = {};
    var options = this.options;
    var filter = options.filter;
    var style = options.style;
    var getId = options.id.bind(options);
    var getValue = options.value.bind(options);
    //
    for (var i in ds) {
      d = ds[i];
      id = getId(d);
      dataObj[id] = d;
    }
    var layers = this.layers;
    var styl, range = this.range || {};
    this.each((layer, id) => {
      d = dataObj[id] || {};
      if (filter && !filter(d)) return;
      value = getValue(d);
      // console.log(range, value);
      styl = this.genStyle(style, value, range.min, range.max);
      layer.setStyle(styl);
      layer.__style = styl;
      layer.__data  = d;
    });
    this.initEventsPopup();
  },

  hide: function() {
    if (this.geojsonLayer) this.geojsonLayer.setStyle({opacity: 0, fillOpacity: 0});
    setTimeout(() => {this.isable = false});
  },
  show: function() {
    if (this.geojsonLayer) this.geojsonLayer.setStyle({opacity: 1, fillOpacity: 1});
    setTimeout(() => {
      this.isable = true;
      this.draw();
    });
  },
  getBounds: function(bounds) {
    if (!this._map) return;
    return this.geojsonLayer.getBounds();
  },

  /**
   * 清理场景
   */
  destroy: function() {
    this.geojsonLayer && this._map.removeLayer(this.geojsonLayer);
    this._data = null;
  }
});

Area.options = {
  geoid: function(feature) {
    var id = feature.id || feature.adcode;
    if (id) return id;
    const {properties} = feature;
    if (properties) return properties.id || properties.adcode;
  },
  id: function(d, i) {
    if(!d) return i;
    return d.id || d.adcode;
  },
  value: function(d) {
    return d.value;
  },
  style: {
    fillColor: function(value, min, max) {
      if (!value) return 'rgba(0,150,200,1)';
      var v = (value - min) / (max - min);
      return colorFunc(v);
    },
    'color': 'transparent',
    'weight': 2,
    // 'opacity': 1,
    // 'fillOpacity': 1,
    'dashArray': null
  },
  filter: d => true
  // popup: function (d, feature) {
  //   return d.adcode || d.id;
  // },
};

// Area.prototype.geojson = Area.prototype.geoJson;

var dmap = L.dmap = L.dmap || {};
dmap.Area = Area;

dmap.area = function(options) {
  return new Area(options);
};

module.exports = Area;
