/*
jquery leaflet
 */
var $ = require('jquery');
var Utils = require('bcore/utils');
var L = require('./../leaflet');
/**
 * UrlHash 记录位置等信息
 * @param {Object} map     leaflet地图对象
 * @param {Object} options 配置
 */
function UrlHash(map, options) {
  this.addTo(map);
  options = this.options = Utils.deepMerge(UrlHash.options, options);
}

UrlHash.options = {};

UrlHash.prototype = {
  addTo: function(map) {
    this._map = map;
    this.get();
    this.initEventsMap();
  },
  initEventsMap: function() {
    this._map
      .on('load', this.get.bind(this))
      .on('moveend', this.set.bind(this));
  },
  get: function() {
    var lat = getQueryStringByName('lat'), lng = getQueryStringByName('lng'), zoom = getQueryStringByName('zoom');
    if (lat && lng && zoom) {
      var map = this._map;
      setTimeout(function() {
        map.setView({
          lat: parseFloat(lat, 10),
          lng: parseFloat(lng, 10)
        }, zoom, {
          animate: false
        });
      });
    }
  },
  set: function() {
    var map = this._map;
    var zoom = map.getZoom();
    var center = map.getCenter();
    var querystring = '#&lat=' + center.lat + '&lng=' + center.lng + '&zoom=' + zoom;
    window.location.href = window.location.origin + window.location.pathname + window.location.search  + querystring;
  }
};

function getQueryStringByName(name) {
  var reg = new RegExp('[\?\&]' + name + '=([^\&]+)', 'i');
  var result = window.location.href.match(reg);
  if (result == null || result.length < 1) {
    return '';
  }
  return result[1];
}

L.dmap = L.dmap || {};
L.dmap.urlHash = function(map, options){
  return new UrlHash(map, options)
}
module.exports = UrlHash;
