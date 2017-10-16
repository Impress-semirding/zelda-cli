var L = require('leaflet');
L.Map = L.Map.extend({
  options: {
    scaleX: 1,
    scaleY: 1
  },
  initialize: function(id, options) {
    options = L.setOptions(this, options);
    this._initContainer(id);
    this._initLayout();
    // hack for https://github.com/Leaflet/Leaflet/issues/1980
    this._onResize = L.bind(this._onResize, this);
    this._initEvents();
    if (options.maxBounds) {
      this.setMaxBounds(options.maxBounds);
    }
    if (options.center && options.zoom !== undefined) {
      this.setView(L.latLng(options.center), options.zoom, { reset: true });
    }
    this._handlers = [];
    this._layers = {};
    this._zoomBoundLayers = {};
    this._tileLayersNum = 0;
    this.callInitHooks();
    this._addLayers(options.layers);
    this._setScale(this.options.scaleX, this.options.scaleY);
  },
  _setScale: function(scaleX, scaleY) {
    L.DomEvent.getMousePosition = function(e, container) {
      if (!container) {
        return new L.Point(e.clientX, e.clientY);
      }
      var rect = container.getBoundingClientRect();
      return new L.Point(
        (e.clientX - rect.left - container.clientLeft) / scaleX,
        (e.clientY - rect.top - container.clientTop) / scaleY);
    }
  }
});
