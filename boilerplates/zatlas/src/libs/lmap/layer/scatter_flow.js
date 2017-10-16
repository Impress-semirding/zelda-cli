/**
* @Author: disoul
* @Date:   2016-10-30T16:59:57+08:00
* @Last modified by:   disoul
* @Last modified time: 2016-11-19T18:39:49+08:00
*/



var L = require('./../leaflet');
var _ = require('lodash');
//
var Canvas = require('./../render/canvas');
require('./../core/utils');
var dmap = L.dmap = L.dmap || {};
var Utils = dmap.Utils;

var T = require('tween.js');

var getSprite = Utils.getSprite;
/**
 * @class ScatterFlow
 */

function Particle(from, to, duration, startTime, size, sprite) {
  this.from = _.cloneDeep(from) ;
  this.to = to;
  this.duration = duration;
  this.deltaLat = (to.lat - from.lat) / duration;
  this.deltaLng = (to.lng - from.lng) / duration;
  this.sprite = sprite;
  this.startTime = startTime;
  this.pos = _.cloneDeep(from);
  this.current = 0;
  this.size = size;
  this.alive = false;
  this.perVec =[];
}

var ScatterFlow = L.Class.extend({
  includes: [L.Mixin.Events],

  initialize: function (options) {
    options = this.options = Utils.deepMerge(ScatterFlow.options, options);
    this.isable = true;
    this.sprite = this.updateSprite(options.sprite);
    this.particleCount = 0;
    this.changeFlag = false;
    this.sprite2 = this.updateSprite(options.sprite2);
    this.updateGroups(options.groups);
  },
  onDefaults: function() {
    var self = this;
    var clear = this.clean.bind(this);
    var resetPos = this.resetPos.bind(this);
    this._map
      .on('zoomstart', function(){
        clear(1);
      })
      .on('zoomend', resetPos)
      .on('movestart', function(){

      })
      .on('resize', function(){
        clear(1);
        resetPos();
      })
      .on('moveend', resetPos);
  },
  disable: function () {
    this.isable = false;
  },
  enable: function () {
    this.isable = true;
  },
  addTo: function (map) {
    if (this._map || !map) return;
    this._map = map;
    this.initCanvas();
    this.initEventsMap();
    this.updateBlending();
    this.onDefaults();
  },

  initCanvas: function () {
    var map = this._map;
    var options = this.options;
    var container = options.container;
    this.dCanvas = new Canvas(map, container, options);
  },

  /**
   * data 传入可视化数据
   * @param  {Object} _data 需要可视化的数据
   * @param  {Object} opt      配置参数
   */
  data: function (data, opt) {
    opt = opt || {};
    var map = this.map;
    var self = this;
    this.transfer = opt.transfer || function (lat, lng) { //将经纬度转化为平面坐标
      return self._map.latLngToContainerPoint(L.latLng(lat, lng));
    };
    //this.processing();
    if (this._data) {
      this._data = data;
      this.changeFlag = false;
      this.changeCount = this._data.length - 1;
      this.dieDieDie();
      // if (this.options.fade) {
      //   this.lastSpeed = this.options.speed;
      //   $(this.dCanvas.canvas).fadeOut(1000, () => {
      //     this._map.context.renderDotLayer();
      //     this.lastSpeed = this.options.speed;
      //     this.options.speed = 100;
      //     this.updateParticleOptions();
      //   });
      // }
      //this.changeData();
    } else {
      this._data = data;
      this.getParticle();
    }
  },
  processing: function(){
    this.range = Utils.getRange(this._data, this.options.value);
  },
  resetPos: function(opt, key) {
    if (key !== undefined) {
      this.particleMap[key].map(p => {
        this.resetParticle(p);
      });
    } else {
      for (var line in this.particleMap) {
        this.particleMap[line].map(p => {
          this.resetParticle(p);
        });
      }
    }

  },
 resetParticle: function(p) {
      var fromPos = this.transfer(p.from.lat, p.from.lng);
      p.from.x = fromPos.x;
      p.from.y = fromPos.y;

      var toPos = this.transfer(p.to.lat, p.to.lng);
      p.to.x = toPos.x;
      p.to.y = toPos.y;

      var pos = this.transfer(p.pos.lat, p.pos.lng);
      p.pos.x = pos.x;
      p.pos.y = pos.y;

      p.deltaX = (p.to.x - p.from.x) / (p.duration / this.options.speed);
      p.deltaY = (p.to.y - p.from.y) / (p.duration / this.options.speed);
  },
  dieDieDie: function() {
    for (let key in this.particleMap) {
      this.particleMap[key].map(p => {
        p.todie = true;
      });
    }
  },
  changeData: function() {
    if (this.options.speed == 100) {
      this.options.speed = this.lastSpeed;
      this.updateParticleOptions();
    }
    // $(this.dCanvas.canvas).fadeIn();
    if (this.changeCount < 0) {
      return;
    }
    const data = this._data[this._data.length - 1 - this.changeCount];
    const speed = 0.0000001 * data['mag_inter'];
    const from = this.options.from(data);
    const to = this.options.to(data);
    const size = Utils.switchValue(this.options.size, data);
    const duration = data['length_km'] / speed;
    let key = from.lat + 'x' +from.lng + '-' + to.lat + 'x' + to.lng;
    if (this.particleMap[key]) {
      for (let i = 0;i < data['mag_inter'] / 200;i++) {
        if (this.particleMap[key][i]) {
          this.particleMap[key][i].todie = false;
        } else {
          let _from = this.options.from(data);
          let _to = this.options.to(data);
          var start = duration * Math.random();
          var p = new Particle(_from, _to, duration, start, this.options.sizeValue, this.sprite);
          this.resetCirclePos(p, speed);
          this.particleCount ++;
          this.particleMap[key].push(p);
        }
      }
    } else {
      this.particleMap[key] = []
      for (let i = 0;i < data['mag_inter'] / 200;i++) {
        let _from = this.options.from(data);
        let _to = this.options.to(data);
        var start = duration * Math.random();
        var p = new Particle(_from, _to, duration, start, this.options.sizeValue, this.sprite);
        this.resetCirclePos(p, speed);
        this.particleCount ++;
        this.particleMap[key].push(p);
      }
    }
    this.resetPos({}, key);
    this.changeCount--;
  },
  getParticle: function() {
    if (!this.particleMap) {
      this.particleMap = {};
    }
    let keys = {};
    for (let key in this.particleMap) {
      keys[key] = 1;
    }
    for (var i in this._data) {
      var d = this._data[i];
      var speed = 0.0000001 * d['mag_inter'];
      var size = Utils.switchValue(this.options.size, d);
      var duration = d['length_km'] / speed;
      var from = this.options.from(d);
      var to = this.options.to(d);
      var key = from.lat + 'x' +from.lng + '-' + to.lat + 'x' + to.lng;
      var re_key = to.lat + 'x' +to.lng + '-' + from.lat + 'x' + from.lng;
      if (!this.particleMap[key]) {
        this.particleMap[key] = [];
      } else if (this.particleMap[key].length > d['mag_inter'] / 200) {
        this.particleMap[key] = _.dropRight(this.particleMap[key], this.particleMap[key].length - d['mag_inter'] / 200);
        delete keys[key];
      } else {
        delete keys[key];
      }
      for (var count = 0; count <= d['mag_inter'] / 200; count++) {
        if (this.particleMap[key][count]) {
          continue;
        }
        let from = this.options.from(d);
        let to = this.options.to(d);
        var start = duration * Math.random();
        var p = new Particle(from, to, duration, start, size, this.sprite);
        this.resetCirclePos(p, speed);
        this.particleCount ++;
        this.particleMap[key].push(p);
      }
    }
    for (let key in keys) {
      delete this.particleMap[key];
    }
    this.resetPos();
  },
  resetCirclePos: function(p, speed) {
    var r = Math.random() * speed / 2;
    if (!p.from.x) {
      let fromPos = this.transfer(p.from.lat, p.from.lng);
      p.from.x = fromPos.x;
      p.from.y = fromPos.y;
      let toPos = this.transfer(p.to.lat, p.to.lng);
      p.to.x = toPos.x;
      p.to.y = toPos.y;
    }
    let lineAngel = Math.atan((p.to.y - p.from.y) / (p.to.x - p.from.x));
    if (p.from.lat - p.to.lat > 0) {
      var angel = Math.random() * Math.PI * 6 / 8 + (Math.PI / 8) + lineAngel;
      p.perVec = [Math.cos(lineAngel + Math.PI / 2), Math.sin(lineAngel + Math.PI / 2)];
    } else {
      var angel = Math.random() * Math.PI * -6 / 8 -(Math.PI / 8) + lineAngel;
      p.perVec = [Math.cos(lineAngel - Math.PI / 2), Math.sin(lineAngel - Math.PI / 2)];
    }
    var dX = Math.sin(angel) * r;
    var dY = Math.cos(angel) * r;
    p.from.lat += dX;
    p.from.lng += dY;
    p.to.lat += dX;
    p.to.lng += dY;
  },
  updateOptions: function (options) {
    if (options) this.options = Utils.deepMerge(this.options, options);
    this.sprite = this.updateSprite(options.sprite);
    this.sprite2 = this.updateSprite(options.sprite2);
    this.updateParticleOptions();
    this.updateBlending();
  },
  updateParticleOptions: function() {
    for (var render in this.particleMap) {
      this.particleMap[line].map(p => {
        p.size = this.options.sizeValue;
        var duration = p.duration / this.options.speed;
        p.deltaLat = (p.to.lat - p.from.lat) / duration;
        p.deltaLng = (p.to.lng - p.from.lng) / duration;
        p.deltaX = (p.to.x - p.from.x) / duration;
        p.deltaY = (p.to.y - p.from.y) / duration;
      });
    }
  },
  updateSprite: function (sprite) {
    return getSprite(sprite);
  },
  updateGroups: function (groups){
    if (!groups) return;
    for (var i in groups) {
      var group = groups[i];
      if (group.sprite) {
        group.sprite = this.updateSprite(group.sprite);
      }
    }
  },
  updateFilter: function (filter) {
    if (!filter || typeof (filter) !== 'function') return;
    this.options.filter = filter;
    this.draw();
  },

  updateBlending: function (blending) {
    if (blending) return this.dCanvas.ctx.globalCompositeOperation = this.options.blending = blending;
    this.dCanvas.ctx.globalCompositeOperation = this.options.blending;
  },
  updateParticle: function(time) {
    if (this.lastTime) {
      var deltaTime = time - this.lastTime;
    } else {
      var deltaTime = 0;
    }
    for (var line in this.particleMap) {
      for (var k in this.particleMap[line]) {
        let p = this.particleMap[line][k];
        if ((p.to.lat < p.pos.lat && p.deltaLat > 0) || (p.to.lat > p.pos.lat && p.deltaLat < 0)) {
          if (p.todie) {
            this.particleMap[line].splice(k, 1);
            this.particleCount--;
            continue;
          } else {
            p.pos = {
              lat: p.from.lat,
              lng: p.from.lng,
              x: p.from.x,
              y: p.from.y
            };
            var start = p.duration * Math.random();
            p.startTime = start;
            p.current = 0;
            p.alive = false;
          }
        }
        if (p.current >= p.startTime) {
          if (!p.alive) {
            p.pos.lat = p.pos.lat + (p.current - p.startTime) * p.deltaLat;
            p.pos.lng = p.pos.lng + (p.current - p.startTime) * p.deltaLng;
            p.pos.x = p.pos.x + (p.current - p.startTime) * p.deltaX;
            p.pos.y = p.pos.y + (p.current - p.startTime) * p.deltaY;
            p.alive = true;
          } else {
            p.pos.lat = p.pos.lat + deltaTime * p.deltaLat;
            p.pos.lng = p.pos.lng + deltaTime * p.deltaLng;
            p.pos.x = p.pos.x + deltaTime * p.deltaX;
            p.pos.y = p.pos.y + deltaTime * p.deltaY;
          }
        }
        p.current += deltaTime;
        this.lastTime = time;
      };
    }
  },
  render: function (data, isNotClean) {
    if (data) this.data(data);
    this.updateParticleOptions();
    this.animationState = 'play';
    if (!this.animationFrame) {
      this.animationFrame = window.requestAnimationFrame(this.draw.bind(this));
    }
  },
  getCurve: function (p) {
    if ((p.to.lat < p.pos.lat && p.deltaLat > 0) || (p.to.lat > p.pos.lat && p.deltaLat < 0)) {
      return {
        x: p.pos.x,
        y: p.pos.y,
      };
    }
    let x = Math.abs((p.pos.lat - p.from.lat) / (p.to.lat - p.from.lat));
    if (x < 0 || x > 1) {
    }

    let y = (-x * x + x) * 30;
    return {
      x:  p.pos.x + p.perVec[0] * y,
      y:  p.pos.y + p.perVec[1] * y,
    }
  },
  draw: function (time) {
    this.clean();
    var map = this._map;
    var zoom = this._map.getZoom();
    var options = this.options;
    var isFilter = true;
    var filter = this.options.filter;
    if (!this.isable) return;
    var ds = this._data;
    var sprite, sprites = this.sprites;
    var dCanvas = this.dCanvas;
    var w = dCanvas.w;
    var h = dCanvas.h;
    var d, lng, lat, pt, value, x, y, size;

    for (var line in this.particleMap) {
      for (var k in this.particleMap[line]) {
        var p = this.particleMap[line][k];
        if (!p || p.current < p.startTime) continue;
        if (filter) isFilter = filter(p);
        if (!isFilter) continue;

        let pos = this.getCurve(p);
        x = pos.x;
        y = pos.y;
        if (x < 0 || x > w || y < 0 || y > h) {
          continue;
        } else {
          if (p.from.lat - p.to.lat > 0) {
            dCanvas.pt(this.sprite, x, y, p.size);
          } else {
            dCanvas.pt(this.sprite2, x, y, p.size);
          }
        }
      }
    }
    if (this.animationState == 'stop') {
      cancelAnimationFrame(this.animationFrame);
      return;
    }
    if (this.particleCount <= 6500) {
      if (!this.options.fade) {
        this._map.context.renderDotLayer();
      }
      this.changeFlag = true;
    }
    if (this.changeFlag && this.changeCount != undefined && this.changeCount >= 0) {
      this.updateParticleOptions();
      this.changeData();
      if (this.options.fade) {
        this.changeData();
      }
    } else {
      this.changeFlag = false;
    }
    this.updateParticle(time);
    window.requestAnimationFrame(this.draw.bind(this));
  },
  clean: function (alpha) {
    this.dCanvas.clear(alpha);
  },

  /**
   * initEventsMap 和地图移动绑定的事件
   */
  initEventsMap: function () {
    this.dCanvas.onUpdate(function(){
      //this.draw();
    }.bind(this));
  },

  /**
   * destroy  销毁canvas
   */
  destroy: function () {
    this.dCanvas.destroy();
  }
});

ScatterFlow.options = {
    'lng': Utils.getLng,
    'lat': Utils.getLat,
    'from': function(d) {
      return d.from;
    },
    'to': function(d) {
      return d.to;
    },
    'refreshInterval': 1,
    'size': function (d) {
      return 40;
    },
    value: function(d) {
      return d[0] || d.value;
    },
    maxParticle: 5000,
    blending: 'lighter',
    clearAlpha: 1,
    container: 'tilePane',
    sprite: {
      'drawN': 1.15,
      'color': {
        'from': 'rgba(245,230,0,0.3)',
        'to': 'rgba(245,245,0,0.04)',
        'easing': 'Linear.None.1.7',
        'space': 'rgb'
      }
    },
    sprite2: {
      'drawN': 1.15,
      'color': {
        'from': 'rgba(245,230,0,0.3)',
        'to': 'rgba(245,245,0,0.04)',
        'easing': 'Linear.None.1.7',
        'space': 'rgb'
      }
    },
  };

dmap.ScatterFlow = ScatterFlow;
dmap.scatterFlow = function (opt) {
  return new ScatterFlow(opt);
};

module.exports = ScatterFlow;
