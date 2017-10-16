/**
* @Author: eason
* @Date:   2016-11-13T14:08:41+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2017-01-05T00:58:47+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/


var $ = require('jquery');
var L = require('./../leaflet');

const Ripple = require('./ripple');

var Utils = require('./../core/utils');

var Map = L.Map.extend({
  options: {
    isRotateZ: false,
    isDoubleClickRipple: true,
    background: null,
    crs: L.CRS.EPSG3857,
    fadeAnimation: L.DomUtil.TRANSITION && !L.Browser.android23,
    trackResize: true,
    markerZoomAnimation: L.DomUtil.TRANSITION && L.Browser.any3d,
    preferCanvas: true,
    zoomSnap: 0.01,

    view3dOptions: {
      x: 50,
      y: 0,
      z: 0
    }
  },

  initOverlay: function() {
    this.overlayNode = $('<div style="position:absolute;width:100%;height:100%;top:0;left:0;pointer-events:none;"></div>').appendTo(this._container);
  },
  initUIContainer: function() {
    return this.uiNode = $('<div style="position:absolute;width:100%;height:100%;top:0;left:0;pointer-events:none;z-index:1000;"></div>').appendTo(this._container);
  },
  getUIContainer: function() {
    var uiNode = this.uiNode;
    if (!uiNode) uiNode = this.uiNode = this.initUIContainer();
    return uiNode;
  },
  getOverlay: function() {
    return this.overlayNode;
  },

  initialize: function(container, options) {
    container = this.domContainer = Utils.getContainer(container);
    if (!container) return console.log('map container错误');
    var id = container.getAttribute('id');
    if (!id) {
      id = 'map-' + Math.floor(Math.random() * 1000000000);
      container.setAttribute('id', id);
    }


    options = L.setOptions(this, options);
    L.Map.prototype.initialize.call(this, id, options);
    this.initOverlay();
    this.updateDragging();
    this.updateBgColor();
    this.initEvent();
    setTimeout(this.initRippe.bind(this));
  },

  initRippe: function(){
    const ripple = new Ripple();
    ripple.addTo(this);
  },

  getPixelBounds: function() {
    var topLeftPoint = this._getTopLeftPoint();
    var bounds = new L.Bounds(topLeftPoint, topLeftPoint.add(this.getSize()));
    var offsetBoundX = this.offsetBoundX || 0,
      offsetBoundY = this.offsetBoundY || 0;
    bounds.min.x = bounds.min.x - offsetBoundX;
    bounds.min.y = bounds.min.y - offsetBoundX;
    bounds.max.x = bounds.max.x + offsetBoundY;
    bounds.max.y = bounds.max.y + offsetBoundY;
    return bounds;
  },

  updateOptions: function(options) {
    if (!options) return;
    options = this.options = Utils.deepMerge(this.options, options);
    if (options.zoom)   this.setZoom(options.zoom);
    if (options.center) this.panTo(options.center);
    this.updateDragging();
    this.updateBgColor();
    L.setOptions(this, this.options);
  },

  updateDragging: function(){
    let {draggable} = this.options;
    if(draggable === false){
      this.dragging.disable();
    } else {
      this.dragging.enable();
    }
  },

  init3d: function() {
    if (this.isInit3d) return;
    this.offsetBoundX = 1000;
    this.offsetBoundY = 1000;
    var container = this._container;
    $(container).css({
      'overflow': 'visible',
    });

    this.addHooks3dLayer();
    this.initEvents3d();
    this.isInit3d = true;
  },

  addHooks3dLayer: function() {
    this
      .on('move', this._update3dLayers, this);
  },

  removeHooks3dLayer: function() {
    this
      .off('move', this._update3dLayers, this);
  },

  _getTransformOrigin: function(index) {
    var size = this._size,
      pos = this._getMapPanePos();
    return (-pos.x + size.x / 2) + 'px ' + (-pos.y + size.y / 2 + index * 1) + 'px';
  },

  _update3dLayer: function(container, index) {
    var origin = this._getTransformOrigin(index);
    var transform = 'rotateX(' + this.options.view3dOptions.x + 'deg)';
    container.css({
      'transformOrigin': origin,
      'transform': transform,
      'zIndex': 0
    });
    $('.leaflet-marker-pane').show();
  },

  _update2dLayer: function(container, index) {
    var origin = this._getTransformOrigin(index);
    var transform = 'rotateX(0deg)';
    container.css({
      'transformOrigin': origin,
      'transform': transform + 'translateZ(10px)',
      'zIndex': 0
    });
  },

  _update3dLayers: function() {
    this.init3d();
    var perspective = 1200;
    var panes = this.panes = $(this._container).find('.leaflet-map-pane');
    panes.css({
      'webkitPerspective': perspective,
      'perspective': perspective,
      'perspectiveOrigin': this._getTransformOrigin(0),
    });
    this._update3dLayer(panes.find('.leaflet-objects-pane'), 1);
    this._update3dLayer(panes.find('.leaflet-tile-pane'), 1);
  },

  _update2dLayers: function() {
    var panes = this.panes = $(this._container).find('.leaflet-map-pane');
    var perspective = 1200;
    panes.css({
      'webkitPerspective': perspective,
      'perspective': perspective,
      'perspectiveOrigin': this._getTransformOrigin(0),
    });
    this._update2dLayer(panes.find('.leaflet-objects-pane'), 1);
    this._update2dLayer(panes.find('.leaflet-tile-pane'), 1);
  },

  view3d: function(options) {
    var options = L.Util.extend(this.options.view3dOptions, options);
    this._update3dLayers();
  },

  view2d: function() {
    this._update2dLayers();
    this.cancel3d();
    this.hideMarkerPane();
    this.disableRotate();
  },

  cancel3d: function() {
    this.offsetBoundX = 0;
    this.offsetBoundY = 0;
    this.removeHooks3dLayer();
  },
  //delete all charts
  hideMarkerPane: function() {
    $('.leaflet-marker-pane').hide();
    $('.leaflet-marker-pane').css('transform', 'rotateZ(0deg)');
  },

  //////////////////////////////////////////////////////
  setDomStyle: function(style) {
    if (style && typeof(style) === 'object') {
      $(this._container).css(style);
    }
  },
  updateBgColor(){
    const backgroundColor = this.options.background;
    if (backgroundColor) this.setBgColor(backgroundColor);
  },
  setBgColor: function(color) {
    this.setDomStyle({
      'background-color': color
    });
  },

  detect: function() {
    this.on('moveend', function() {
      console.log(this.getCenter(), this.getZoom())
    });
  },

  disableRotate: function() {
    this.isRotateZ = false;
    this.dragging.enable();
    $('.leaflet-layer').attr('style', 'transform:rotateZ(' + 0 + 'deg)');
    $('.leaflet-marker-pane').css('transform', 'rotateZ(0deg)');
    // $('.linedrawer').css('transform','rotateY(0deg)');
    this.fire('rotate', {
      rotation: 0
    });
  },

  enableRotate: function() {
    this.isRotateZ = true;
    this.dragging.disable();
  },
  initEvent(){
    setTimeout(this.initEvent.bind(this), 1000)
    this.invalidateSize();
    // this.on('resize', () => {
      
    // })
  },
  initEvents3d: function() {
    //turn 3d when click view3d.
    this.angle = 0;
    this.xdrag = 0;
    var self = this;
    var isDown = false;
    var xpos = 0;
    var node = $('#map-container');
    node.on('mousedown', function(e) {
        if (!self.isRotateZ) return;
        xpos = e.pageX;
        isDown = true;
        self.fire('rotatestart');
      })
      .on('mousemove', function(e) {
        if (!self.isRotateZ || !isDown) return;


        self.xdrag = (xpos - e.pageX) / 4;
        var rotation = 'rotateZ(' + (self.angle + self.xdrag) % 360 + 'deg)';
        var origin = self._getTransformOrigin(0);

        var cssObj = {
          '-webkit-transform': rotation,
          'transform': rotation,
          'transform-origin': origin,
          '-webkit-transform-origin': origin
        };
        $('.leaflet-layer').css(cssObj);
        $('.leaflet-marker-pane').css(cssObj);
        $('.leaflet-objects-pane').css('transform-origin', origin);
        $('.leaflet-tile-pane').css('transform-origin', origin);
        self.fire('rotate', {
          rotation: self.angle + self.xdrag
        });
      })
      .on('mouseup', function() {
        if (!self.isRotateZ) return;
        isDown = false;
        self.fire('rotateend');
        self.angle = self.angle + self.xdrag;
      });
  },

});

var dmap = L.dmap = L.dmap || {};

dmap.Map = Map;
dmap.map = function(id, options) {
  return new Map(id, options);
};
module.exports = Map;
