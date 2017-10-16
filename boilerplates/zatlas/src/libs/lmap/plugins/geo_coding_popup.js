const L     = require('./../leaflet');
const Utils = require('bcore/utils');
const Event = require('bcore/event');
const $     = require('jquery');
const dmap  = L.dmap = L.dmap || {};

/**
 * @class GeoCodingSearch
 */

class GeoCodingSearch extends Event{
  constructor(map, options){
   super();
   this.addTo(map);
   options = this.options = Utils.deepMerge(GeoCodingSearch.options, options);
   //
   this.reset();
   this.initEventsMap(map);
  }
  addTo(map){
    if(map) this._map = map
  }
  reset(){
    this.isable = true;
  }
  initEventsMap(map) {
    let {search, text, eventType} = this.options;
    //移动端单击触屏 PC端双击
    if (eventType === 'auto') eventType = L.Browser.mobile ? 'touchstart' : 'dblclick';
    //
    const hook = e => {
      if(this.isable){
        const latlng = this.getLatlng(e);
        const popup  = L.popup().setLatLng(latlng).setContent('正在查询位置...').openOn(map);
        search(latlng, (d) => {
          popup.setContent(text(d));
        });
      }
    };
    L.DomEvent.on(map._container, eventType, hook, this);
  }
  enable(){
    this.isable = true;
  }
  disable(){
    this.isable = false;
  }
  getLatlng(e){
    const p = L.Browser.mobile ? e.touches[0]: e;
    const map = this._map;
    const containerPoint = map.mouseEventToContainerPoint(p);
    var layerPoint = map.containerPointToLayerPoint(containerPoint);
    return map.layerPointToLatLng(layerPoint);
  }
}

GeoCodingSearch.options = {
  'eventType': 'auto', // auto / click
  'search': (latlng, cb) => {
    const url = 'http://restapi.amap.com/v3/geocode/regeo?location=' + latlng.lng + ',' + latlng.lat + '&key=767b3f050b17f8c713e3835b18f57ff9&callback=a';
    $.ajax({
      url: url,
      dataType: 'jsonp',
      jsonpCallback: 'a',
      success: (d) => {
        if (!d || !d.regeocode) return;
        const {regeocode} = d;
        if (!regeocode) return;
        const {formatted_address, addressComponent} = regeocode;
        if (!addressComponent) return;
        addressComponent.formatted_address = formatted_address;
        if (addressComponent.length === 0) return null;
        cb && cb(addressComponent);
      }
    });
  },
  'text': d => {
    const o = d.formatted_address;
    if (o.length === 0) return '无结果...'
    return o;
  }
  // d =>  ['province', 'city', 'district', 'township']
  //                 .map(k => d[k])
  //                 .filter(t => t && t.length)
  //                 .join(' | ')
};

dmap.GeoCodingSearch = GeoCodingSearch;
dmap.geoCodingSearch = function(map, options) {
  return new GeoCodingSearch(map, options);
};

module.exports = GeoCodingSearch;
