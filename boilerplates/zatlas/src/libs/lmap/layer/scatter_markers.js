var L = require('./../leaflet');
var Utils = require('./../core/utils');
var EVENTS = Utils.EVENTS;
var Event = require('bcore/event');
var ScatterMarker = require('./scatter_marker');
var dmap = L.dmap = L.dmap || {};

/**
 * @class ScatterMarkers
 */
function ScatterMarkers(options) {
  options = this.options = Utils.deepMerge(ScatterMarkers.options, options);
  this.getChildOptions();
  this.initialize(options);
}

ScatterMarkers.options = {
    'lat': Utils.getLat,
    'lng': Utils.getLng,
    'filter': function (d, zoom) {
      return true;
    },
    popupText: 'loading...',
    'range': [0, 1],
    'id': function (d, i) {
      return d.id || i;
    },
    'text': function (d) {
      return d.text;
    },
    value: function (d){
      return d.value || d.num || d[0];
    },
    'zoom': {
      'max': 18,
      'min': 3
    },
    'child': {
      'size': function (d, min, max) {
        return 15;
      },
      'shape': {
        'normal': {
        }
      }
    }
  };

ScatterMarkers = Event.extend(ScatterMarkers, {
  initialize: function (options) {
    this.cache = {};
    this.isable = true;
  },

  addTo: function (map) {
    if (!map) return;
    this._map = map;
    this.initEventsMap();
    this.initPopUp();
  },

  initPopUp: function(){
    var map = this._map;
    if (!map) map._popup = L.popup('...');
  },

  data: function (ds) {
    this._data = ds;
  },

  //清除所有显示
  clean: function () {
    var cache = this.cache, obj, visual;
    if (!cache) return;
    for (var id in cache) {
      obj = cache[id];
      visual = obj.visual;
      if (visual && visual.destroy) {
        visual.destroy();
        delete obj.visual;
      }
    }
  },

  updateData: function (ds) {
    this.processing(ds);
    this.cleanOld();
  },

  updateFilter: function (filter) {
    if (typeof (filter) !== 'function') return;
    this.options.filter = filter;
    this.updateMap();
  },

  cleanOld: function () {
    var versionID = this.versionID;
    var cache = this.cache, obj, visual, vid;
    if (!versionID || !cache) return;
    for (var id in cache) {
      obj = cache[id];
      vid = obj.versionID;
      if (vid !== versionID) {
      visual = obj.visual;
      if (visual) {
        visual.off && visual.off();
        visual.destroy && visual.destroy();
      } 
      delete cache[id];
      }
    }
  },
  processing: function (ds) {
    var versionID = this.versionID = Math.random();
    var map = this._map;
    if (!map) return;
    var options = this.options;
    var scatterOpt = this.getChildOptions();
    var d, id, lat, lng, obj, visual, isInZoom = this.isInZoom();
    var zoom = this._map.getZoom();
    var getId = options.id, getLat = options.lat, getLng = options.lng;
    var filter = options.filter;
    var groups = options.groups;
    var isFilter, isFilterGroup;
    var cache = this.cache;
    var isable = this.isable;
    for (var i in ds) {
      d = ds[i];
      options.processing && options.processing(d);
      id = getId(d, i);
      lat = getLat(d);
      lng = getLng(d);
      obj = cache[id];
      isFilter = true;
      isFilter = filter(d, zoom);
      isFilterGroup = true;
      if (groups) {
        isFilterGroup = false;
        for (var i in groups) {
          var group = groups[i];
          if (group.filter(d)) {
            isFilterGroup = true;
            break;
          }
        }
      }
      if (obj) {
        obj.data = d;
      } else {
        obj = cache[id] = {
          'data': d
        };
      }
      obj.versionID = versionID;

      // 更新绘制
      if (isInZoom && isFilter && isFilterGroup && this.isInView(lat, lng) && isable) {
      var visual = obj.visual;
      if(visual) {
          visual.updateData(d);
      } else if (isable) {
        visual = obj.visual =  new ScatterMarker(scatterOpt);
        visual.addTo(map);
        visual.render(d);
        this.initEventsScatter(visual);
       }
      }
    }
    this.updateRange();
  },
  render: function (ds) {
    if (ds) this.data(ds);
    ds = this._data;
    this.updateData(ds);
  },
  enable: function () {
    this.isable = true;
  },
  disable: function () {
    this.isable = false;
  },
  isInZoom: function () {
    var zoomOpt = this.options.zoom;
    if (!zoomOpt) return true;
    var map = this._map;
    var maxZoom = zoomOpt.max;
    var minZoom = zoomOpt.min;
    var zoom = map.getZoom();
    if (zoom > maxZoom || zoom < minZoom) return false;
    return true;
  },
  isInView: function (lat, lng, viewBounds) {
    viewBounds = viewBounds || this._map.getBounds();
    var lngMax = viewBounds._northEast.lng;
    var latMax = viewBounds._northEast.lat;
    var lngMin = viewBounds._southWest.lng;
    var latMin = viewBounds._southWest.lat;
    return ((lat < latMax) && (lat > latMin) && (lng < lngMax) && (lng > lngMin));
  },
  each: function (fn) {
    var cache = this.cache;
    for (var i in cache) {
      fn.bind(this)(cache[i]);
    }
  },
  getOptionsValue: function (key) {
    var options = this.options;
    return options.child[key] || options[key];
  },
  getChildOptions: function () {
    var options = {};
    var self = this;
    ['id', 'text', 'lat', 'lng', 'range', 'value', 'css', 'popupText', 'popup'].forEach(function (k) {
      options[k] = self.options[k] = this.getOptionsValue(k);
    }.bind(this));
    return options;
  },

  updateOptions: function (options) {
    options = this.options = Utils.deepMerge(this.options, options);
    var popupGroup, optionsChild = this.getChildOptions();
    //
    var self = this;
    var popup = options.popup;
    this.each(function (obj) {
      var child = obj.visual;
      if(child){
        self._bindPopup(child);
        child.updateOptions(optionsChild);
        popupGroup = child.popupGroup;
        popupGroup && popupGroup.updateOptions && popupGroup.updateOptions(popup);
      }
    });
    //
    this.draw();
  },

  draw: function () {
    var options = this.options;
    var cache = this.cache, obj, visual, lat, lng, d;
    var getLng = options.lng, getLat = options.lat;
    var isFilter, isFilterGroup, filter = options.filter;
    var zoom = this._map.getZoom();

    var isInView, isInZoom = this.isInZoom();
    var groups = options.groups;
    if (!isInZoom) return this.clean();
    if (!cache) return;
    if (!this.isable) return;
    var scatterOpt = this.getChildOptions();
    var map = this._map;
    for (var id in cache) {
      obj = cache[id];
      d = obj.data;
      lat = getLat(d);
      lng = getLng(d);
      isInView = this.isInView(lat, lng);
      isFilter = true;
      isFilter = filter(d, zoom);
      isFilterGroup = true;
      // if (groups && isFilter) {
      //   isFilterGroup = false;
      //   for (var i in groups) {
      //     var group = groups[i];
      //     if (group.filter(d)) {
      //       isFilterGroup = true;
      //       break;
      //     }
      //   }
      // }
      isFilter = isFilter && isFilterGroup;
      visual = obj.visual;
      if (!isInView || !isFilter) {
        if (visual) {
         visual.off && visual.off();
         visual.destroy && visual.destroy();
         delete obj.visual;
       }
      } else {
        if (visual) {
          visual.updateData(d);
          visual.updateZIndex();
        } else {
          visual = obj.visual = new ScatterMarker(scatterOpt);
          visual.addTo(map);
          visual.render(d);
          this.initEventsScatter(visual);
       }
      }
    }
  },
  updateMap: function () {
    this.draw();
  },

  updateRange: function () {
    var ds = this.cache;
    var ranges = this.ranges = this.ranges || {};
    var getValue = this.options.value;
    var value = ranges.value = [];
    for (var i in ds) {
      var d = ds[i].data;
      var v = getValue(d);
      if (!value[0]) value = [v, v];
      if (v < value[0]) value[0] = v;
      if (v > value[1]) value[1] = v;
    }
  },
  _bindPopup: function(child){
    Utils.initEventsPopup({
      parent: this,
      child: child,
      map: this._map,
      datas: [child._data],
      popup: this.options.popup,
    });
  },
  initEventsPopup: function (child) {
    var map = this._map;
    this._bindPopup(child);
    // this.each(function(obj){
    //   var scatter = obj.visual;
    //   if(!scatter) return;
    //   console.log(2);

    // }.bind(this));
    //
    map.on('zoomend', function(){
      // this.each(function(obj){
      //    var child = obj.visual;
      //   if(!child) return;
        child.updatePopupPostion();
      // });
    }.bind(this));
  },
  initEventsMap: function () {
    this._map.on('moveend', this.updateMap.bind(this));
  },
  initEventsScatter: function (scatter) {
    // scatter.on('mousedown', function(){
    //   console.log('mousedown...');
    // });
    // //
    var self = this;
    // EVENTS.push('popup-click');
    EVENTS.forEach(function(eventName){
      scatter.on(eventName, function (d) {
        // console.log(eventName);
        self.emit('child-' + eventName, d);
      });
    });
    this.initEventsPopup(scatter);

    // scatter.on('click', function(e){
    // });
    // scatter.on('popup-click', function (d) {
    //   self.emit('child-popup-click', d);
    // });
  },
  /**
   * destroy  销毁canvas
   */
  destroy: function () {
    this.clean();
    this.cache = {};
  }
})

dmap.ScatterMarkers = ScatterMarkers;
dmap.scatterMarkers = function (options) {
  return new ScatterMarkers(options);
};

module.exports = ScatterMarkers;
