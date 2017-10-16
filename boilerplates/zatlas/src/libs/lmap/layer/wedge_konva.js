var Event = require('bcore/event');
var Utils = require('./../core/utils');
var KLeafLayer = require('./../render/leaflet_layer_konva');
var K = require('konva');
var L = require('./../leaflet');
var _ = require('lodash');


var fireEvent = Utils.fireEvent;
var getValue = Utils.getValue;

// var getValue = Utils.getValue;

//扇形组件
function WedgeKonva(options) {
  this.initialize(options);
}

WedgeKonva.options = {
  ptNPerLayer: 2000,
  lazyFresh: {
    transition: 'opacity 0.4s'
  },
  blending: 'lighter',
  lng: Utils.getLng,
  lat: Utils.getLat,
  id: function (d, i) {
    return d.id || i;
  },
  radius: 10,
  angle: 10,
  rotation: 0,
  stroke: 'transparent',
  strokeWidth: 0,
  fill: 'rgba(0,190,190,0.2)',
  hoverScale: 1.2,
  zIndex: function (d) {
    return -d.value;
  }
};

WedgeKonva = Event.extend(WedgeKonva, {
  addTo: function (map) {
    this._map = map;
    this.initCanvas();
    this.initEventsMap();
    this.initEventsShapes();
  },
  initialize: function (options) {
    options = this.options = Utils.deepMerge(WedgeKonva.options, options);
    this.resetVariables();
  },
  resetVariables: function () {
    this.isable = true;
  },
  disable: function () {
    this.isable = false;
    this.kLeafLayer.disable();
  },
  enable: function () {
    this.isable = true;
    this.kLeafLayer.enable();
  },
  initCanvas: function () {
    var map = this._map;
    var options = this.options;
    //
    var size = map.getSize();
    var stage = new K.Stage({
      container: options.container, //'.leaflet-tile-pane'
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
   * data 传入可视化数据
   * @param  {Object} _data 需要可视化的数据
   * @param  {Object} opt      配置参数
   */
  data: function (data) {
    this._data = data;
    var options = this.options;
    var zIndex = options.zIndex || options.child.zIndex;
    if (zIndex) this._data = _.sortBy(data, zIndex);
  },
  createShapeAttr: function (d, i) {
    if (!this.isable) return;
    var options = this.options;
    var zoom = this._map.getZoom();
    //
    var lat = getValue(options.lat, d);
    var lng = getValue(options.lng, d);
    var id = getValue(options.id.bind(options), d, i);
    var radius = getValue(options.radius, d, zoom) || 1; //至少有1像素的显示
    var angle = getValue(options.angle, d, zoom) || 1; //至少有1度的展开
    var rotation =  getValue(options.rotation, d, zoom);
    var fill = getValue(options.fill, d, zoom);
    var stroke = getValue(options.stroke, d, zoom);
    var strokeWidth = getValue(options.strokeWidth, d, zoom);
    //
    var pt = this._map.latLngToContainerPoint(L.latLng(lat, lng));
    return {
      data: d,
      Constructor: K.Wedge,
      index: i,
      id: id,
      attrs: {
        x: pt.x,
        y: pt.y,
        radius: radius,
        rotation: rotation,
        angle: angle,
        stroke: stroke,
        strokeWidth: strokeWidth,
        fill: fill
      }
    };
  },
  draw: function () {
    var ds = this._data;
    if (!ds) return;
    if (!this.isable) return;

    var d, shapeOptions;
    var kLeafLayer = this.kLeafLayer;
    var filter = this.options.filter;

    for (var i = ds.length - 1; i > -1; i--) {
      d = ds[i];
      //
      if (filter) {
        if (!filter(d, i)) continue;
      }
      //
      shapeOptions = this.createShapeAttr(d, i);
      kLeafLayer.addOrSetShape(shapeOptions);
    }
    kLeafLayer.stopLazyFresh();
    kLeafLayer.lazyFresh();
  },
  render: function (data) {
    if (data) this.data(data);
    if (data) this.kLeafLayer.beginDraw();
    this.draw();
    if (data) this.kLeafLayer.endDraw();
  },
  initEventsMap: function() {
    this._map
      .on('zoomend', this.draw.bind(this))
      .on('moveend', this.draw.bind(this));
  },
  onMouseDown: function(e){
    var options = this.options;
    var map = this._map;
    var shape = e.target;
    var d = shape.__data;
    var popup = options.popup;
    if (popup) popup = popup.bind(options);
    if (!popup) {
      popup = options.child.popup;
      if (popup) {
        popup = popup.bind(options.child);
      }
    }
    if (!popup) return;
    popupText = popup(d);
    setTimeout(function () {
      var bbox = shape.getClientRect();
      var x = bbox.x + bbox.width / 2,
        y = bbox.y + bbox.height / 2;
      var latlng = map.containerPointToLatLng(L.point(x, y));
      map.openPopup(popupText, L.latLng(latlng.lat, latlng.lng));
    }.bind(this));

    this.kLeafLayer.disableMapEvents();

  },
  initEventsShapes: function () {
    var self = this;
    var hoverScale = this.options.hoverScale || 1;
    //
    var shape;
    var kLeafLayer = this.kLeafLayer
      .onKonva('mouseover touchstart', function (e) {
        shape = e.target;
        shape.setAttrs({
          scale: {
            x: hoverScale,
            y: hoverScale
          }
        });
        shape.parent.draw();
      })
      .onKonva('mouseout', function (e) {
        shape = e.target;
        shape.setAttrs({
          scale: {
            x: 1,
            y: 1
          }
        });
        shape.parent.draw();
      })
      .onKonva('mouseout mouseup touchend', function (e) {
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
});

module.exports = WedgeKonva;
