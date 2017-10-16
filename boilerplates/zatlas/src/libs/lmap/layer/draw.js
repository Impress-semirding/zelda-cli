'use strict';

var L = require('./../leaflet');
var Utils = require('./../core/utils');
var isNone = Utils.isNone;
var getColorFunc = require('./../core/utils').getColorFunc;

var distance = require('turf-distance');
var lineDistance = require('turf-line-distance');
var turfSimplify = require('turf-simplify');



function getTime() {
  return new Date().getTime() / 1000;
}

function isPinch(e) {
  return e && e.touches && e.touches.length > 1;
}

var Draw = L.Class.extend({
  includes: [L.Mixin.Events],
  initialize: function(options) {
    this.options = Utils.deepMerge(Draw.options, options);
  },
  addTo: function(map) {
    this._map = map;
    this.initEvents();
    return this;
  },
  initEvents: function() {
    var map = this._map;
    var container = map._container;
    if (L.Browser.touch) {
      L.DomEvent.on(container, 'touchstart', this.onMousedown, this);
      L.DomEvent.on(container, 'touchmove', this.onMousemove, this);
      L.DomEvent.on(container, 'touchend', this.onMouseup, this);
    } else {
      map
        .on('mousedown', this.onMousedown.bind(this))
        .on('mousemove', this.onMousemove.bind(this))
        .on('mouseup', this.onMouseup.bind(this));
    }
  },
  getLatlng: function(e) {
    var touch = e.touches[0];
    var map = this._map;

    var containerPoint = map.mouseEventToContainerPoint({
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    var layerPoint = map.containerPointToLayerPoint(containerPoint);
    return map.layerPointToLatLng(layerPoint);
  },
  onMousedown: function(e) {
    if (!this.isable || isPinch(e)) return;
    this.fire('draw-start');
    this.isdown = true;
    var latlng = e.latlng || this.getLatlng(e);
    this.latlngs = [latlng];
    this.curT = getTime();
  },
  onMousemove: function(e) {
    if (!this.isable || !this.isdown || isPinch(e)) return;
    var latlng = e.latlng || this.getLatlng(e);
    this.latlngs.push(latlng);
    if (!this.curCurve) {
      this.curCurve =
        L.polyline(this.latlngs, this.options.editing)
        .addTo(this._map);
    } else {
      this.curCurve.setLatLngs(this.latlngs);
    }
  },
  onMouseup: function(e) {
    this.isdown = false;
    if (!this.isable || isPinch(e)) return;
    this.finalize(this.curCurve);
  },
  finalize: function(curve) {
    var options = this.options;

    //点的情况
    if (!curve && options.point.isable){ 
      var latlng = this.latlngs[0];
      if(!latlng) return;
      var pointO = options.point.normal;
      var marker = L.circleMarker(latlng, pointO).addTo(this._map);
      marker.setRadius(pointO.radius || pointO.r);
      marker.on('mousedown', function(e){
        L.DomEvent.stopPropagation(e);
        return false;
      })
      return;
    }

    //多边形的情况
    var factor = this.getFactor();
    var geojson = curve.toGeoJSON();
    var isPolygon= this.isPolygon(geojson);

    var geojsonSimplify = turfSimplify(geojson, factor, true);

    if (options.printAfterMouseDown) console.log(JSON.stringify(geojsonSimplify));

    this.fire('draw-end', {
      data: geojsonSimplify
    });

    var geojson = L.geoJson(geojsonSimplify, {
      style: isPolygon ? options.polygon.normal:  options.polyline.normal
    }).addTo(this._map);

    this.latlngs = [];
    this._map.removeLayer(this.curCurve);
    this.curCurve = null;
  },
  isPolygon: function(feature){
    var dist, lineDist = lineDistance(feature, 'meters');
    var coords = feature.geometry.coordinates;
    var a1 = coords[0], a2 = coords[coords.length - 1];
    dist = L.latLng(a1[1], a1[0]).distanceTo(L.latLng(a2[1], a2[0]));
    //
    if(dist / lineDist < this.options.polygonK){ 
      coords.push(a1);
      return true;
    }
    return false;
  },
  getFactor: function() {
    var digits = this.options.digits;
    var map = this._map;
    var center = map.getCenter();
    var pos = map.latLngToContainerPoint(center);
    var pos2 = pos.clone();
    pos2.x = pos2.x + digits;
    var centerMove = map.containerPointToLatLng(pos2);
    return centerMove.lng - center.lng;
  },
  enable: function() {
    this.isable = true;
    this.disableMap();
  },
  disable: function() {
    this.isable = false;
    this.enableMap();
  },
  switch: function(){
    if(this.isable) return this.disable();
    return this.enable();
  },
  enableMap: function() {
    var map = this._map;
    if (!map) return;
    map.dragging.enable();
  },
  disableMap: function() {
    var map = this._map;
    if (!map) return;
    map.dragging.disable();
  }
});

Draw.options = {
  digits: 4,//抽吸精度
  polygonK: 0.1, //最后一段距离 / 周长，判断是否形成polygon
  printAfterMouseDown: false,
  editing: {
    dashArray: '2,9',
    weight: 2,
    opacity: 0.8,
    color: '#f00'
  },
  polyline:{
    isable: true,
    normal:{
      weight: 5,
      opacity: 1,
      color: '#0ff'
    }
  },
  polygon:{
    isable: true,
    normal:{
      weight: 2,
      opacity: 1,
      fillOpacity: 0.5,
      color: 'rgba(0,200,200,0.8)',
      fill: 'rgba(0,200,200,0.8)'
    }
  },
  point: {
    isable: true,
    normal: {
      r: 10,
      fillColor: 'rgba(0,200,200,0.8)',
      color: 'transparent',
      fillOpacity: 0.8
    }
  }
};

var dmap = L.dmap = L.dmap || {};
dmap.Draw = Draw;

dmap.draw = function(options) {
  return new Draw(options);
};

module.exports = Draw;







