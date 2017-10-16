const Utils = require('bcore/utils');
const Event = require('bcore/event');
const LeafletEditable = require('./raw/Leaflet.Editable');
const L = require('lmap/leaflet');
const _ = require('lodash');

const parseLatlng = latlng => L.latLng(latlng[1], latlng[0]);

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

class Editor extends Event{
  static options = {}
  constructor(options){
    super();
    this.options = Utils.deepMerge(Shape.options, options);
    this.resetVariable();
  }
  resetVariable(){
    this.shapes = {};
  }
  add (feature, id) {
    feature = _.cloneDeep(feature);
    const options = {
      fillColor: '#099',
      color: '#099',
      weight: 3
    };
    const {geometry} = feature;
    let shape, type = geometry.type.toLowerCase();
    const {coordinates} = geometry;
    const properties = feature.properties;
    const latlngs = parseLatlngs(coordinates);
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
  }
  initEventMarker(marker){
    marker.on('dragend', () => this._map.fire('editable:vertex:dragend', { layer: marker}));
  }
  render(features) {
    _.forEach(features, (feature, id) => this.add(feature, id));
  }
  addTo(map) {
    this._map = map;
  }
  isLatlng(arr) {}
  initEventShape(shape) {
    let loopid;
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
  }
  clean(){
    var shapes = this.shapes;
    var map = this._map;
    for(var id in shapes){
      var shape = shapes[id];
      map.removeLayer(shape);
    }
    this.geojsons = {};
  }
}


module.exports = Editor;
