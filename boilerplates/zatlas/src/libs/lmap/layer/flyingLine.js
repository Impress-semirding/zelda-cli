var L = require('./../leaflet');
var FlyingLinePath = require('./flyingLinePath');
var Util = require('./../core/utils');
var dmap = L.dmap = L.dmap || {};
var AnimView = require('./../core/anim_view');
/**
 * @class FlyingLine
 */
function FlyingLine(options) {
  options = this.options = Util.deepMerge(FlyingLine.options, options);
  options.interactiveLine.kHeight = options.kHeight;
  options.displayLine.kHeight = options.kHeight;
  this.initialize(options);
}

function parsePtString(pt) {
  if (typeof (pt) === 'string' && pt.indexOf(',')!== -1) {
    pt = pt.split(',');
    var lat = pt[0] || 0;
    var lng = pt[1] || 0;
    return {
      lat: parseFloat(lat, 10),
      lng: parseFloat(lng, 10)
    };
  }
  return pt;
}
FlyingLine.options = {
  'isAutoStart': false,
  'lifeMin': 0,
  'lifeMax': 1,
  'isPopupHover': 0,
  'lifeEnd': 'destroy',
  'range': 0.8,
  'lifeSpeed': 0.08,
  'kHeight': 0.5,
  'interactiveLine': {
    'weight': 5,
    'color': 'rgba(250,150,50,0.0)',
    'colorHover': 'rgba(250,150,50,0.1)'
  },
  'displayLine': {
    'weight': 1
  }
};

FlyingLine.options = Util.deepMerge(AnimView.options, FlyingLine.options);

