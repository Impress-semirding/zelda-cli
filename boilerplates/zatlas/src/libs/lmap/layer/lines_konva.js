var L = require('./../leaflet');
var Event = require('bcore/event');
var Util = require('./../core/utils');
var isNone = Util.isNone;
var fireEvent = Util.fireEvent;
var K = require('konva');
var dmap = L.dmap = L.dmap || {};

var KLeafLayer = require('./../render/leaflet_layer_konva');
/**
 * @class LinesKonva
 */
function LinesKonva(options) {
  options = this.options = Util.deepMerge(LinesKonva.options, options);
}

function isLineArr(coordinates) {
  return !coordinates[0][0][0]
}

var colorFunc = Util.getColorFunc({
    from: 'rgba(245,230,0,1)',
    to: 'rgba(205,0,0, 0.6)',
    none: 'rgba(200,200,200, 0.6)',
    easing: 'Linear.None.1.7',
    space: 'rgb'
  });

LinesKonva.options = {
  container: '.leaflet-overlay-pane',
  value: function(d){
    return d.value;
  },
  lazyFresh: {
    transition: 'opacity 0.1s'
  },
  popup: function(d){
    return 'test'
  },
  blending: 'source-over',
  color: function(d, min, max){
    if(!d) return colorFunc(null);
    var v = (d.value - min) / (max - min);
    return colorFunc(v);
  },
  id: function(d, i){
    return d.id || d[0] || i
  },
  style: {
    stroke: '#fff',
    strokeWidth: 2,
    lineCap: 'round',
    lineJoin: 'round',
  },
  value: function(d) {
    return d.value;
  },
  geoId: function(feature, i) {
    if (feature.properties) return feature.properties.id || i;
    return feature.id || i;
  },
  lat: Util.getLat,
  lng: Util.getLng
};

function isGeojson(ds) {
  return (ds.type && ds.type.toLowerCase().indexOf('feature') !== -1) || ds.features;
}

