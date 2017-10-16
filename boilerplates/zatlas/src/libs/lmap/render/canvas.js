var L = require('./../leaflet');
var $ = require('jquery');
var dmap = L.dmap = L.dmap || {};

var Utils = require('bcore/utils');

var requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) {
    return window.setTimeout(callback, 1000 / 60);
  };
var cancelAnimationFrame =
  window.cancelAnimationFrame ||
  window.cancelRequestAnimationFrame ||
  window.mozCancelAnimationFrame ||
  function(id) {
    window.clearTimeout(id);
  };

function Canvas(map, node, options) {
  options = this.options = Utils.deepMerge(Canvas.options, options);
  this.map = map;
  this.init(node, options);
  this.styles(options);
  this.onDefaults();
}

Canvas.options = {
  clearAlpha: 1
};

/**
 * init 创建一个和传入节点等大的canvas
 * @param  {Object} node jquery节点对象
 * @param  {Object} opt  [description]
 */
Canvas.prototype.init = function (node, opt) {
  var map = this.map;
  if(typeof(node) === 'string'){
    var nodes = map.getPanes();
    if(nodes[node]){
      node = nodes[node];
      var mapSize = map.getSize();
      opt.width = mapSize.x;
      opt.height = mapSize.y;
      this.isMapPane = 1;
    }
  }
  node = this.node = $(node);
  var w = this.w = opt.width || node.width();
  var h = this.h = opt.height || node.height();
  var canvas;
  if (node.is('div')) { //如果是div 创建一个canvas
    var quality = this.quality = opt.quality || 2;
    canvas = $('<canvas width="' + (w * quality) + '" height="' + (h * quality) + '"><canvas>')
      .css({
        'position': 'absolute',
        'left': '0',
        'top': '0',
        'pointerEvents': 'none',
        'width': w + 'px',
        'height': h + 'px'
      });
    node.append(canvas);
    canvas = this.canvas = canvas[0];
    var ctx = this.ctx = canvas.getContext('2d');
    ctx.scale(quality, quality);
  }

  if (node.is('canvas')) { //如果是canvas 修改
    canvas = this.canvas = node[0];
    this.ctx = canvas.getContext('2d');
  }

  //
  var canvasTmp = this.canvasTmp = $('<canvas width="' + (canvas.width) + '" height="' + (canvas.height) + '"><canvas>')[0];
  this.ctxTmp = canvasTmp.getContext('2d');
};
/**
 * styles 对canvas风格上的一些设置 如叠加模式
 * @param  {Object} cfg 配置
 */
Canvas.prototype.styles = function (cfg) {
  cfg = cfg || {};
  var lighter = cfg.lighter;
  var ctx = this.ctx;
  lighter && ctx && (ctx.globalCompositeOperation = 'lighter'); //是否叠加变量
  var opacity = cfg.opacity;
  (opacity !== undefined) && (opacity !== null) && ctx && (ctx.globalAlpha = opacity); //是否有透明度
};

/**
 * onDefaults 默认地图事件产生的操作
 */
Canvas.prototype.onDefaults = function() {
  var self = this;
  var clear = this.clear.bind(this);
  var resetPos = this.resetPos.bind(this);
  this.map
    .on('zoomstart', function(){
      self.clear(1);
    })
    .on('zoomend', resetPos)
    .on('movestart', function(){
      // self.clear(1);
    })
    .on('resize', function(){
      clear(1);
      resetPos();
    })
    .on('moveend', resetPos);
};

/**
 * bind 和地图事件产生绑定
 * @param  {String}   name 事件名称
 * @param  {Function} cb   绑定的
 * @return {[type]}        [description]
 */
Canvas.prototype.bind = function (name, hook) {
  this[name] && this.map.off(name, this[name].bind(this));
  this[name] = hook;
  this.map.on(name, hook.bind(this));
};

/**
 * onZoomstart 给地图缩放开始事件绑定函数
 * @param  {Function} hook 函数
 */
Canvas.prototype.onZoomstart = function (hook) {
  this.bind('zoomstart', hook);
};

/**
 * onMovestart 给地图移动开始事件绑定函数
 * @param  {Function} hook 函数
 */
Canvas.prototype.onMovestart = function (hook) {
  this.bind('movestart', hook);
};

/**
 * onMoveend 给地图移动结束事件绑定函数
 * @param  {Function} hook 函数
 */
Canvas.prototype.onMoveend = function (hook) {
  this.bind('moveend', hook);
};

/**
 * onZoomend 给地图缩放结束事件绑定函数
 * @param  {Function} hook 函数
 */
Canvas.prototype.onZoomend = function (hook) {
  this.bind('zoomend', hook);
};

/**
 * onUpdate 给地图变化事件结束事件绑定函数
 * @param  {Function} hook 函数
 */
Canvas.prototype.onUpdate = function (hook) {
  this.bind('moveend', hook);
  this.bind('resize', hook);
};


/**
 * resetPos 重新排列节点位置
 */
Canvas.prototype.resetPos = function() {
  var canvas = this.canvas;
  if (this.isMapPane) {
    var domPosition = L.DomUtil.getPosition(this.map.getPanes().mapPane);
    if (domPosition) {
      L.DomUtil.setPosition(canvas, {
        x: -domPosition.x,
        y: -domPosition.y
      });
    }
  }
  this.clear(1);
};
/**
 * clear 清除目前的绘制
 */
Canvas.prototype.clear = function (alpha) {
  if(alpha === undefined || alpha === null) alpha = this.options.clearAlpha;
  if (alpha === 1) {
    return this.ctx.clearRect(0, 0, this.w, this.h);
  } else {
    var canvasTmp = this.canvasTmp, ctxTmp = this.ctxTmp;
    var canvas = this.canvas,       ctx = this.ctx;
    //
    ctxTmp.globalAlpha = alpha;
    //
    ctxTmp.drawImage(canvas, 0, 0, this.w, this.h);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(canvasTmp, 0, 0, canvas.width, canvas.height);
    ctxTmp.clearRect(0, 0, this.w, this.h);
  }
};

/**
 * destroy 销毁节点
 */
Canvas.prototype.destroy = function () {
  this.canvas.remove();
  // this.node.remove();
};

/**
 * pt  在canvas上根据传入图片画点图
 * @param  {Object} img 图片/canvas格式的sprite小图片
 * @param  {Float} x   中心点的X坐标
 * @param  {Float} y   中心点的X坐标
 * @param  {Float} w   图片宽度
 * @param  {Float} h   图片长度
 */
Canvas.prototype.pt = function (img, x, y, w, h) {
  h = h || w;
  this.ctx.drawImage(img, x - w / 2, y - h / 2, w, h);
};

Canvas.prototype.test = function (cfg) {
  this.ctx.fillStyle = '#900';
  this.ctx.fillRect(20, 202, 333 + Math.random() * 100, 33);
  this.ctx.fillRect(24, 223, 33, 333);
};

dmap.Canvas = Canvas;
dmap.canvas = function (map, canvas, opt) {
  return new Canvas(map, canvas, opt);
};
module.exports = Canvas;