FlyingLine = AnimView.extend(FlyingLine, {
  isInit: false,
  life: 0,
  /**
   * initialize 初始化
   * @param  {Object} opt 配置
   */
  initialize: function (options) {
    if (this._map) this.addTo(this._map);
    this.id = this.options.id || Util.getId('flyingLine');
    this.isLive = false;
    this.isLooping = true;
  },

  checkIfEnd: function () {
    if (this.life >= this.options.lifeMax + this.options.range) this._onLifeEnd();
  },

  /**
   * addTo 将飞线图放入地图
   * @param {Object} map 地图对象
   */
  addTo: function(map) {
    this._map = map;
    this.init();
    this.initEvents();
    return this;
  },

  /**
   * init 初始化
   */
  init: function() {
    if (this.isInit || !this._map) return;
    this.initInteractiveLine();
    this.initDisplayLine();
    this.isInit = true;
  },

  /**
   * initDisplayLine 初始化显示的线
   */
  initDisplayLine: function () {
    throw '必须实现initDisplayLine方法';
  },

  /**
   * initInteractiveLine 交互的线
   */
  initInteractiveLine: function () {
    var options = this.options;
    var map = this._map;
    var self = this;
    var interactiveLine = options.interactiveLine;
    interactiveLine.kHeight = options.kHeight;
    if (!interactiveLine) return;
    var interactivePath = this.interactivePath = new FlyingLinePath(interactiveLine);
    interactivePath.addTo(map);
    var path = interactivePath._path;
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', interactiveLine.color);
    path.setAttribute('stroke-width', interactiveLine.weight);
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');

    interactivePath
      .on('mouseover', function (e) {
        path.setAttribute('stroke', interactiveLine.colorHover);
        self.emit('mouseover', self.record);
        if (options.isPopupHover) interactivePath.openPopup();
      })
      .on('mouseout', function (e) {
        path.setAttribute('stroke', interactiveLine.color);
        if (options.isPopupHover) interactivePath.closePopup();
        self.emit('mouseout', self.record);
      })
      .on('mousedown', function (e) {
        self.resume();
        self.fireEvent('mouseout', interactivePath);
        self.emit('mousedown', self.record);
      })
      .on('click', function (e) {
        self.emit('click', self.record);
      });
  },
  setPopupContent: function (html) {
    this.interactivePath && this.interactivePath.setPopupContent(html);
  },
  data: function (data) { //灌入数据
    if (!data || !data.from || !data.to) return console.log('无数据/数据格式有问题');
    data.from = parsePtString(data.from);
    data.to = parsePtString(data.to);
    this._data = data;
    this.updateData(data);
    this.bindPopup();
    this.reset();
    this.options.isAutoStart && this.resume();
    this.record = {
      data: data,
      layer: this
    };
  },

  render: function(data) {
    if (data) this.data(data);
    this.draw();
  },

  draw: function() {
    this.fireEvent('lifestart', { //生命结束事件
      'latlng': this.displayPath.from,
      'data': this._data
    });
    this.startAnim();
  },

  initEvents: function () {
    this
      .on('update', this.updateLife.bind(this))
      .on('lifeEnd', function (life) {
        var lifeEnd = this.options.lifeEnd;
        if (lifeEnd === 'loop') return this.restart();
        if (lifeEnd === 'hide') return this.hide();
        if (lifeEnd === 'destroy') return this.destroy();
      });
  },
  updateOptions: function (options) {
    options = this.options = Util.deepMerge(this.options, options);
    this.updateOptionsInteractiveLine && this.updateOptionsInteractiveLine();
    this.updateOptionsDisplayLine && this.updateOptionsDisplayLine();
    options.interactiveLine.kHeight = options.kHeight;
    this.interactivePath && this.interactivePath.updateOptions(options.interactiveLine);
    options.displayLine.kHeight = options.kHeight;
    this.displayPath && this.displayPath.updateOptions(options.displayLine);
  },

  updateLife: function (life) {
    if (!this.isLive) return;
    if (this.updateInteractiveLine) this.updateInteractiveLine(life);
    if (this.updateDisplayLine) this.updateDisplayLine(life);
  },

  updateData: function (data) {
    if (this.interactivePath) this.interactivePath.data(data);
    if (this.displayPath) this.displayPath.data(data);
  },

  bindPopup: function (html, options) {
    html = html || this.bindHTML;
    if (!html) return;
    if (!this._data) return this.bindHTML = html;
    options = Util.deepMerge({
      maxWidth: 800,
      autoPan: false,
      // offset: L.point(88, 60),
      // autoPanPadding: L.point(0, 0)
    }, options);
    if (typeof (html) === 'function') html = html(this._data || {});
    this.interactivePath.bindPopup(html, options);
    this.bindHTML = null;
  },
  hide: function () {
    this.life = 0;
    this.isLive = false;
    if (this.interactivePath) this.interactivePath.hide();
    if (this.displayPath) this.displayPath.hide();
    this.fire('hide');
  },
  pause: function () {
    this.isLooping = false;
    this.isLive = false;
    cancelAnimationFrame(this.loopid);
    this.loopid = null;
    this.fire('pause');
  },
  resume: function () {
    if (this.isLive) return;
    var options = this.options;
    setTimeout(function () {
      // this.interactivePath && this.interactivePath.wake();
      // this.displayPath && this.displayPath.wake();
    }.bind(this));
    this.isLive = true;
    this.loop();
    this.fire('resume');
  },
  /**
   * loop 开始自动更新
   */
  loop: function () {
    if(!this.isLooping) return;
    this._updateLife();
    this.loopid = requestAnimationFrame(this.loop.bind(this));
  },
  isEnd: function () {
    return this.life > this.options.lifeMax;
  },
  reset: function () {
    var options = this.options;
    this.life = options.lifeMin;
  },
  destroy: function () {
    this.pause();
    this.off();
    this.life = 0;
    this.isLive = false;
    //线销毁
    if (this.interactivePath) this.interactivePath.destroy();
    if (this.displayPath) this.displayPath.destroy();
  }
});


dmap.FlyingLine = FlyingLine;
dmap.flyingLine = function (opt) {
  return new FlyingLine(opt);
};

module.exports = FlyingLine;