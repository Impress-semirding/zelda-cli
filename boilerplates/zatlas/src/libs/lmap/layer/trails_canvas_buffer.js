'use strict';

/**
 * @class HeatmapGrid
 */

var L = require('./../leaflet');
var Utils = require('./../core/utils');
var Canvas = require('./../render/canvas');
// var getSprite = Utils.getSprite;
// var switchValue = Utils.switchValue;
var Anim = require('./../core/animator');
var TrailCanvas = require('./trail_canvas_flying');
/**
 * @class TrailsCanvas 大量轨迹的绘制，基于canvas 包括2部分。 飞线(flying)部分， 看视窗内此刻的轨迹位置 背景线(bgLine)部分, 绘制视窗内所有的轨迹
 */

/**
 * TrailsCanvas 生成网格型点图
 * @param  {Object}  options
 */
function TrailsCanvas(options) {
  options = this.options = Utils.deepMerge(TrailsCanvas.options, options);
  this.initialize(options);
}

TrailsCanvas.options = {
  'lineN': 1000,
  'lifeSpeed': 1,
  'isAutoUpdate': true,
  'type': 'flying',
  'isable': true,
  'container': '#canvas',
  'id': function(d) {
    return d.id;
  },
  'id': Utils.getID,
  'lifeMin': 0,
  'lifeMax': 100000000000,
  'child': {
    'spriteFlying': { //飞线中间的部分
      'type': 'linear',
      'isContinue': true,
      'width': 200,
      'height': 20,
      'color': {
        'from': 'rgba(233,0,0,0.3)',
        'to': '#f2f7b8',
        'space': 'hsl',
        'easing': 'linear.Out.3'
      }
    },
    'spriteHead': {//飞线头部
      'type': 'radian',
      'isContinue': false,
      'width': 100,
      'height': 100,
      'color': {
        'to': 'rgba(255,150,0,0.4)',
        'from': 'rgba(255,150,0,0.4)',
        'space': 'hsl',
        'easing': 'linear.Out.1'
      }
    },
    'size':function(d, zoom){
      return 6;
    },
    'delay': 2,
    'lengthLimit': 60,
    'lineSegmentLonger': 0,
    'isAutoUpdate': false,
    'isable': true,
    'blending': 'lighter',
    'type': 'line',
    'ptsN': 25,
    'weight': function (d, percent) {
      return 5 * Math.pow(percent, 3);
    },
    'value': function (d, max, min) {
      return Math.min(1, d.length / 40);
    },
    'lng': Utils.getLng,
    'lat': Utils.getLat,
    'time': Utils.getTime,
    'pts': function (ds) {
      return ds.pts;
    },
  },
}
var TrailsCanvas = Anim.extend(TrailsCanvas, {
  events: {},
  initialize: function(options) {
    this.isable = true;
    //
    this.lifeMax = options.lifeMax;
    this.lifeMin = options.lifeMin;
    this.life = this.lifeMin;
    if (options.isAutoUpdate) this.initEventsAnim();
  },
  /**
   * initCanvas 生成可视化需要的各个图层
   */
  initCanvas: function () {
    var options = this.options;
    var trailOpt = options.child;
    var blending = trailOpt.blending || options.blending;
    //
    this.lcanvas = new Canvas(this._map, options.container, {
      'clearAlpha': 1
    });
    var ctx = this.ctx = this.lcanvas.ctx;
    ctx.globalCompositeOperation = blending;
    trailOpt.ctx = ctx;
  },

  addTo: function(map) {
    if (this._map || !map) return;
    this._map = map;
    this.initCanvas();
    this.initTrails();
    this.initEventsMap();
    if (this._data) this.updateZoom();
  },

  clear: function() {
    var using = this.using;
    var unusing = this.unusing;
    var flyingline;
    for (var i in using) {
      flyingline = using[i];
      flyingline.reset();
    }
    this.using = {};
    unusing = [];
    var trails = this.trails;
    for (var j in trails) {
      unusing.push(trails[j]);
    }
    this.unusing = unusing;
  },
  reset: function() {
    var unusing = this.unusing = [];
    this.using = {};
    //
    var trails = this.trails;
    for (var i in trails) {
      var trail = trails[i];
      trail.stop && trail.stop();
      trail.pause && trail.pause();
      trail.resetVariables();
    }
    this.life = this.options.lifeMin;
    //
    var trails = this.trails;
    for (var j in trails) {
      unusing.push(trails[j]);
    }
    this.resume();
  },

  initCacheColor: function() {},

  mergeData: function(ds) {
    var options = this.options;
    var getID = options.id.bind(options);
    var d = ds.d,
      id;
    var datas = this._data = this._data || {};
    for (var i = 0; i < ds.length; i++) {
      d = ds[i];
      id = getID(d);
      if (datas[id]) {
        datas[id].pts.push(d);
      } else {
        datas[id] = {
          pts: [d],
          id: id
        };
      }
    }
    this.resetOrUpdateTrails();
    if (this.options.isAutoUpdate && this._map && !this.loopid) this.startAnim();
  },

  /**
   * data 灌入数据
   * @param  {Object} data 带有经纬度的原始数据
   */
  data: function(ds) {
    if (!ds) return this._data;
    var unusing = this.unusing,
      using = this.using;
    if (!unusing || !unusing.length) return;
    var trail = unusing.pop();
    //
    var options = this.options;
    var getPts = options.child.pts;
    var pts = getPts(ds);
    trail.updateOptions({
      lifeMin: 0,
      lifeMax: pts.length
    });
    trail.data(ds);
    //
    using[trail.id] = trail;
    if (this.options.isAutoUpdate && this._map && !this.loopid) this.startAnim();
  },
  resetOrUpdateTrails: function() {
    var datas = this._data;
    var using = this.using,
      unusing = this.unusing;
    //
    var options = this.options;
    var getPts = options.child.pts.bind(options.child);
    var d, trail, pts;
    for (var id in datas) {
      d = datas[id];
      trail = using[id];
      pts = getPts(d);
      if (trail) {
        trail.processing(); ///////////////////////////////////////////////////// TODO
        // trail.updateOptions({
        //   lifeMin: 0,
        //   lifeMax: pts.length
        // });
      } else {
        trail = unusing.pop();
        // trail.updateOptions({
        //   lifeMin: 0,
        //   lifeMax: pts.length
        // });
        if (pts && pts.length > 3) {
          trail.data(d);
          trail.id = id;
          using[id] = trail;
        }
      }
    }
    // for()
  },
  datas: function (ds) {
    if (!ds) return this._data;
    this._data = ds;
    for (var i in ds) {
      this.data(ds[i]);
    }
  },
  /**
   * initTrails 初始化所有的轨迹
   */
  initTrails: function() {
    var options = this.options;
    var trailOpt = options.child;
    trailOpt.lifeSpeed = options.lifeSpeed;
    trailOpt.isable = options.isable;
    trailOpt.container = options.container;

    this.using = {};
    var unusing = this.unusing = [];
    //
    var map = this._map;
    var trails = this.trails = [];
    var lineN = options.lineN;
    var trail;
    for (var i = 0; i < lineN; i++) {
      trail = new TrailCanvas(trailOpt);
      trail.addTo(map);
      this.initEventsTrail(trail);
      trails.push(trail);
      unusing.push(trail);
    }
  },

  each: function(processing) {
    var using = this.using;
    for (var id in using) {
      processing(using[id], id);
    }
  },


  checkTrail: function(line) {
    if (!line.isEnd()) return;
    var using = this.using;
    var bol = false;
    for (var i in using) {
      if (using[i].equalTo(line)) {
        bol = true;
        delete using[i];
        break;
      }
    }
    if (bol) this.unusing.push(line);
  },

  initEventsTrail: function(line) {
    var self = this;
    line
      .on('lifeEnd', function(e) {
        self.emit('flying-end', line._data);
      });
  },

  updateOptions: function(options) {
    options = this.options = Utils.deepMerge(this.options, options, true);
    var trailOpt = options.child;
    trailOpt.lifeSpeed = options.lifeSpeed;
    var trail;
    var trails = this.trails;
    this.each(function(trail, id) {
      trail.updateOptions(trailOpt);
    })
  },
  render: function(datas, type) {
    type = type || 'group' // 'flatten'
    if (type === 'group') {
      this.datas(datas);
    } else if (type === 'flatten') {
      this.mergeData(datas);
    }
  },

  /**
   * updateAnim 更新和动画（时间）变化有关的绘制
   */
  updateAnim: function(life) {
    if (!this.isable) return;
    this.iii = this.iii || 0;
    this.lcanvas.clear();
    life = life || this.life;
    life += this.options.lifeSpeed;
    if(life > this.options.lifeMax) {
      this.life = this.options.lifeMax;
      return this.disable();
    }
    var using = this.using;
    for (var id in using) {
      var trail = using[id];
      trail.life = life;
      trail.updateAnim(life);
      this.checkTrail(trail);
    }
  },

  /**
   * updateMap 更新和地图视窗变化有关的绘制
   */
  updateMap: function() {
    if (!this.isable) return;
    var ctx = this.ctx;
    ctx && ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    var viewBounds = this._map.getBounds();
    var using = this.using;
    for (var i in using) {
      var trail = using[i];
      if (trail) trail.updateMap(viewBounds);
    }
  },

  clean: function() {
    var ctx = this.ctx;
    ctx && ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  },

  enable: function() {
    this.isable = true;
    this.resume();
    this.updateMap();
  },
  disable: function() {
    this.clean();
    this.pause();
    this.isable = false;
  },

  /**
   * initEventsMap 和地图有关的事件
   */
  initEventsMap: function() {
    var self = this;
    this._map
      .on('movestart', function() {
        // self.clean();
        // self.pause();
      })
      .on('moveend', function() {
        // self.resume();
        self.updateMap();
      }.bind(this));
    // .on('zoomend', function () {
    //   self.updateMap();
    // });
  },

  select: function(obj) {
    var trail, id, trails = this.trails;
    this.clean();
    for (var i = 0; i < trails.length; i++) {
      trail = trails[i];
      id = trail.id;
      if (obj && id in obj) {
        trail.enable();
        trail.updateBgLine();
      } else {
        trail.disable();
      }
    }
  },

  hide: function(filter) {
    this.each(function(trail, id) {
      if (filter(trail, trail._data)) {
        trail.hide();
      }
    });
  },

  unselect: function() {
    var trail, id, trails = this.trails;
    this.clean();
    for (var i = 0; i < trails.length; i++) {
      trail = trails[i];
      trail && trail.enable();
    }
  },

  /**
   * initEventsAnim 和动画有关的事件
   */
  initEventsAnim: function() {
    this
      .on('update', function(life) {
        this.updateAnim(life);
      });
  },
});

var dmap = L.dmap = L.dmap || {};
dmap.TrailsCanvas = TrailsCanvas;
dmap.trailsCanvas = function(options) {
  return new TrailsCanvas(options);
};

module.exports = TrailsCanvas;