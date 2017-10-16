'use strict';

/**
 * @class HeatmapGeohashGrid
 */
 
const K = require('konva');
const _  = require('lodash');
const L = require('./../leaflet');
const Event = require('bcore/event');
const Utils = require('./../core/utils');
const KLeafLayer = require('./../render/leaflet_layer_konva');
const ngeohash = require('ngeohash');
// var getColorFunc = Utils.getColorFunc;

/**
 * HeatmapGeohashGrid 生成geohash网格型点图
 * @param  {Object} d [description]
 * @return {[type]}   [description]
 */
 class HeatmapGeohashGrid extends Event {
    constructor(options){
      super();
      this.options = Utils.deepMerge(HeatmapGeohashGrid.options, options);
      this.isable = options.isable === false ? false : true;
    }
    enable(){
      this.isable = true;
      if (this.kLeafLayer) this.kLeafLayer.enable();
    }
    disable(){
      this.isable = false;
      if (this.kLeafLayer) this.kLeafLayer.disable();
    }
    addTo(map){
      this._map = map;
      this.initKonva();
      this.initEventsMap();
    }
    render(ds){
      if (ds) {
        this.data(ds);
        this.clean();
      }
      this.draw();
    }
    initKonva() {
      const map = this._map;
      if (!map) return;
      const {options} = this;
      //
      const size = map.getSize();
      const konvaContainer = this.konvaContainer = Utils.createContainer(options.container);
      const stage = new K.Stage({
        container: konvaContainer, //'.leaflet-tile-pane'
        width: size.x,
        height: size.y
      });
      //
      const kLeafLayer = this.kLeafLayer = new KLeafLayer(stage, {
        transition: options.lazyFresh.transition,
        shapeNPerLayer: options.shapeNPerLayer
      });
      kLeafLayer.addTo(map);
      this.initEventsShapes();
    }

    draw () {
      const ds = this._data;
      if (!ds || !this.isable) return;
      const {options, kLeafLayer} = this;
      let shapeOptions, shape;
      _.forEach(ds, (d, i) => {
        shapeOptions = this.createShapeAttr(d, i);
        kLeafLayer.addOrSetShape(shapeOptions);
      });
      kLeafLayer.stopLazyFresh();
      kLeafLayer.lazyFresh();
    }

    createShapeAttr(d, i){
      if (!this.isable) return;
      const {options} = this;
      const pts = [];
      d.__latlngs.forEach((d) => {
        const pt = this._map.latLngToContainerPoint(L.latLng(d[1], d[0]));
        pts.push(pt.x, pt.y);
      });

      return {
        data: d,
        Constructor: K.Line,
        index: i,
        id: Utils.switchValue(options.id, d),
        attrs: {
          points: pts,
          fill: Utils.switchValue(options.fill, d),
          stroke: Utils.switchValue(options.stroke, d),
          strokeWidth:  Utils.switchValue(options.weight, d),
          closed: true,
        }
      };
    }

    initEventsMap () {
      this._map
      .on('moveend', () => this.draw())
      .on('zoomend', () => this.draw());
    }

    initEventsShapes(){
      const {options} = this;
      let shape;
      const kLeafLayer = this.kLeafLayer
        .onKonva('dragstart', function(e) {
        })
        .onKonva('mouseover touchstart', function(e) {
          shape = e.target;
          shape.setAttrs({
            fill: Utils.switchValue(options.hoverColor || 'transparent', '')
          });
          shape.parent.draw();
        })
        .onKonva('mouseout', function(e) {
          shape = e.target;
          shape.setAttrs(shape.__attr);
          shape.parent.draw();
        })
        .onKonva('mouseout mouseup touchend', e => setTimeout(() => kLeafLayer.enableMapEvents()))
        .onKonva('mousedown touchstart', this.onMouseDown.bind(this));
        //
        Utils.EVENTS.forEach(event => {
          kLeafLayer.onKonva(event, e => {
            const id = e.target.__id;
            const data = e.target.__data;
            this.emit(`child-${event}`, {id, data});
          });
        });
    }

    onMouseDown(e){
      const {options} = this;
      const map = this._map;
      let {popup} = options;
      const shape = e.target;
      if (popup) popup = popup.bind(options);
      if (!popup) {
        if(!options.child) return;
        popup = options.child.popup;
        if (popup) popup = popup.bind(options.child);
      }
      if (!popup) return;
      const popupText = popup(shape.__data);
      setTimeout(() => {
        if (!shape) return;
        const bbox = shape.getClientRect();
        const latlng = map.containerPointToLatLng(L.point(bbox.x + bbox.width / 2, bbox.y));
        map.openPopup(popupText, L.latLng(latlng.lat, latlng.lng));
      }, 100);
      this.kLeafLayer.disableMapEvents();
    }

    data(ds){
      this._data = ds;
      this.processing();
    }

    updateOptions(options){
      this.options = Utils.deepMerge(this.options, options);
      this.draw();
    }

    processing(){
      const {options} = this;
      const getGeohash = options.geohash;
      let geohash, p, error, latlngs, latmin, lngmin, latmax, lngmax, p1, p2, p3, p4;
      _.forEach(this._data, (d, k) => {
        geohash = getGeohash(d, k);
        p = ngeohash.decode_bbox(geohash);
        latmin = p[0];
        lngmin = p[1];
        latmax = p[2];
        lngmax = p[3];
        p1 = [lngmin, latmin];
        p2 = [lngmin, latmax];
        p3 = [lngmax, latmax];
        p4 = [lngmax, latmin];
        latlngs = [p1, p2, p3, p4, p1];
        d.__latlngs = latlngs;
      });
      this.updateRange();
    }

    updateRange(){
      this.range = Utils.getRangePercentTile(this._data, this.options.value);
    }

    clean(){
      this.kLeafLayer.clean();
    }

    destroy(){
      this.kLeafLayer.destroy();
      this.konvaContainer.remove();
    }
 };

 HeatmapGeohashGrid.options = {
  container: '.leaflet-overlay-pane',
  fill: '#099',
  weight: 1,
  value: d => d.count,
  stroke: 'rgba(255,255,255,0.2)',
  hoverColor: '#0ff',
  geohash: d => d.geohash,
  id: d => d.geohash,
  isable: true,
  shapeNPerLayer: 1000,
  popup: d => d.geohash,
  lazyFresh: {
    transition: 'opacity 0.4s'
  },
 };

 const dmap = L.dmap = L.dmap || {};
 dmap.HeatmapGeohashGrid = HeatmapGeohashGrid;
 dmap.heatmapGeohashGrid = function (options) {
   return HeatmapGeohashGrid(options);
 };

 module.exports = HeatmapGeohashGrid;

