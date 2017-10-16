var Utils = require('bcore/utils');
//
function Model(options){
  options = this.options =Utils.deepMerge(Model.options, options);
  this.geojsons = {};
  this.get();
}

Model.options = {
  storageKey: 'draw-geojsons'
};

Model.prototype = {
  set: function(geojson, id){
    this.geojsons[id] = geojson;
    this.save();
  },
  save: function(){
    var dataStr = JSON.stringify(this.geojsons);
    if (dataStr) window.localStorage.setItem(this.options.storageKey, dataStr);
  },
  get: function(){
    var dataStr = window.localStorage.getItem(this.options.storageKey);
    this.geojsons = dataStr ? JSON.parse(dataStr): {};
    return this.geojsons;
  },
  clean: function(){
    this.geojsons = {};
    window.localStorage.setItem(this.options.storageKey, '');
  }
};

module.exports = Model;