var Utils = require('bcore/utils');
var Event = require('bcore/event');
var LeafletEditable = require('./../libs/Leaflet.Editable');
var L = require('ldmap/leaflet');
//
function Shape(options) {
  options = this.options = Utils.deepMerge(Shape.options, options);
  this.shapes = {};
}

Shape.options = {};

function parseLatlngs(latlngs) {
  if (typeof(latlngs[0]) !== 'object') {
    return parseLatlng(latlngs);
  }
  if (typeof(latlngs[0][0]) === 'object') {
    latlngs.forEach(function(item) {
      parseLatlngs(item);
    });
  } else {
    latlngs.forEach(function(latlng, i){
      latlngs[i] = parseLatlng(latlng);
    });
  }
  return latlngs;
}

function parseLatlng(latlng) {
  return L.latLng(latlng[1], latlng[0]);
}

Shape = Event.extend(Shape, {
  add: function (feature, id) {
    feature = JSON.parse(JSON.stringify(feature));
    // console.log(feature, 'feature');
    var options = {
      fillColor: '#099',
      color: '#099',
      weight: 3
    };
    var geometry = feature.geometry;
    var shape, type = geometry.type.toLowerCase();
    var coordinates = geometry.coordinates;
    var properties = feature.properties;
    var latlngs = parseLatlngs(coordinates);
    // console.log(type, feature);
    var radius;
    if (type === 'polygon') {
      // if (latlngs.length < 2) return console.lorg('点太少 不足以形成多边形');
      shape = L.polygon(latlngs, options);
    } else if (type === 'linestring') {
      shape = L.polyline(latlngs, options);
    } else if (type === 'point') {
      var radius = properties.radius;
      if (radius) {
        shape = L.circle(latlngs, radius, options);
      } else {
        var icon =  L.icon({
          iconUrl: 'http://7i7ifh.com1.z0.glb.clouddn.com/marker-icon.png',
          // iconRetinaUrl: 'http://7i7ifh.com1.z0.glb.clouddn.com/marker-icon.png',
        });
        shape = L.marker(latlngs, {
          icon: icon
        });
        console.log(shape);
        this.initEventMarker(shape);
      }
    }
    this.shapes[id] = shape;
    shape.addTo(this._map);
    shape.__id = id;
    this.emit('add');
    this.initEventShape(shape);
    shape.bindPopup('id: ' + id + '<br>\
      录入功能开发中...');
  },
  initEventMarker: function(marker){
    var self = this;
    marker.on('dragend', function(){
      self._map.fire('editable:vertex:dragend', {
        layer: marker
      });
    });
  },
  render: function (features) {
    for (var id in features) {
      var feature = features[id];
      this.add(feature, id);
    }
  },
  addTo: function(map) {
    this._map = map;
  },
  isLatlng: function(arr) {},
  initEventShape: function (shape) {
    var loopid;
    shape
    .on('mouseover', function() {
      clearTimeout(loopid);
      shape.enableEdit();
    })
    .on('mouseout', function() {
      loopid = setTimeout(function(){
        shape.disableEdit();
      }, 20000);
    });
  },
  clean: function(){
    var shapes = this.shapes;
    var map = this._map;
    for(var id in shapes){
      var shape = shapes[id];
      map.removeLayer(shape);
    }
    this.geojsons = {};
  }
});

module.exports = Shape;