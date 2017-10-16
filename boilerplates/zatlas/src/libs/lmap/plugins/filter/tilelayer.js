
var Event = require('bcore/event');
var Utils = require('bcore/utils');
var L = require('./../../leaflet');
var _ = require('lodash');

L.dmap = L.dmap || {};


function Filter(tilelayer, options) {
  this.tilelayer = tilelayer;
  this.container = tilelayer._container;
  this._map = tilelayer._map;
  var self = this;
  tilelayer._filter = self;
  options = this.options = Utils.deepMerge(Filter.options, options);
  this.updateStyle();
}

Filter.options = {
  'hueRotate': 0,
  'saturate': 100,
  'contrast': 100,
  'brightness': 100,
  'grayscale': 0,
  'opacity': 1,
  'anim': 0,
  'blur': 0,
  'sepia': 0,
  'invert': 0
};

Filter = Event.extend(Filter, {
  initEvents: function (tilelayer) {
    // tilelayer.on('tileload', this.updateStyle.bind(this));
  },
  updateOptions: function (options) {
    options = this.options = Utils.deepMerge(this.options, options);
    this.updateStyle();
  },
  updateStyle: function () {
    const {container, options} = this;
    const {opacity} = options;
    const anim = `all ${options.anim}s`;

    const filterStr = [
    `sepia(${options.sepia}%)`,
    `saturate(${options.saturate}%)`,
    `grayscale(${options.grayscale}%)`,
    `hue-rotate(${options.hueRotate}deg)`,
    `contrast(${options.contrast}%)`,
    `brightness(${options.brightness}%)`,
    `blur(${options.blur}px)`,
    `invert(${options.invert}%)`,
    ].join(' ');
    
    //
    const style = {
      'webkitFilter': filterStr,
      'filter': filterStr,
      'transition': anim,
      'webkitTransition': anim,
      'opacity': opacity
    };
    //应用样式
    const cStyle = container.style;
    _.forEach(style, (v, k) => {
      if(cStyle[k] !== v) cStyle[k] = v
    });
  },
  cleanStyle: function () {
    this.options = Utils.deepMerge(this.options, Filter.options);
    this.updateStyle();
  },
  getStyle: function(){
    return this.options;
  }
});


L.dmap.Filter = Filter;
L.dmap.filter = function (tilelayer, options){
  return new Filter(tilelayer, options);
};

module.exports = Filter;
