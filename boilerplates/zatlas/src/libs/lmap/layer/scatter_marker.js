/**
* @Author: disoul
* @Date:   2016-10-30T00:31:32+08:00
* @Last modified by:   disoul
* @Last modified time: 2016-11-12T01:28:30+08:00
*/



var L = require('./../leaflet');
require('./../render/canvas');
var Utils = require('./../core/utils');
var dmap = L.dmap = L.dmap || {};
var Event = require('bcore/event');
var EVENTS = Utils.EVENTS;

//
require('./../index.css');
require('./scatter_marker.css');

/**
 * @class ScatterMarker
 */
var Marker = L.Marker;

function ScatterMarker(options) {
  options = this.options = Utils.deepMerge(ScatterMarker.options, options);
  this.initialize(options);
}
var ScatterMarker = Event.extend(ScatterMarker, {
  initialize: function (options) {
    this.initDom();
  },
  initDom: function () {
    var options = this.options;
    var icon = L.divIcon({
      className: 'circle-node',
      iconSize: [0, 0]
    });
    var marker = this.marker = new Marker([0, 0], {
      icon: icon,
    });
  },
  addTo: function (map) {
    if (!map) return;
    this._map = map;
    this.marker.addTo(map);
    this.initDomIcon();
    this.initEvents();
  },
  //
  initEvents: function () {
    var self = this;
    var marker = this.marker;
    //
    EVENTS.forEach(function (eventName) {
      marker.on(eventName, function () {
        self.emit(eventName, {
          id: self.id,
          layer: self,
          data: self._data
        });
      });
    });
  },
  updatePopupPostion: function () {
    var map = this._map;
    //
    var container = this.textNode;
    var hoverScale = this.options.hoverScale;
    var yOffset = container.offsetHeight / 2 * hoverScale;
    var pixelCenter = map.latLngToContainerPoint(this.center);
    pixelCenter.y -= yOffset;

    this.popupPosition = map.containerPointToLatLng(pixelCenter);
  },
  //
  initDomIcon: function () {
    var genHtml = this.options.shape.html.bind(this);
    if (!genHtml) return;
    var marker = this.marker;
    var container = this.container = marker._icon;
    genHtml(container);
  },

  updateOptions: function (options) {
    this.options = Utils.deepMerge(this.options, options);
  },

  data: function (d) {
    if (!d) return;
    this._data = d;
    this.updateData(d);
  },

  updateData: function (d) {
    d = d || this._data;
    this._data = d;
    var options = this.options;
    //
    var getId = options.id;
    var id = this.id = getId(d);
    if (id !== null && id !== undefined) this.id = id;

    var getLng = options.lng;
    var getLat = options.lat;
    var lat = getLat(d);
    var lng = getLng(d);
    this.center = L.latLng(lat, lng);
    this.updateCenter(lat, lng);

    var getText = options.text.bind(options);
    if (getText) {
      var text = getText(d, this.textNode);
      if (text === undefined) {
        this.updateText('');
      } else {
        this.updateText(text);
      }
    }

    var applyCss = (options.css || options.applyCss).bind(this);
    var range = options.range || [];
    if (applyCss) applyCss(d, this.textNode, range[0], range[1]);
  },

  updateZIndex: function () {
    if (this._zIndex) this.container.style.zIndex = this._zIndex;
  },

  updateText: function (text) {
    if (text === this._text) return;
    this._text = text;
    var textNode = this.textNode;
    if (textNode) textNode.innerHTML = text;
  },

  updateCenter: function (lat, lng) {
    if (!lat || !lng || (lat === this._clat && lng === this._clng)) return;
    this._clat = lat;
    this._clng = lng;
    this.marker.setLatLng(L.latLng(lat, lng));
  },

  render: function(d) {
    if (d) this.data(d);
    this.updatePopupPostion();
  },

  /**
   * destroy  销毁
   */
  destroy: function() {
    this.marker.off();
    this._map.removeLayer(this.marker);
  }
});

ScatterMarker.options = {
  'lat': Utils.getLat,
  'lng': Utils.getLng,
  'id': function (d) {
    return d.id;
  },
  hoverScale: 1.2,
  'css': function (d, node) {
    var radius = 10;
    var bgColor = '#fff';
    return {
      'background': bgColor,
      'left': -radius,
      'top': -radius,
      'width': 2 * radius,
      'height': 2 * radius,
      'line-height': 2 * radius + 'px',
      'border-radius': 2 * radius
    };
  },
  'text': function (d) {
    return d.count;
  },
  'shape': {
    'html': function (node) {
      var child = document.createElement('div');
      child.className = "interactive-circle";
      // node.innerHTML = '<div class=></div>';
      node.appendChild(child);
      this.textNode = child;
    }
  }
};

dmap.ScatterMarker = ScatterMarker;
dmap.scatterMarker = function(options) {
  return new ScatterMarker(options);
};

module.exports = ScatterMarker;
