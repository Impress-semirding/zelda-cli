'use strict';

/**
 * @class HeatmapGrid
 */
var L = require('./../leaflet');
var Utils = require('@ali/map-utils');
var Grid = Utils.Grid;
var getColorFunc = Utils.getColorFunc;

/**
 * HeatmapGrid 生成网格型点图
 * @param  {Object} d [description]
 * @return {[type]}   [description]
 */
var HeatmapGrid = L.Class.extend({
  aggregatedData: {}, //经过合并的数据
  includes: [L.Mixin.Events],
  initialize: function (options) {
    options = this.options = Utils.deepMerge(HeatmapGrid.options, options);
    this.check();
    this.getMax = options.getMax;
    this.grids = [];
  },

  check: function(){
    var options = this.options;
    if(!options.appid) throw '必须要设定 appid';
    if(!options.mapid) throw '必须要设定 mapid';
    if(!options.data) throw '必须要设定 热力图接口';
  },

  addTo: function (map) {
    if (this._map || !map) return;
    this._map = map;
    var grid = this.options.grid;
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
    .shape('rect')
    .rx(grid.rx)
    .ry(grid.ry)
    .update();
    //
    this.initEventsMap();
    this.refresh();
  },

  /**
   * data 灌入数据
   * @param  {Object} data 带有经纬度的原始数据
   */
  data: function (data) {
    if (!data) return this._data;
    this._data = data;
    var options = this.options;
    if (options.isAutoUpdate && this._map) this.draw();
    this.updateColor();
  },

  /**
   * initEventsMap 和地图有关的事件
   */
  initEventsMap: function () {
    this._map.on('moveend', this.refresh.bind(this));
  },

  refresh: function(cb){//取数据且刷新
    var self = this;
    var options = this.options;
    var getData = options.data;
    var query = {
      'appid': options.appid,
      'bbox': this.getBounds(),
      'indicator': options.indicator,
      'zoom': this._map.getZoom()
    };
    getData(query, self.render.bind(this));
  },

  getBounds: function () {
    var bounds = this._map.getBounds();
    var min = bounds._southWest, max = bounds._northEast;
    var offsetlat = 0.5 * (max.lat - min.lat),  offsetlng = 0.5 * (max.lng - min.lng);
    return [[min.lat - offsetlat, max.lat + offsetlat], [min.lng - offsetlng, max.lng + offsetlng]];
  },

  /**
   * updateColor 更新色彩
   * @param  {} a 可以为对象 或colorFrom
   * @param  {[type]} b colorTo
   * @param  {String} c blendingType rgb或hsl 在哪个空间下插值
   * @param  {[type]} d easing函数或关键字符
   */
  updateColor: function (a, b, c, d) {
    if (!a) return;
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

  // /**
  //  * updateScale 更新大小和图形的关系
  //  * @param  {[type]} scaleFunc [description]
  //  * @return {[type]}           [description]
  //  */
  // updateScale: function (getScale) {
  //   if(!getScale) return;
  //   this.scaleGridFunc = function(grid, ki){
  //     if(!grid) return;
  //     var node = grid._container;
  //     this._updateTranformOriginGird(node);
  //     var scale = getScale(ki);
  //     var transform = 'scale3d(' + scale + ',' + scale + ',1)';
  //     node.style['transform'] = transform;
  //     node.style['-webkit-transform'] = transform;
  //     this.getScale = getScale;
  //  };
  // },

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
   * render 绘制阶段
   * @param  {Object} data 数据 数组
   */
  render: function (data) {
    if (data) this.data(data);
    this.draw ();
  },

  clean: function(){
    var grids = this.grids;
    var map = this._map;
    for(var i in grids){
      map.removeLayer(grids[i]);
    }
    this.grids = [];
  },

  draw: function () {
    this.clean();
    var grids = this.grids;
    var options = this.options;
    var gridEncoder = this.gridEncoder;
    var gridStyle = options.grid.normal;
    var getColor = getColorFunc(options.color);
    var getValue = options.value;
    var ds = this._data, gridMap = this.gridMap;
    var map = this._map, grid;
    var nMax = 40;

    var lat0, lat1, lng0, lng1;
    for (var k in ds) {
      var d = ds[k];
      lng0 = d[0], lat0 = d[1], lng1 = d[2], lat1 = d[3];
      var pts = [L.latLng(lat0, lng0), L.latLng(lat1, lng0), L.latLng(lat1, lng1), L.latLng(lat0, lng1)];
      var ki = getValue(d);
      grid = L.polygon(pts, gridStyle).addTo(map);
      grid.setStyle({
        fillColor: getColor(ki)
      })
      grid._value = ki;
      grid._heatdata = d;
      grids.push(grid);
      this.initEventsGrid(grid);//为每个格子添加事件
      if (!this.scaleGridFunc) continue;
      this.scaleGridFunc(grid, ki);
    }
  },

  /**
   * initEventsGrid 为grid添加事件 如hover click等
   * @param  {Object} grid grid图形对象
   */
  initEventsGrid: function (grid) {
    var self = this, datas = this.aggregatedData;
    var gridOptions = this.options.grid, click = gridOptions.click || {}, mouseover = gridOptions.mouseover || {}, normal = gridOptions.normal || {};
    var gridid = grid._gridid;
    var data = grid._heatdata;
    var info = {
        gridid: gridid,
        data: data
      };
    grid
    .on('mouseover', function (e) {
      mouseover && grid.setStyle(mouseover);
      self.fire('grid-mouseover', info);
      grid.bringToFront();
    })
    .on('mouseout', function (e) {
      normal && grid.setStyle(normal);
      self.fire('grid-mouseout', info);
    })
    .on('mousedown', function (e) {
      click && grid.setStyle(click);
      self.fire('grid-click', info);
    })
    .on('dblclick', function (e) {
      self.fire('grid-dblclick', info);
    });
  }
});

HeatmapGrid.options = {
    appid: null,
    mapid: null,
    clusterStepByZoom: 1,
    isAutoUpdate: true,
    isNeedAggregate: true,
    grid: {
      mouseover: {
        'opacity': 1,
        'color': '#fff',
        'fillOpacity': 1,
      },
      normal:{
        'opacity': 0,
        'weight': 1,
        'fillOpacity': 1,
      },
      click: {},
      rx: 30,
      ry: 25
    },
    color: getColorFunc('rgba(62,18,0,0.8)', 'rgba(255,208,122,0.8)', 'hsl', 'linear.Out.1.4'),
    lng: Utils.getLng,
    lat: Utils.getLat,
    scale: function (d) {
      return 1;
    },
    value: function (d, max, min) {
      return d[4];
    }
  };

var dmap = L.dmap = L.dmap || {};
dmap.HeatmapGrid = HeatmapGrid;
dmap.heatmapGrid = function (options) {
  return HeatmapGrid(options);
};

HeatmapGrid.getSizeList = function(rx, ry, map){
  var center = map.getCenter();
  var size = map.getSize();
  var cx = size.x / 2, cy = size.y / 2;
  var sx = cx - rx, sy = cy + ry;
  var tx = cx + rx, ty = cy - ry;
  var slatlng = map.containerPointToLatLng(L.point(sx, sy));
  var tlatlng = map.containerPointToLatLng(L.point(tx, ty));
  var clatlng = map.containerPointToLatLng(L.point(tx, sy));
  var dlat = tlatlng.lat - slatlng.lat, dlng = tlatlng.lng - slatlng.lng;
  var dx = slatlng.distanceTo(clatlng);
  var dy = tlatlng.distanceTo(clatlng);
  var zoom = map.getZoom();
  var obj = {
    zoom: zoom,
    dx: dx,
    dy: dy,
    dlat: dlat,
    dlng: dlng
  };
  var result = [];
  for(var i = 1; i < zoom; i++){
    var scale = Math.pow(2, zoom - i);
    result[i] = {
      zoom: i,
      dx: dx * scale,
      dy: dy * scale,
      dlat: dlat * scale, 
      dlng: dlng * scale
    };
  }
  for(var i = zoom; i < 19; i++){
    var scale = Math.pow(0.5, i - zoom);
    result[i] = {
      zoom: i,
      dx: dx * scale,
      dy: dy * scale,
      dlat: dlat * scale, 
      dlng: dlng * scale
    };
  }
  return result;
};

module.exports = HeatmapGrid;
