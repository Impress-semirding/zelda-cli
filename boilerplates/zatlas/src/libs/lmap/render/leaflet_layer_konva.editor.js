var Event = require('bcore/event');
var Utils = require('bcore/utils');
var L = require('./../leaflet');
var K = require('konva');
//
module.exports = {
  initEditor: function () {
    var layer = this.editorLayer = new K.Layer({
      'z-index': 10000000
    });
    this.stage.add(layer);
  },
  enableEditor: function () {
    var shapes = this.shapes;
    for (var i in shapes) {
      shapes[i].setAttrs({
        draggable: true
      });
    }
    this.initEventEditor();
  },
  disableEditor: function () {
    var shapes = this.shapes;
    for (var i in shapes) {
      shapes[i].setAttrs({
        draggable: false
      });
    }
    this.offEventEditor();
  },
  handlerDrag: function (e) {
    this.disableMapEvents(e);
    this.isDraging = true;
    var startLayer;
    var dragLayer = this.editorLayer;
    //
    var shape = e.target;
    if (shape) {
      startLayer = shape.getLayer();
      this.shapeActive = shape;
      shape.__startLayer = startLayer;
      shape.moveTo(dragLayer);
      startLayer.draw();
      dragLayer.draw();
      shape.startDrag();
    }
  },
  handlerDrop: function(e) {
    this.isDraging = false;
    setTimeout(this.enableMapEvents.bind(this));
    //
    var dragLayer = this.editorLayer;
    var shape = e.target;
    if (!shape.__startLayer) shape = this.shapeActive;
    if (shape) {
      var startLayer = shape.__startLayer;
      if (!startLayer) return console.log('drag-error');
      shape.moveTo(startLayer);
      delete shape.__startLayer;
      this.emit('shape-dragged', {
        shape: shape
      });
      dragLayer.draw();
      startLayer.draw();
      this.shapeActive = null;
    }
  },
  handlerDragging: function(e) {
    if (!this.isDraging) return;
    this._map.closePopup();
  },
  initEventEditor: function () {
    this.stage
      .on('mousedown.handlerDrag', this.handlerDrag.bind(this))
      .on('mouseup.handlerDrop', this.handlerDrop.bind(this))
      .on('dragmove.handlerDragging', this.handlerDragging.bind(this));
  },
  offEventEditor: function () {
    this.stage
      .off('mousedown.handlerDrag', this.handlerDrag.bind(this))
      .off('mouseup.handlerDrop', this.handlerDrop.bind(this))
      .off('dragmove.handlerDragging', this.handlerDragging.bind(this));
  }
};