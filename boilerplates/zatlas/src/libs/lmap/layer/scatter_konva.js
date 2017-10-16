/**
* @Author: disoul
* @Date:   2016-10-30T00:31:32+08:00
* @Last modified by:   disoul
* @Last modified time: 2016-11-12T01:27:38+08:00
*/


const L = require('./../leaflet');
const K = require('konva');
const _ = require('lodash');
const Event = require('bcore/event');

const KLeafLayer = require('./../render/leaflet_layer_konva');

const Utils = require('./../core/utils');
const {getSprite, fireEvent, getValue} = Utils;

/**
 * @class ScatterKonva
 */
class ScatterKonva extends Event  {
  constructor(options){
    super();
    options = this.options = Utils.deepMerge(ScatterKonva.options, options);
    this.resetVariables();
  }
  resetVariables() {
    this.enable();
  }
  disable() {
    this.isable = false;
    if(this.kLeafLayer) this.kLeafLayer.disable();
  }
  enable() {
    this.isable = true;
    if(this.kLeafLayer) this.kLeafLayer.enable();
  }
  addTo(map) {
    if (this._map || !map) return;
    this._map = map;
    this.initKonva();
    this.initEventsMap();
    this.initEventsShapes();
  }
  initEventsShapes() {
    var self = this;
    const {options} = this;
    var hoverScale = options.hoverScale || 1;
    //
    var shape;
    var kLeafLayer = this.kLeafLayer
      .onKonva('dragstart', function(e) {
      })
      .onKonva('mouseover touchstart', function(e) {
        shape = e.target;
        shape.setAttrs({
          scale: {
            x: hoverScale,
            y: hoverScale
          },
          fill: options.hoverColor || 'transparent'
        });
        shape.parent.draw();
      })
      .onKonva('mouseout', function(e) {
        shape = e.target;
        shape.setAttrs({
          scale: {
            x: 1,
            y: 1
          },
          fill: 'transparent'
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
      var events = ['mouseout', 'mousedown', 'mouseover', 'mouseout', 'touchstart', 'touchend', 'touchup', 'click'];
      events.forEach(event => {
        kLeafLayer.onKonva(event, e => {
          const id = e.target.__id;
          const data = e.target.__data;
          this.emit(`child-${event}`, {id, data});
        });
      });
  }
  onMouseDown(e) {
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
        var bbox = shape.getClientRect();
        var x = bbox.x + bbox.width / 2,
        y = bbox.y + bbox.height / 2 / (options.hoverScale || 1);
        var latlng = map.containerPointToLatLng(L.point(x, y));
         map.openPopup(popupText, L.latLng(latlng.lat, latlng.lng));
      } else {
      }
    }.bind(this), 100);

    this.kLeafLayer.disableMapEvents();
  }

  initKonva() {
    var map = this._map;
    var options = this.options;
    //
    var size = map.getSize();
    var konvaContainer = this.konvaContainer = Utils.createContainer(options.container);
    this.container = konvaContainer;
    this.kStage = new K.Stage({
      container: konvaContainer, //'.leaflet-tile-pane'
      width: size.x,
      height: size.y,
    });
    //
    var kLeafLayer = this.kLeafLayer = new KLeafLayer(this.kStage, {
      transition: options.lazyFresh.transition,
      blending: options.blending,
      ptNPerLayer: options.ptNPerLayer
    });
    kLeafLayer.addTo(map);
    this.initEditor();
  }

  /**
   * data 传入可视化数据
   * @param  {Object} _data 需要可视化的数据
   * @param  {Object} opt      配置参数
   */
  data(data) {
    this._data = data;
    this.updateDataZindex();
  }
  updateDataZindex(){
     var options = this.options;
     var zIndex = options.zIndex || options.child.zIndex;
    if (zIndex) this._data = _.sortBy(this._data, zIndex);
  }
  updateOptions (options) {
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
  }
  updateFilter (filter) {
    if (!filter || typeof (filter) !== 'function') return;
    this.options.filter = filter;
    this.draw();
  }
  render(data) {
    if (this._data) {
      this.first = false;
    } else {
      this.first = true;
    }
    if (data) this.data(data);
    data = this._data;
    if(!this.kLeafLayer) return;
    if (data) this.kLeafLayer.beginDraw();
    this.draw();
    if (data) this.kLeafLayer.endDraw();
  }
  createShapeAttr(d, i) {
    if (!this.isable) return;
    var options = this.options;
    var getLat = options.lat.bind(options);
    var getLng = options.lng.bind(options);
    //
    var size = getValue(options.size, d) || 1; //至少有1像素的显示
    //
    var lat = getLat(d),
      lng = getLng(d);
    var id = getValue(options.id.bind(options), d, i) || lat + '' + lng;
    if (!lat || !lng) return null;
    var pt = this._map.latLngToContainerPoint(L.latLng(lat, lng));
    sprite = options.sprite || options.child.sprite;
    var sprite = Utils.switchValue(sprite, d);
    sprite = Utils.getSprite(sprite);
    return {
      data: d,
      Constructor: K.Image,
      index: i,
      id: id,
      attrs: {
        x: pt.x,
        y: pt.y,
        offset: {
          x: size / 2,
          y: size / 2
        },
        image: getSprite(sprite, d),
        width: size,
        height: size,
        draggable: false,
        scaleX: 1.2,
        scaleY: 1.2,
      }
    };
  }
  draw () {
    if (this.options.hidden) {
      this.clean();
      return;
    }

    var ds = this._data;
    if (!ds) return;
    if (!this.isable) return;
    const size = this._map.getSize();
    this.kStage.width(size.x);
    this.kStage.height(size.y);
    var d, shapeOptions;
    var kLeafLayer = this.kLeafLayer;
    var filter = this.options.filter;
    for (var i = ds.length - 1; i > -1; i--) {
      d = ds[i];
      //
      if(filter && !filter(d, i)) continue;
      //

      shapeOptions = this.createShapeAttr(d, i);
      if (shapeOptions) kLeafLayer.addOrSetShape(shapeOptions);
    }

    kLeafLayer.stopLazyFresh();
    kLeafLayer.lazyFresh();
  }

  /**
   * initEventsMap 和地图移动绑定的事件
   */
  initEventsMap() {
    this._map
      .on('zoomend', this.draw.bind(this))
      .on('moveend', this.draw.bind(this));
  }
  /**
   * destroy  销毁canvas
   */
  destroy() {
    this.kLeafLayer.destroy();
    this.konvaContainer.remove();
  }
  

  clean(){
    this.kLeafLayer.clean();
  }

  ///////////////// editor /////////////////

  initEditor() {
    this.eidtList = [];
    this.kLeafLayer.initEditor();
    this.initEventEditor();
  }
  enableEditor() {
    this.kLeafLayer.enableEditor();
  }
  disableEditor() {
    this.kLeafLayer.disableEditor();
  }
  initEventEditor() {
    this.kLeafLayer.on('shape-dragged', (object) => {
      this.onShapeDragged(object.shape);
    });
  }
  onShapeDragged(shape) {
    var bbox = shape.getClientRect();
    var x = bbox.x + bbox.width / 2,
      y = bbox.y + bbox.height / 2;
    var latlng = this._map.containerPointToLatLng(L.point(x, y));
    //
    var options = this.options;
    var setLatLng = options.editor.setLatLng;
    if (!setLatLng) return console.log('请设置options.editor.setLatLng');
    //
    var data = shape.__data;
    setLatLng(latlng, data);
    this.kLeafLayer.addOrSetShape(data, null, true);
    //
    this.eidtList.push(data);
    this.fire('data-edited', data);
  }
  isEdited() {
    return (this.eidtList.length > 0);
  }
  submitEdit() {
    var options = this.options;
    var eidtList = this.eidtList;
  }
};

ScatterKonva.options = {
  //lng: Utils.getLng,
  //lat: Utils.getLat,
  zIndex: null,
  refreshInterval: 1,
  ptNPerLayer: 1000,
  lazyFresh: {
    transition: 'opacity 0.4s'
  },
  size: function (d) {
    return 40;
  },
  id: function (d, i) {
    return d.id || i;
  },
  // onPopupOpen: function(d, popup){
  // },
  hoverScale: 1.2,
  blending: 'lighter',
  container: '.leaflet-overlay-pane',
  sprite: {
    drawN: 1.15,
    color: {
      from: 'rgba(245,230,0,1)',
      to: 'rgba(205,0,0, 0.6)',
      easing: 'Linear.None.1.7',
      space: 'rgb'
    }
  },
  child: {
    // popup: function(){return d.value;}
  },
  editor: {
    setLatLng: function (latLng, d) {
      if (!d) return;
      d.lat = latLng.lat;
      d.lng = latLng.lng;
    }
  }
};

var dmap = L.dmap = L.dmap || {};

dmap.ScatterKonva = ScatterKonva;
dmap.scatterKonva = function(options) {
  return new ScatterKonva(options);
};

module.exports = ScatterKonva;
