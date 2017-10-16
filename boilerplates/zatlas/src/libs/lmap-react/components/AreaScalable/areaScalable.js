/*
jquery leaflet
 */
var L = require('lmap/leaflet');

var Utils = require('lmap/core/utils');
var Event = require('bcore/event');
var _ = require('lodash');


function AreasScalable(options) {
  this.options = Utils.deepMerge(AreasScalable.options, options);
  this.childrenObject = {};
}

const parseProperties = (p) => ({
  '地名': (p.parent_name || '') + ' ' + p.name,
  '层级': p.level,
  '面积': p.areas.toFixed(2) + (p.unit || ''),
  '人口': p.count || 0,
})

const parseStyle = (style, d) => {
  const newStyle = {};
  _.forEach(style, (v, k) => {
    newStyle[k] = Utils.switchValue(v, d);
  });
  return newStyle;
};

AreasScalable.options = {
  isAutoLoad: true,
  autoPan: true,
  isAutoFitBounds: true,
  id: d => d.id || d.region_id,
  popup: (d) => ({}),
  popupEvent: 'hover',
  current: {
    normal: {
      fillColor: 'transparent',
      color: '#999',
      weight: 2,
      opacity: 1,
      dashArray: null
    },
    mouseover: {
      color: '#099',
      fillColor: '#099'
    }
  },
  children: {
    normal: {
      color: '#999',
      fillColor: 'transparent',
      weight: 1,
      opacity: 1,
      dashArray: '1,6'
    },
    mouseover: {
      color: '#099',
      fillColor: '#099',
      dashArray: null,
    }
  },
  geoidDefault: '100000'
};

