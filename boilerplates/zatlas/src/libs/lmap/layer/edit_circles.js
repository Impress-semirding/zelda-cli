var Map = require('./../map/map');
var Event = require('bcore/event');
var Utils = require('bcore/utils');
var EditCircle = require('./edit_circle');
var L = require('./../leaflet');

var EditCircles = Event.extend({
  options: {},
  initialize: function(options) {
    options = this.options = Utils.deepMerge(this.options, options);
  },
  addTo: function(map) {
    this._map = map;
  },
  addCircle: function(latlng) {
    var map = this._map;
    var radius = 1000;
    var circle = new EditCircle(latlng, radius, {
        id: null
    }).addTo(map);
    this.initEventsCircle(circle);
  },
  render: function(ds) {
    var circles = this.circles = [];
    var d, circle, id, center, radius;
    var map = this._map;
    for (var i in ds) {
      d = ds[i];
      id = d.id;
      center = d.center;
      radius = d.radius;
      circle = circles[id] = new EditCircle([center.lat, center.lng], radius, {
        id: id
      }).addTo(map);
      this.initEventsCircle(circle);
    }
  },
  initEventsCircle: function(circle) {
    var self = this;
    circle.on('upload', function() {
        var center = this._latlng;
        var radius = this.getRadius();
        var query = {
          type: 'circle',
          unit: 'm',
          lat: center.lat,
          lng: center.lng,
          radius: radius
        };
        var result = {
          query: query,
          circle: circle
        };
        if (this.id){
          query.id = this.id;
          return self.emit('modify', result);
        } 
        self.emit('create', result);
      })
      .on('delete', function () {
         this._onDeleteCallback();
        if (this.id === null || this.id === undefined) return;
        self.emit('delete', {
          id: this.id
        });
      });
  }
});

L.dmap = L.dmap || {};

L.dmap.editCircles = function (options) {
  return new EditCircles(options);
};

module.exports = EditCircles;