var L = require('./../leaflet');
var FlyingLineGradient = require('./flyingLineGradient');
var FlyingLineDash = require('./flyingLineDash');
var Event = require('bcore/event');
var Util = require('bcore/utils');
var dmap = L.dmap = L.dmap || {};

/**
 * @class FlyingLines
 */
function FlyingLines(options) {
  options = this.options = Util.deepMerge(FlyingLines.options, options);
}

FlyingLines.options = {
  lineN: 100,
  type: 'gradient', //gradient 或 dash
  flying: {
    lifeEnd: 'hide',
    lifeSpeed: 0.01,
    kHeight: 1.3,
    displayLine: {
      colorTo: 'rgba(250,150,50,1)',
      colorFrom: 'rgba(255,0,0,1)',
      colorNormal: 'rgba(250,250,250,0.1)'
    },
    interactiveLine: {
    }
  }
};


FlyingLines = Event.extend(FlyingLines, {
  isInit: false,
  isLive: true,
  life: 0,

  /**
   * addTo 将飞线图放入地图
   * @param {Object} map 地图对象
   */
  addTo: function(map) {
    this._map = map;
    this.isable = true;
    this.init();
    this.initEvents();
    return this;
  },

  /**
   * init 初始化
   */
  init: function () {
    var options = this.options;
    var lineN = options.lineN;
    var flyingOpt = options.flying;
    //
    var map = this._map;
    //
    var Visualizer = {
      gradient: FlyingLineGradient,
      dash: FlyingLineDash
    }[options.type];

    var unusing = this.unusing = [];
    this.using = [];
    var lines = this.lines = [];

    var line;
    for (var i = 0; i < lineN; i++) {
      line = new Visualizer(flyingOpt);
      line.addTo(map);
      this.initEventsLine(line);
      unusing.push(line);
      lines.push(line);
    }

    this.loop();
  },

  /**
   * data 灌入数据
   */
  data: function (data) { //灌入数据
    this._data = data;
  },

  render: function (data) {
    if (data) this.data(data);
    this.draw();
  },

  draw: function () {
    var ds = this._data;
    var d, flyingline, using = this.using, unusing = this.unusing;
    for (var i in ds) {
      d = ds[i];
      if (unusing.length && d) {
        flyingline = unusing.pop();
        flyingline.data(d);
        flyingline.resume();
        using.push(flyingline);
      }
    }
  },

  checkLine: function (line, i, using) {
    if (line.life <= line.options.lifeMax + line.options.range - line.options.lifeSpeed * 2) return;
    this.disableLine(line, i, using);
  },

  disableLine: function (line, i, using) {
    using.splice(i, 1);
    line.pause();
    line.hide();
    this.unusing.push(line);
  },

  disable: function(){
    this.isable = false;
  },
  enable: function(){
    this.isable = true;
  },

  initEventsLine: function (line) {
    var self = this;
    line
    .on('mouseover', function (data) {
      line.pause();
      self.emit('child-mouseover', data);
    })
    .on('mouseout', function (data) {
      line.resume();
      self.emit('child-mouseout', data);
    })
    .on('click', function (data) {
      self.emit('child-click', data);
    });
  },

  update: function () {
    this.updateLife();
  },

  updateOptions: function (options) {
    this.options = Util.deepMerge(this.options, options);
    this.each(function (line) {
      line.updateOptions(options.flying);
    });
  },

  initEvents: function () {
  },

  loop: function () {
    this.update();
    if(this.isable)window.requestAnimationFrame(this.loop.bind(this));
  },

  updateLife: function () {
    var using = this.using;
    var line;
    for (var i = using.length - 1; i >= 0; i--) {
      line = using[i];
      if (line.isLive) line._updateLife();
      this.checkLine(line, i, using);
    }
  },

  remove: function(){
    this.using = [], this.unusing = [];
    var map = this._map;
    this.lines.forEach(function(line){
      var displayPath = line.displayPath;
      if(displayPath){
        displayPath.destroy();
        // map.removeLayer(displayPath);
      } 
      var interactivePath = line.interactivePath;
      if(interactivePath){
        interactivePath.destroy();
        // map.removeLayer(interactivePath);
      } 
    });
    this.disable();
    this.lines = [];
    this._data = null;
  },

  each: function (fn) {
    return this.lines.forEach(fn);
  }
});


dmap.FlyingLines = FlyingLines;
dmap.flyingLine = function (options) {
  return new FlyingLines(options);
};

module.exports = FlyingLines;
