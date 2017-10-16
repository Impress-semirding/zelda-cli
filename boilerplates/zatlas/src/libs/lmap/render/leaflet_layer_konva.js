/**
* @Author: disoul
* @Date:   2016-10-30T00:31:32+08:00
* @Last modified by:   disoul
* @Last modified time: 2016-11-12T01:26:22+08:00
*/



var Event = require('bcore/event');
var Utils = require('bcore/utils');
var L = require('./../leaflet');
const _ = require('lodash');

function KonvaLazyLayer(stage, options) {
  const {content} = stage;
  const style = {
    position: 'absolute', 
    left: '0%', 
    top: '0%',
    zIndex: 1000
  }
  _.forEach(style, (v, k) => {
    content.style[k] = v
  });

  this.options = Utils.deepMerge(KonvaLazyLayer.options, options);
  this.stage = stage;
}

KonvaLazyLayer.options = {
  transition: 'opacity 0.4s',
  blending: 'lighter',
  lazyFresh: true,
  ptNPerLayer: 1000
};

KonvaLazyLayer = Event.extend(KonvaLazyLayer, {
  beginDraw: function(){
    this.versionID = Math.random();
  },
  endDraw: function(){
    var shapes = this.shapes;
    for (var i in shapes) {
      var shape = shapes[i];
      if (shape.__versionID !== this.versionID){
        shape.destroy();
        delete shapes[i];
      }
    }
   this.lazyFresh();
  },
  cleanOld: function(){
    var versionID = this.versionID;
    var cache = this.cache, obj, visual, vid;
    if (!versionID || !cache) return;
    for (var id in cache) {
      obj = cache[id];
      vid = obj.versionID;
      if (vid !== versionID) {
      visual = obj.visual;
      if (visual) {
        visual.off && visual.off();
        visual.destroy && visual.destroy();
      }
      delete cache[id];
      }
    }
  },
  addTo: function(map) {
    this._map = map;
    this.resetVariables();
    this.initEventsMap();
  },
  resetOffset: function(){
    this.pOffset = this.offset;
  },
  disable: function(){
    this.isable = false;
    this.stage.content.style.display = 'none';
  },
  enable: function(){
    this.isable = true;
    this.stage.content.style.display = 'block';
  },
  resetVariables: function() {
    this.isable = true;
    this.shapes = {};
    this.layers = [];
    this.offset = {
      x: 0,
      y: 0
    };
    this.pOffset = {
      x: 0,
      y: 0
    };
  },
  add: function(node) {
    this.stage.add(node);
  },
  addOrSetShape: function (options) {
    var Constructor = options.Constructor,
      index = options.index,
      attrs = options.attrs,
      d = options.data,
      id = options.id;
    var shape, shapes = this.shapes;

    if (shapes[id]){
      shape = shapes[id];
      shape.__options = options;
      shape.__versionID = this.versionID;
      shape.__data = d;
      shape.__attr = attrs;
      return shapes[id].setAttrs(attrs);
    }
    //
    var shape = new Constructor(attrs);
    var layer = this.getOrAddLayer(index);
    layer.getCanvas().getContext('2d').globalCompositeOperation = this.options.blending;
    layer.add(shape);
    //
    shapes[id] = shape;
    shape.scale = ({x: 1.2, y: 1.2});
    shape.__options = options;
    shape.__versionID = this.versionID;
    shape.__data = d;
    shape.__id = id;
    shape.__attr = attrs;
  },
  getOrAddLayer: function (index) {
    if (!this.isable) return;
    index = Math.floor(index / (this.options.shapeNPerLayer || this.options.ptNPerLayer));
    var layers = this.layers;
    var layer = layers[index];
    if (layer) return layer;
    layer = new Konva.Layer();
    layers[index] = layer;
    this.stage.add(layer);
    layer.canvas._canvas.style.zIndex = 1000 - index;//这是一个组件的bug
    return layer;
  },
  fresh: function() {
    this.layers.forEach(function(layer) {
      layer.draw();
    });
  },
  /**
   * lazyFresh 延迟载入
   * @param  {Integer} index 图层序号
   */
  lazyFresh: function () {
    if (!this.isable) return;
    this.lazyFreshDraw(0);
    // this.hideLayers(bind(this));
  },
  lazyFreshDraw: function(index) {
    var self = this;
    //
    index = index || 0;
    var layer = this.layers[index];
    if (!layer) return window.requestAnimationFrame(this.lazyFreshDone.bind(this));
    layer.draw();
    this.resetPos(layer.canvas._canvas, {
      x: self.offset.x - self.pOffset.x,
      y: self.offset.y - self.pOffset.y
    });
    //
    layer.canvas._canvas.style.opacity = 1;
    layer.canvas._canvas.style.transition = this.options.lazyFresh.transition;
    index++;
    //
    this.lazyFreshId = window.requestAnimationFrame(function() {
      this.lazyFreshDraw(index);
    }.bind(this));
  },
  lazyFreshDone: function() {
    this.resetPos(this.stage.content);
    this.layers.forEach(function(layer) {
      L.DomUtil.setPosition(layer.canvas._canvas, {
        x: 0,
        y: 0
      });
    });
  },
  resetPos: function(container, offset) {
    offset = offset || L.DomUtil.getPosition(this._map.getPanes().mapPane);
    if (!offset) return;
    L.DomUtil.setPosition(container, {
      x: -offset.x,
      y: -offset.y
    });
  },
  stopLazyFresh: function() {
    if (!this.lazyFreshId) return;
    window.cancelAnimationFrame(this.lazyFreshId);
    this.lazyFreshId = null;
  },
  //
  hideLayers: function() {
    this.layers.forEach(function(layer) {
      layer.canvas._canvas.style.opacity = 0;
    });
  },
  updateOptions: function(options) {
    this.options = Utils.deepMerge(this.options, options);
    this.updateBlending();
  },
  updateBlending: function(blending) {
    var options = this.options;
    this.layers.forEach(function(layer) {
      layer.getCanvas().getContext('2d').globalCompositeOperation = options.blending;
    });
  },
  initEventsMap: function() {
    var self = this,
    map = this._map;
    map.on('zoomstart', function() {
        self.hideLayers();
        self.stopLazyFresh();
      })
      .on('movestart', function() {
        self.stopLazyFresh();
      })
      .on('moveend', function () {
        self.pOffset = self.offset;
        self.offset = L.DomUtil.getPosition(map.getPanes().mapPane);
      })
      .on('resize', function(){
      });
  },
  onKonva: function (evt, fn) {
    this.stage.on(evt, fn);
    return this;
  },
  enableMapEvents: function() {
    var el = this.stage.content;
    L.DomEvent.off(el, 'click',     L.DomEvent._fakeStop);
    L.DomEvent.off(el, 'mousedown', L.DomEvent.stopPropagation);
    L.DomEvent.off(el, 'mousemove', L.DomEvent.stopPropagation);
    if(this._map.options.draggable !== false) this._map.dragging.enable();
  },
  disableMapEvents: function(e) {
    var el = this.stage.content;
    L.DomEvent.on(el, 'click',     L.DomEvent._fakeStop);
    L.DomEvent.on(el, 'mousedown', L.DomEvent.stopPropagation);
    L.DomEvent.on(el, 'mousemove', L.DomEvent.stopPropagation);
    this._map.dragging.disable();
    e && e.evt.preventDefault();
  },
  clean: function(){
    var shapes = this.shapes;
    for(var i in shapes){
      var shape = shapes[i];
      shape.destroy();
      delete shapes[i];
    }
  },
  destroy: function() {
    this.stage.clearCache();
    this.stage.clear();
    this.clean();
    this.stage.destroy();
  }
});

KonvaLazyLayer.prototype = Utils.merge(KonvaLazyLayer.prototype, require('./leaflet_layer_konva.editor'));

module.exports = KonvaLazyLayer;
