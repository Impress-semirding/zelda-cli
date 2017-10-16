var L = require('./../../leaflet');
var K = require('konva');
var _ = require('lodash');

var KLeafLayer = require('./../../render/leaflet_layer_konva');
// var Event = require('bcore/event');

var Utils = require('./../../core/utils');
var getSprite = Utils.getSprite;
var fireEvent = Utils.fireEvent;
var getValue = Utils.getValue;

const createLinkPoints = require('./createLinkPoints');

/**
 * @class LinkKonva
 */
function getValue(f, a, b, c) {
  if (typeof(f) === 'function') return f(a, b, c);
  return f;
}

var LinkKonva = L.Class.extend({
  includes: [L.Mixin.Events],

  initialize: function(options) {
    //this.kLeafLayer = new KLeafLayer();
    options = this.options = Utils.deepMerge(LinkKonva.options, options);
    this.dots = {};
    this.resetVariables();
    this.initAnimation()
  },
  resetVariables: function() {
    this.isable = true;
  },
  disable: function() {
    this.isable = false;
    this.kLeafLayer.disable();
  },
  enable: function() {
    this.isable = true;
    this.kLeafLayer.enable();
  },
  addTo: function(map) {
    if (this._map || !map) return;
    this._map = map;
    this.initCanvas();
    this.initEventsMap();
    this.initEventsShapes();
  },
  initAnimation: function() {
    let style = document.createElement('style');
    style.innerHTML = `
      @keyframes marker_wave {
        from {
          transform: scale(0.6);
          opacity: 1;
        }
        to {
          transform: scale(1);
          opacity: 0;
        }
      }
    `;
    document.head.append(style);
  },
  initEventsShapes: function() {
    var self = this;
    var hoverScale = this.options.hoverScale || 1;
    //
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
      .onKonva('mousedown touchstart', this.onMouseDown.bind(this))
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
      popup = options.child.popup;
      if (popup) {
        popup = popup.bind(options.child);
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

    this.kLeafLayer.disableMapEvents(e);
  },

  // initDot: function(p, d) {
  //   if (this.dots[p.lat + 'x' + p.lng]) return;
  //   let marker = L.latLng(p.lat, p.lng);

  //   let delay = Math.random() * 2;
  //   //let delay = 0;

  //   this.dots[p.lat + 'x' + p.lng] = []
  //   for (let i = 0;i < 4;i++) {
  //     let dot = L.circleMarker(marker, {
  //       radius: getValue(this.options.marker.radius, d),
  //       weight: 0,
  //       color: this.options.marker.background,
  //     });

  //     dot.addTo(this._map);
  //     dot._path.style.opacity = 0;
  //     dot._path.style.zIndex = -100;
  //     dot._path.style.transformOrigin = 'center';
  //     dot._path.style.animation = 'marker_wave 5s ease ' + (delay + i * 1.5) + 's infinite';
  //     this.dots[p.lat + 'x' + p.lng].push(dot);
  //     window.dot = dot;
  //   }
  // },

  initCanvas: function() {
    var map = this._map;
    var options = this.options;
    //
    var size = map.getSize();
    var konvaContainer = this.konvaContainer = Utils.createContainer(options.container);
    var stage = new K.Stage({
      container: konvaContainer, //'.leaflet-tile-pane'
      width: size.x,
      height: size.y
    });
    //
    this.kLeafLayer = new KLeafLayer(stage, {
      transition: options.lazyFresh.transition,
      blending: options.blending,
      ptNPerLayer: options.ptNPerLayer
    });
    var konvaContainer = window.konvaContainer =  this.kLeafLayer.stage.content;
    konvaContainer.style.pointerEvents = options.pointerEvents || 'auto';
    this.kLeafLayer.addTo(map);
  },

  /**
   * data 传入可视化数据
   * @param  {Object} _data 需要可视化的数据
   * @param  {Object} opt      配置参数
   */
  data: function(ds) {
    if (!ds) return;
    this._data = ds;
    this.updateDataZindex();
    this.processing()
  },
  processing: function(){
    var ds = this._data;
    this.range = Utils.getRangePercentTile(ds, this.options.value);
    for (let key in this.dots) {
      this.dots[key].forEach(marker => marker._container.remove());
      delete this.dots[key];
    }
    // ds.forEach(d => {
    //   // this.initDot(d.from, d);
    //   this.initDot(d.to, d);
    // });
  },
  updateDataZindex: function(){
     var options = this.options;
     var zIndex = options.zIndex || options.child.zIndex;
    if (zIndex) this._data = _.sortBy(this._data, zIndex);
  },
  updateOptions: function (options) {
    var kLeafLayer = this.kLeafLayer;
    kLeafLayer.resetOffset();
    options = this.options = Utils.deepMerge(this.options, options);
    kLeafLayer.hideLayers();
    kLeafLayer.updateOptions({
      transition: options.lazyFresh.transition,
      blending: options.blending,
      ptNPerLayer: options.ptNPerLayer
    });
    this.draw();
  },
  updateFilter: function (filter) {
    if (!filter || typeof (filter) !== 'function') return;
    this.options.filter = filter;
    this.draw();
  },
  render: function(data) {
    if (data) this.data(data);
    if(data) this.kLeafLayer.beginDraw();
    this.draw();
    if(data) this.kLeafLayer.endDraw();
  },
  createShapeAttr: function(d, i) {
    if (!this.isable || !this._data || !this._data.length) return;
    const {options} = this;

    var from = getValue(options.from, d);
    var to =   getValue(options.to,   d);

    //
    var id = getValue(options.id.bind(options), d, i);
    var value = getValue(options.value.bind(options), d, i);
    var weight = getValue(options.weight, d, value, this.range.min, this.range.max) || 1; //至少有1像素的显示
    var shadowColor = getValue(options.shadowColor, d, i);
    var shadowBlur = getValue(options.shadowBlur, d, i);
    var fill = getValue(options.color, d, i);
    //
    var ptFrom = this._map.latLngToContainerPoint(L.latLng(from.lat, from.lng));
    var ptTo =   this._map.latLngToContainerPoint(L.latLng(to.lat,     to.lng));

    const {kHeight, ptN, head} = options;
    const points = createLinkPoints(ptFrom, ptTo, kHeight, ptN, weight, head);
    
    var ci = Math.floor(points.length / 4);
    var top = {
      x: points[ci - 1],
      y: points[ci]
    }
    // cx, cy,  
    return {
      data: d,
      Constructor: K.Line,
      index: i,
      id: id,
      top: top,
      attrs: {
        closed : true,
        // shadowBlur: 10,
        // shadowOffsetX: 5,
        // shadowOffsetY: 5,
        // shadowOpacity: 0.8,
        // shadowColor: '#000000',
        points: points, //[, cx, cy, tx, ty],
        // stroke: stroke,
        // strokeWidth: weight,
        // lineCap: 'round',
        // lineJoin: 'round',
        shadowColor: shadowColor,
        shadowBlur: shadowBlur,
        fill
      }
    };
  },
  draw: function () {
    var ds = this._data;
    if (!ds || !this.isable) return;

    var d, shapeOptions;
    var kLeafLayer = this.kLeafLayer;
    var filter = this.options.filter;

    for (var i = ds.length - 1; i > -1; i--) {
      d = ds[i];
      //
      if(filter){
        if(!filter(d, i)) continue;
      }
      shapeOptions = this.createShapeAttr(d, i);
      kLeafLayer.addOrSetShape(shapeOptions);
    }

    kLeafLayer.stopLazyFresh();
    kLeafLayer.lazyFresh();
  },

  /**
   * initEventsMap 和地图移动绑定的事件
   */
  initEventsMap: function() {
    this._map
      .on('zoomend', this.draw.bind(this))
      .on('moveend', this.draw.bind(this));
  },
  /**
   * destroy  销毁canvas
   */
  destroy: function() {
    this.kLeafLayer.destroy();
    this.konvaContainer.remove();
  },

  clean: function(){
    this.kLeafLayer.clean();
  }
});

LinkKonva.options = {
  ptN: 30,
  zIndex: null,
  kHeight: 0.8,
  refreshInterval: 1,
  ptNPerLayer: 1000,
  lazyFresh: {
    transition: 'opacity 0.4s'
  },
  weight: function (d) {
    return 4;
  },
  id: function (d, i) {
    return d.id || i;
  },
  color: function(d, i){
    return 'rgba(0,30,160,1)';
  },
  onPopupOpen: function(d, popup){
  },
  filter: function(d){
    return true
  },
  value: function(d){
    return d.count || d.value
  },
  head: {
    phiWeight: 1.0, //箭头和粗细的比例
    phi: Math.PI / 6
  },
  marker: {
    background: '#ffff66',
    radius: 80,
  },
  from: Utils.getFrom,
  to: Utils.getTo,
  hoverScale: 0.2,
  blending: 'lighter',
  container: '.leaflet-overlay-pane',
  shadowColor: 'rgba(0,155,155,0.2)',
  shadowBlur: 60,
  child: {
  }
};

var dmap = L.dmap = L.dmap || {};

dmap.LinkKonva = LinkKonva;
dmap.linkKonva = function(options) {
  return new LinkKonva(options);
};

module.exports = LinkKonva;
