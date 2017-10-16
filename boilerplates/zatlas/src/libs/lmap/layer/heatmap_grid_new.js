'use strict';

/**
 * @class HeatmapGrid
 */
var L = require('./../leaflet');
var Utils = require('./../core/utils');
var Grid = Utils.Grid;
var getColorFunc = Utils.getColorFunc;
var _  = require('lodash');

var Event = require('bcore/event');

function HeatmapGrid(options){
  this.options = Utils.deepMerge(HeatmapGrid.options, options);
  this.initialize(options);
}

HeatmapGrid.options = {
    clusterStepByZoom: 1,
    isAutoUpdate: true,
    isNeedAggregate: true,
    shape: {
      type: 'hex',
      rx: 20,
      ry: 18,
      mouseover: {
        'fillOpacity': 0.8,
        'color': 'rgba(255,255,255,0.9)'
      },
      mouseout: {
        'fillOpacity': 1,
        'color': 'rgba(255,255,255,0.0)'
      },
      style: {
        'weight': 0,
        'fillOpacity': 1,
        'color': 'rgba(255,255,255,0.0)'
      },
      click: {}
    },
    color: getColorFunc('rgba(62,18,0,0.8)', 'rgba(255,208,122,0.8)', 'hsl', 'linear.Out.1.4'),
    scale: function (d) {return 1;},
    value: function (d, max, min) {
      return Math.min(1, d.length / 40);
    },
    lng: Utils.getLng,
    lat: Utils.getLat,
    popup: function(ds){
      return '区域内有: ' + ds.length + '点';
    }
  };

/**
 * HeatmapGrid 生成网格型点图
 * @param  {Object} d [description]
 * @return {[type]}   [description]
 */