AreasScalable = Event.extend(AreasScalable, {
  addTo: function (map) {
    this._map = map;
    //
    // if(this.options.isAutoLoad) this.add(this.options.geoidDefault);
  },
  addId: function(id){
    // if(this.curId !== id){
      this.clean();
      this.curId = id;
      return true;
    // }
    // return false;
  },
  addByName: function (name) {
    var infos = this.options.infos;
    var adcode = infos[name].adcode;
  },
  // add: function (adcode, isSelectChild) {
  //   if (adcode === this.adcode) return;
  //   this.clean();
  //   if(isSelectChild === false) return;
  //   this.addChildren(adcode);
  // },
  clean: function () {
    // clearTimeout(this.timeoutid);
    // this.timeoutid = setTimeout(() => {
      this.cleanChild();
      this.cleanParent();
      this.emit('clean');
    // });
  },
  cleanChild: function(){
    if (!this.children) return;
    this._map.removeLayer(this.children);
    this.children = null;
    this._geojsonChildren = null;
    this.emit('clean-children');
  },
  cleanParent: function(){
    if (!this.current) return;
    this._map.removeLayer(this.current);
    this.current = null;
    this._geojson = null;
    this.emit('clean-parent');
  },
  renderChildren: function(geojson) {
    // geojson = JSON.parse(JSON.stringify(geojson))
    geojson = this._geojsonChildren = _.cloneDeep(geojson);
    const map = this._map
    const options = this.options
    const cOpt = options.children
    this.children = this.geojsonChildren = L.geoJson(geojson, {
      style: parseStyle(cOpt.normal),
      autoPan: options.autoPan,
      onEachFeature: (feature, layer) => {
        let id = feature.properties.region_id;
        const styleNormal = parseStyle(cOpt.normal);
        layer.setStyle(styleNormal);
        layer.__styleNormal = styleNormal;
        //
        layer.__styleMouseover = parseStyle(cOpt.mouseover);
        //
        this.childrenObject[id] = layer;

        let d = parseProperties(feature.properties)
        var html = Utils.parseContent(d)
        var info = this.getGeojsonInfo(feature);
        layer._popupHtml = html;
        layer._popupTop = info.top;
        layer.__current = info.current;
        this.initEventsFeature(feature, layer, 'children');
    }}).addTo(map);
    this.emit('child_load', geojson);
  },
  renderCurrent: function(geojson) {
    // if (_.isEqual(this._geojson, geojson)) return;
    geojson = this._geojson = _.cloneDeep(geojson);
    var options = this.options;
    var map = this._map;
    var bOpt = options.current;
    let current
    var geojsonLayer = this.current = L.geoJson(geojson, {
      style: bOpt.normal,
      autoPan: options.autoPan,
      onEachFeature: (feature, layer) => {
        let properties = feature.properties;
        let d = parseProperties(properties);
        let regionId = properties.region_id;
        let isRender = this.addId(regionId);
        if(!isRender) return;
        var html = Utils.parseContent(d);
        let info = this.getGeojsonInfo(feature);
        layer._popupHtml = html;
        layer._popupTop = info.top;
        current = layer.__current = info.current;
        this.initEventsFeature(feature, layer, 'current');
      }
    }).addTo(map);

    if (options.isAutoFitBounds && current) {
      const latMax = current._northEast.lat;
      const lngMax = current._northEast.lng;
      const latMin = current._southWest.lat;
      const lngMin = current._southWest.lng;
      if (this.latMax === latMax && lngMax === this.lngMax && latMin === this.latMin && lngMin === this.lngMin) return;
      this.latMax = latMax;
      this.lngMax = lngMax;
      this.latMin = latMin;
      this.lngMin = lngMin;
      setTimeout(function() {
        clearTimeout(this.fitBoundId);
        this.fitBoundId = setTimeout(() => {
          map.fitBounds(current);
        })
      });
    }
    this.emit('current_load', geojson);
  },
  renderData: function(ds){
    if(!ds || !ds.length) return;
    const {options, childrenObject} = this;
    const getId = options.id;
    const cOpt = options.children;
    ds.forEach((d, k) => {
      const id = getId(d);
      const layer = childrenObject[id];
      if(!layer) return;
      const styleNormal = parseStyle(cOpt.normal, d);
      layer.setStyle(styleNormal);
      layer.__styleNormal = styleNormal;
      layer.__styleMouseover = parseStyle(cOpt.mouseover, d);
      let html = Utils.parseContent(options.popup(layer, d));
      layer._popupHtml = html;
    });
  },
  updateOptions: function(options){
    this.options = Utils.deepMerge(this.options, options);
  },
  getGeojsonInfo: function (geojson) {//获取geojson中 纬度最高的点
    var bbox = Utils.getBBox(geojson);
    var pt = Utils.getTopPoint(geojson);
    return {
      current: L.latLngBounds(
        [bbox.latMin, bbox.lngMin], [bbox.latMax, bbox.lngMax]
      ),
      top: L.latLng(pt[1], pt[0])
    };
  },
  getAdcode: function(){
    return this.adcode;
  },
  getParentId: function(){
    var d = this._geojson;
    if(!d) return;
    var features = d.features;
    var properties = features[0].properties;
    return properties.parent_id;
  },
  destroy: function(){
    if(this.geojsonChildren) this._map.remove(this.geojsonChildren);
    if(this.current) this._map.remove(this.current);
  },
  initEventsFeature: function (feature, layer, type) {
    var options = this.options;
    var sOpt = options[type];
    var self = this;
    var map = this._map;

    if (options.childEvent == 'dblclick') {
      let isDoubleClick = false;
      let lastClick = 0;
      let clickHandle = function() {
        if (!isDoubleClick) {
          self.emit('change-active', feature.properties);
        } else {
          isDoubleClick = false;
        }
      }
      let doubleHandle = function() {
        self.emit('child-click', {
          data: feature,
          layer: layer
        });
        if(options.popupEvent === 'dblclick') map.openPopup(layer._popupHtml, layer._popupTop, {
          autoPan: false
        });
      }
      layer
      .on('click', function () {
        let now = Date.now();
        if (now - lastClick < 500) {
          doubleHandle();
          isDoubleClick = true;
        } else {
          setTimeout(clickHandle, 500);
        }
        lastClick = now;
      })
    } else {
      layer
      .on('click', function () {
        self.emit('child-click', {
          data: feature,
          layer: layer
        });
        if(options.popupEvent === 'click') map.openPopup(layer._popupHtml, layer._popupTop, {
          autoPan: false
        });
      })
    }

    layer
    .on('mouseover', function () {
      layer.setStyle(sOpt.__styleMouseover);
      if(options.popupEvent === 'hover') map.openPopup(layer._popupHtml, layer._popupTop, {
        autoPan: false
      });
    })
    .on('mouseout', function () {
      layer.setStyle(sOpt.__styleNormal);
      if(options.popupEvent === 'hover') map.closePopup();
    });
  }
});

module.exports = AreasScalable;