LinesKonva = Event.extend(LinesKonva, {
  initCanvas: function() {
    var map = this._map;
    var options = this.options;
    var konvaContainer = Util.createContainer(options.container);
    var size = map.getSize();
    var stage = new K.Stage({
      container: konvaContainer, //'.leaflet-tile-pane'
      width: size.x,
      height: size.y
    });
    //
    var kLeafLayer = this.kLeafLayer = new KLeafLayer(stage, {
      transition: options.lazyFresh.transition,
      blending: options.blending,
      ptNPerLayer: options.ptNPerLayer
    });
    kLeafLayer.addTo(map);
  },
  /**
   * addTo 将线图放入地图
   * @param {Object} map 地图对象
   */
  addTo: function(map) {
    if(!map) return;
    if(map._map) map = map._map;
    this._map = map;
    this.isable = true;
    this.initCanvas();
    this.initEvents();
    this.initEventsMap();
    return this;
  },
  geojson: function(json) {
    if(!json) return console.log('地理数据缺失');
    this._geodata = json;
    this.processGeoData(json);
    this.draw();
  },
  processGeoData: function(ds) {
    var result = this.features = {};
    var options = this.options;
    var getGeoId = options.geoId, getLng = options.lng, getLat = options.lat;
    var id, lat, lng;
    if (isGeojson(ds)) {
      var features = ds.features;
      features.forEach(function(feature, i) {
        id = getGeoId(feature, i);
        result[id] = feature;
      });
    } else {
      ds.forEach(function(obj) {
        var latlngs = obj.latlngs || obj.coords || obj.coordinates;
        var coordinates = [];
        latlngs.forEach(function(d) {
          coordinates.push([getLng(d), getLat(d)]);
        });
        id = getGeoId(obj);
        result[id] = {
          type: 'feature',
          geometry: {
            type: 'LineString',
            coordinates: coordinates
          }
        };
      });
    }
  },
  draw: function() {
    var dObj = this.dataObj || {};
    var features = this.features,
      layers = this.layers = {};
    var geometry, coordinates, feature, d;
    this.lineIndex = 0;
    for (var id in features) {
      geometry = features[id].geometry;
      coordinates = geometry.coordinates;
      d = dObj[id];
      var lines = layers[id] = [];
      var groupIndex = 0;
      if (isLineArr(coordinates)) {
        this.createLineAttr(coordinates, id, groupIndex, d);
      } else {
        coordinates.forEach((coord) => {
          if (Array.isArray(coord[0])){
            groupIndex++;
            return this.createLineAttr(coord, id, groupIndex, d);
          } 
          coord.forEach(co => {
            groupIndex++;
            this.createLineAttr(co, id, groupIndex, d);
          });
        });
      }
    }
    //
    this.kLeafLayer.stopLazyFresh();
    this.kLeafLayer.lazyFresh();
  },
  createLineAttr: function(coords, id, groupIndex, d) {
    if (!this.isable) return;
    this.lineIndex += 1;
    var attr = this.getChildOptions();
    var weight = Util.getValue(this.options.weight, d) || 1; //至少有1像素的显示
    attr.strokeWidth = weight;
    var project = this._map.latLngToContainerPoint.bind(this._map);
    var range = this.range || [];
    var stroke = attr.stroke = Util.getValue(this.options.color, d, range[0], range[1]);

    var points = attr.points = [];
    coords.forEach(function(co){
      var pt = project(L.latLng(co[1], co[0]));
      points.push(pt.x, pt.y);
    });
    //
    var ci = Math.floor(points.length / 4);
    var top = {
      x: points[ci * 2],
      y: points[ci * 2 + 1]
    };
    //
    this.kLeafLayer.addOrSetShape({
      data: d,
      top: top,
      Constructor: K.Line,
      index: this.lineIndex,
      id: id + '-' + groupIndex,
      attrs: attr
    });
  },
  getChildOptions: function() {
    var options = this.options;
    return options.style;
  },
  updateRange: function(){
    var ds = this._data;
    var options = this.options;
    var getValue = options.value, filter = options.filter;
    var d, value, min, max;
    var range = this.range = [];
    for (var i in ds) {
      d = ds[i];
      value = getValue(d);
      if (isNone(value)) continue;
      if(filter && !filter(d)) continue;
      if (typeof(value) !== 'number') value = parseFloat(value);
      if (isNone(range[0])) range[0] = range[1] = value;
      min = range[0], max = range[1];
      if (value > max) range[1] = value;
      if (value < min) range[0] = value;
    }
  },
  initEventsMap: function() {
    this._map
      .on('zoomend', this.draw.bind(this))
      .on('moveend', this.draw.bind(this));
  },
  initEvents: function(){
    var self = this;
    var shape;
    var kLeafLayer = this.kLeafLayer
      .onKonva('dragstart', function(e) {
      })
      .onKonva('mouseover touchstart', function(e) {
        shape = e.target;
        shape.setAttrs({
          opacity: 0.8
        });
        shape.parent.draw();
      })
      .onKonva('mouseout', function(e) {
        shape = e.target;
        shape.setAttrs({
          opacity: 1
        });
        shape.parent.draw();
      })
      .onKonva('mouseout mouseup touchend', function(e) {
        setTimeout(function () {
          kLeafLayer.enableMapEvents();
        });
      })
       .onKonva('mousedown touchstart', this.onMouseDown.bind(this));
      //
      var events = ['mouseout', 'mousedown', 'mouseover', 'mouseout', 'touchstart', 'touchend', 'touchup'];
      events.forEach(function(event){
        kLeafLayer.onKonva(event, function(e){
          fireEvent(event, e, self);
        });
      });
  },
    onMouseDown: function(e) {
    var options = this.options;
    var map = this._map;
    var shape = e.target;
    var d = shape.__data;
    var popup = options.popup;
    if (popup) popup = popup.bind(options);
    if (!popup) {
      popup = options.popup;
      if (popup) {
        popup = popup.bind(options);
      }
    }
    if (!popup) return;
    var popupText = popup(d);
    setTimeout(function () {
      if(shape){
        var top = shape.__options.top;
        var latlng = map.containerPointToLatLng(L.point(top.x, top.y));
         map.openPopup(popupText, L.latLng(latlng.lat, latlng.lng));
      } else {
      }
    }.bind(this));

    this.kLeafLayer.disableMapEvents();
  },
  each: function(fn) {},
  /**
   * destroy  销毁canvas
   */
  destroy: function() {
    this.kLeafLayer.destroy();
    this.konvaContainer.remove();
  },

  /**
   * data 灌入数据
   */
  data: function(ds) { //灌入数据
    if(!ds) return console.log('没数据...');
    this._data = ds;
    this.processing(ds);
    this.updateRange();
  },

  processing: function(ds){
    var getId = this.options.id;
    var d, id, dataObj = this.dataObj = {};
    for(var i in ds){
      d = ds[i];
      id = getId(d);
      dataObj[id] = d;
    }
  },

  render: function(data) {
    if (data) this.data(data);
    this.draw();
  },

  disable: function() {
    this.isable = false;
    this.kLeafLayer.disable();
  },
  enable: function() {
    this.isable = true;
    this.kLeafLayer.enable();
  },

  update: function() {
    this.updateLife();
  },

  updateOptions: function(options) {
    this.options = Util.deepMerge(this.options, options);
    this.draw();
  },

  remove: function() {
  },

});


dmap.LinesKonva = LinesKonva;
dmap.linesKonva = function(options) {
  return new LinesKonva(options);
};

module.exports = LinesKonva;