HeatmapGrid = Event.extend(HeatmapGrid, {
  initialize: function () {
    var options = this.options;
    this.events = {
    'grid-resize': {
      desc: '格子大小发生变化'
    },
    'grid-mouseover': {
      desc: '鼠标移至格子范围'
    },
    'grid-dblclick': {
      desc: '双击格子'
    },
    'grid-mouseout': {
      desc: '鼠标移出格子范围'
    },
    'grid-click': {
      desc: '点击某个格子'
    }
  };
  //
  this.gridMap = {};
  this.aggregatedData = {};//经过合并的数据
  this.getMax = options.getMax;
  this.getScale = Utils.getColorFunc(options.shape.scale || options.scale);
  this.isable = true;
  },

  addTo: function (map) {
    if (this._map || !map) return;
    this._map = map;
    this.initDataProcesser();
    if (this._data) this.updateZoom();
  },

  initDataProcesser: function () {
    var map = this._map;
    var grid = this.options.shape;
    this.gridEncoder = new Grid()
    .transform(function (rx, ry) {
      var size = map.getSize();
      var cx = size.x / 2, cy = size.y / 2;
      var sx = cx - rx, sy = cy + ry;
      var tx = cx + rx, ty = cy - ry;
      var slatlng = map.containerPointToLatLng(L.point(sx, sy));
      var tlatlng = map.containerPointToLatLng(L.point(tx, ty));
      return {
        dlat: tlatlng.lat - slatlng.lat,
        dlng: tlatlng.lng - slatlng.lng
      };
    })
    .shape(grid.type)
    .rx(grid.rx)
    .ry(grid.ry)
    .update();
    //
    this.initEventsMap();
  },

  /**
   * initEventsMap 和地图有关的事件
   */
  initEventsMap: function () {
    var self = this;
    this._map
    .on('moveend',  () => {
      if(!this.isable) return;
      this.render();
    })
    .on('zoomend', () => {
       if(!this.isable) return;
       this.updateZoom();
    });
  },

  /**
   * updateZoom 当缩放等级发生变化时 进行更新
   */
  updateZoom: function () {
    var options = this.options;
    var clusterStepByZoom = options.clusterStepByZoom;
    var map = this._map;
    if (!options.isNeedAggregate) {
      // TODO 从服务端取数据
    } else {
      var zoom = map.getZoom();
      var zoomLevel = Math.floor(zoom / clusterStepByZoom);
      if (zoomLevel === this.zoomLevel) return;
      map.closePopup();
      this.gridEncoder.update();
      this.zoomLevel = zoomLevel;
      this.clean();
      this.aggregate();
      this.fire('grid-resize');
      this._updateTransformOrigin();
    }
  },


  /**
   * aggregate 对原始数据进行geohash合并
   */
  aggregate: function () {
    if (!this.isable) return;
    var gridEncoder = this.gridEncoder;
    var obj, options = this.options;

    var key, center, ds = this._data,
      d, lat, lng, getLat = options.lat,
      getLng = options.lng;

    this.aggregatedData = Utils.mapReduce(this._data.filter(d => getLat(d) && getLng(d)), {
      map: function (k, d) {
        return {
          key: gridEncoder.encode(getLat(d), getLng(d)),
          value: d
        };
      }
    });
  },

  getBounds: function () {
    var bounds = this._map.getBounds();
    var min = bounds._southWest, max = bounds._northEast;
    var offsetlat = 0.5 * (max.lat - min.lat),  offsetlng = 0.5 * (max.lng - min.lng);
    return {
      latMin: min.lat - offsetlat,
      latMax: max.lat + offsetlat,
      lngMin: min.lng - offsetlng,
      lngMax: max.lng + offsetlng
    };
  },

  /**
   * clean 清理不用的格子
   */
  clean: function () {
    var gridMap = this.gridMap, map = this._map;
    for (var k in gridMap) {
      var grid = gridMap[k];
      map.removeLayer(grid);
      delete gridMap[k];
    }
    // this.aggregatedData = {};
  },

  destroy: function(){
    this.clean();
    this.gridMap = {};
    this.aggregatedData = {};//经过合并的数据
    this._data = [];
  },

  disable: function () {
    this.isable = false;
    this.clean();
  },

  enable: function(){
    this.isable = true;
    this.draw();
  },

  link: function(){
  },

  /**
   * setShapeType 更改图形的类型
   */
  updateShape: function () {
    this.clean();
    var grid = this.options.shape, type = grid.type, rx = grid.rx, ry = grid.ry;
    var gridEncoder = this.gridEncoder;
    this._map.closePopup();
    //
    gridEncoder.shape(type);
    gridEncoder.rx(rx);
    gridEncoder.ry(ry);
    gridEncoder.update();

    this.aggregate();
    this.draw();
  },

  hide: function(){
    this.each(function(grid, i){
      grid._path.setAttribute('style', 'opacity:0;');
    });
  },
  show: function(){
    this.each(function(grid, i){
      grid._path.setAttribute('style', 'opacity:1;');
    });  
  },

  /**
   * updateColor 更新色彩
   * @param  {} a 可以为对象 或colorFrom
   * @param  {[type]} b colorTo
   * @param  {String} c blendingType rgb或hsl 在哪个空间下插值
   * @param  {[type]} d easing函数或关键字符
   */
  updateColor: function (a, b, c, d) {
    if (!a) a = this.options.color;
    var getColor = this.getColor = Utils.getColorFunc(a, b, c, d);
    var gridMap = this.gridMap, grid, value;
    for(var key in gridMap) {
      grid = gridMap[key];
      value = grid._value;
      grid.setStyle({
        fillColor: getColor(value)
      });
    }
  },

  updateOptions: function (options) {
    this.options = Utils.deepMerge(this.options, options);
    this.updateColor();
    this.updateShape();
  },

  /**
   * updateScale 更新大小和图形的关系
   * @param  {[type]} scaleFunc [description]
   * @return {[type]}           [description]
   */
  updateScale: function (getScale) {
    if(!getScale) return;
    this.scaleGridFunc = function (grid, ki) {
      if(!grid) return;
      var node = grid._container;
      this._updateTranformOriginGird(node);
      var scale = getScale(ki);
      var transform = 'scale3d(' + scale + ',' + scale + ',1)';
      node.style['transform'] = transform;
      node.style['-webkit-transform'] = transform;
      this.getScale = getScale;
   };
  },

  _updateTranformOriginGird: function(node){
    if(!node) return;
    var bbox = node.getBBox();
    var origin = (bbox.width / 2 + bbox.x) + 'px ' + (bbox.height / 2 + bbox.y) + 'px 0px';
    node.style['transform-origin'] = origin;
    node.style['-webkit-transform-origin'] = origin;
  },

  /**
   * _updateTransformOrigin 每次缩放之后 每个格子的transform-origin会变 需要更新
   */
  _updateTransformOrigin: function() {
    if (!this.scaleGridFunc) return;
    var gridMap = this.gridMap,
      grid, self = this;
    setTimeout(function() {
      for (var k in gridMap) {
        self._updateTranformOriginGird(gridMap[k]._container);
      }
    });
  },


  /**
   * data 灌入数据
   * @param  {Object} data 带有经纬度的原始数据
   */
  data: function (data) {
    if (!data) return this._data;
    this._data = data;
    var options = this.options;
    if (options.isAutoUpdate && this._map) this.aggregate();
    this.updateColor();
    var grid = options.shape;
    // if (grid.scale) this.updateScale(grid.inputs.scale);
  },


  /**
   * render 绘制阶段
   * @param  {Object} data 数据 数组
   */
  render: function (data) {
    if (data) this.data(data);
    this.draw();
  },

  each: function(fn){
    var gridMap = this.gridMap;
    for (var i in gridMap){
      var grid = gridMap[i];
      fn(grid, i);
    }
  },

  draw: function () {
    if (!this.isable) return;
    var drawid = this.drawid = 'id_' + Math.floor(Math.random() * 10000000000);
    var options = this.options;
    var gridEncoder = this.gridEncoder;
    var gridStyle = options.shape.style;
    var getColor = Utils.getColorFunc(options.shape.color || options.color);
    var getValue = options.value;
    var ds = this.aggregatedData, gridMap = this.gridMap;
    var map = this._map, bounds = this.getBounds(), grid;
    var latMax = bounds.latMax, latMin = bounds.latMin, lngMax = bounds.lngMax, lngMin = bounds.lngMin;

    var min, max, v;
    for(let k in ds){
      d = ds[k];
      v = getValue(d); 
      if(v === null || v === undefined || isNaN(v)) continue;
      if(!min) min = v; 
      if(!max) max = v; 
      min = Math.min(v, min);
      max = Math.max(v, max);
    }
    //
    for (var k in ds) {
      var d = ds[k];
      var decode = gridEncoder.decode(k);
      var center = decode.center;
      var pts = decode.pts;
      var clat = center[0], clng = center[1];
      if ((clat < latMin) || (clng < lngMin) || (clat > latMax) || (clng > lngMax)) continue;
      var v = getValue(d) || 0;
      var ki = (v - min) / (max - min) || 0;
      var color = getColor(ki);
      grid = gridMap[k];
      if (!grid) {
        gridStyle.fillColor = color;
        grid = gridMap[k] = L.polygon(pts, gridStyle).addTo(map);
        grid._value = ki;
        grid._gridid = k;
        grid._drawid = drawid;
        this.initEventsGrid(grid);//为每个格子添加事件
        if (this.scaleGridFunc) this.scaleGridFunc(grid, ki);
      } else {
        grid.setStyle({
          fillColor: color
        });
        grid._drawid = drawid;
      }
    }

    for(var i in gridMap){
      if(gridMap[i]._drawid !== drawid){
        map.removeLayer(gridMap[i]);
        delete gridMap[i];
      }
    }
    this._updateTransformOrigin();
  },

  /**
   * initEventsGrid 为grid添加事件 如hover click等
   * @param  {Object} grid grid图形对象
   */
  initEventsGrid: function (grid) {
    var self = this, datas = this.aggregatedData;
    var gridOptions = this.options.shape, click = gridOptions.click || {}, mouseover = gridOptions.mouseover || {}, mouseout = gridOptions.mouseout || {};
    var gridid = grid._gridid;

    var map = this._map;

    var data = datas[gridid];
    var info = {
        gridid: gridid,
        data: data,
        layer: grid
      };

    var bound = grid.getBounds();
    var lat = bound._northEast.lat;
    var lng = (bound._southWest.lng + bound._northEast.lng) / 2;
    var popLatlng = L.latLng(lat, lng);

    var popup;
    if (this.options.popup) {
      popup = this.options.popup(data, grid);
    }

    grid
    .on('mouseover', function (e) {
      mouseover && grid.setStyle(mouseover);
      self.fire('child-mouseover', info);
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);
      grid.bringToFront();
      return true;
    })
    .on('mouseout', function (e) {
      mouseout && grid.setStyle(mouseout);
      self.fire('child-mouseout', info);
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);
      return true;
    })
    .on('mousedown', function (e) {
      click && grid.setStyle(click);
      self.fire('grid-mousedown', info);
      map.closePopup();
      if (popup) setTimeout(function() {map.openPopup(popup, popLatlng)}, 100);
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);
      return true;
    })
    .on('click', function(e){
      click && grid.setStyle(click);
      self.fire('child-click', info);
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);
      return true;
    })
    .on('dblclick', function (e) {
      self.fire('child-dblclick', info);
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);
      return true;
    });
  }
});

var dmap = L.dmap = L.dmap || {};
dmap.HeatmapGrid = HeatmapGrid;
dmap.heatmapGrid = function (options) {
  return HeatmapGrid(options);
};

module.exports = HeatmapGrid;
