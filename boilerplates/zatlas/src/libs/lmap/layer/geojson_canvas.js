var L = require('./../leaflet');
var Event = require('bcore/event');
var Utils = require('bcore/utils');
var Canvas = require('./../render/canvas');
var getColorFunc = require('./../core/utils').getColorFunc;

var dmap = L.dmap = L.dmap || {};

function getValue(a, b) {
  if (typeof(a) === 'function') return a(b);
  return a;
}

function GeoJsonCanvas(options) {
  options = this.options = Utils.deepMerge(GeoJsonCanvas.options, options);
  this.updateStyle();
}

GeoJsonCanvas.options = {
  'container': 'overlayPane',
  'featureId': function (features, i) { //获取绘制geojson的地理id
    if (features.properties && features.properties.adcode) return features.properties.adcode;
    return i;
  },
  'id': function() { //获取绘制数据的地理id
    return d.adcode;
  },
  value: function(d){
    return d.value;
  },
  'lat': function(d) {
    return d[1];
  },
  'lng': function(d) {
    return d[0];
  },
  'style': {
    'lineWidth': 2,
    'fill': function(d) {
      return '#0ff';
    }
  }
};

GeoJsonCanvas = Event.extend(GeoJsonCanvas, {
  init: function() {
    this.initCanvas()
  },
  initCanvas: function () {
    var map = this._map;
    var options = this.options;
    var container = options.container;
    var dCanvas = this.dCanvas = new Canvas(map, container, options);
    this.ctx = dCanvas.ctx;
  },
  addTo: function (map) {
    this._map = map;
    this.init();
    this.initEventsMap();
  },
  updateStyle: function () {
    var style = this.options.style;
    if (style.fill) style.fill = getColorFunc(style.fill);
    if (style.stroke) style.stroke = getColorFunc(style.stroke);
  },
  geojson: function(geojson) {
    var features = geojson.features;
    var options = this.options;
    var result = {};
    for (var i = 0; i < features.length; i++) {
      var feature = features[i];
      var id = options.featureId(feature, i);
      result[id] = feature;
    }
    this.features = result;
  },
  data: function(ds) {
    var options = this.options;
    if (Array.isArray(ds)) { //如果数组转化为对象
      var d, id, result = {};
      for (var i = 0; i < ds.length; i++) {
        d = ds[i];
        id = options.id(d);
        result[id] = d;
      }
      ds = result;
    }
    this._data = ds;
  },
  render: function (ds) {
    if (ds) this.data(ds);
    this.draw();
  },
  draw: function() {
    var options = this.options;
    var ds = this._data || {};
    var features = this.features;
    if (!features) return console.log('没有地理数据 -> geojsonCanvas.geojson(geojson)');
    var feature, geometry, type;
    var getValue = options.value.bind(options);
    var d, value = 0;
    for (id in features) {
      feature = features[id];
      geometry = feature.geometry || feature;
      d = ds[id];
      if (d) value = getValue(d);
      type = geometry.type;
      if (type === 'MultiPolygon') {
        this.renderMultiPolygon(geometry, value);
      } else if (type === 'Polygon') {
        this.renderPolygon(geometry, value);
      }
    }
  },
  /**
   * initEventsMap 和地图移动绑定的事件
   */
  initEventsMap: function () {
    this.dCanvas.onUpdate(function() {
      this.draw();
    }.bind(this));
  },
  renderMultiPolygon: function(geometry, value) {
    var ctx = this.ctx;
    var map = this._map;
    //
    var options = this.options;
    var getLat = options.lat,
      getLng = options.lng;
    var style = options.style;
    if (style.fill) ctx.fillStyle = getValue(style.fill, value);
    if (style.stroke) ctx.strokeStyle = getValue(style.stroke, value);
    //
    var coordinates = geometry.coordinates;
    var coordinate, latlngs, latlng, pt, lat, lng;
    for (var i = 0; i < coordinates.length; i++) {
      coordinate = coordinates[i];
      for (var j = 0; j < coordinate.length; j++) {
        latlngs = coordinate[j];
        ctx.beginPath();
        var ptFirst;
        for (var k = 0; k < latlngs.length; k++) {
          latlng = latlngs[k];
          lat = getLat(latlng);
          lng = getLng(latlng);
          pt = map.latLngToContainerPoint({
            lat: lat,
            lng: lng
          }); //latLngToLayerPoint
          if (k === 0) {
            ctx.moveTo(pt.x, pt.y);
            ptFirst = pt;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }

          if (k === latlngs.length - 1) ctx.lineTo(ptFirst.x, ptFirst.y);
        }
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      }
    }
  },
  renderPolygon: function(geometry, value) {
    var ctx = this.ctx;
    var map = this._map;
    //
    var options = this.options;
    var getLat = options.lat,
      getLng = options.lng;
    var style = options.style;
    if (style.fill) ctx.fillStyle = getValue(style.fill, value);
    if (style.stroke) ctx.strokeStyle = getValue(style.stroke, value);
    if (style.lineWidth) ctx.lineWidth = style.lineWidth;
    //
    var coordinates = geometry.coordinates;
    var coordinate, latlngs, latlng, pt, lat, lng;
    for (var i = 0; i < coordinates.length; i++) {
      latlngs = coordinates[i];
      ctx.beginPath();
      for (var k = 0; k < latlngs.length; k++) {
        latlng = latlngs[k];
        lat = getLat(latlng);
        lng = getLng(latlng);
        pt = map.latLngToContainerPoint({
          lat: lat,
          lng: lng
        }); //latLngToLayerPoint
        if (k === 0) {
          ctx.moveTo(pt.x, pt.y);
        } else {
          ctx.lineTo(pt.x, pt.y);
        }
      }
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    }
  }
});
GeoJsonCanvas.prototype.geoJson = GeoJsonCanvas.prototype.geojson;

L.dmap.geoJsonCanvas = function (options) {
  return new GeoJsonCanvas(options);
};
L.dmap.GeoJsonCanvas = GeoJsonCanvas;

module.exports = GeoJsonCanvas;