var Utils = require('aliyun-map-utils');
var LUtils = require('./l_utils');
var L = require('./../leaflet');
var dmap = L.dmap = L.dmap || {};
var $ = require('jquery');
var projection = require('./projection');
var CurveUtils = require('./curve_util');
var _ = require('lodash');

var EVENTS = ['mouseout', 'mousedown', 'mouseover', 'mouseout', 'touchstart', 'touchend', 'touchup', 'click'];
var EVENTSBasic = ['click', 'mouseover', 'mouseout', 'mousedown'];

function getId(type){
  var num = Math.floor(Math.random() * 10000000);
  var time = new Date().getTime();
  return type + '_' + time + '_' + num;
}

function getPt(e, node) { //获取点相对于容器的位置
    if (!node) node = $(e.target);
    node = $(node);
    var nodeW = node.width();
    var nodeH = node.height();
    var offset = node.offset();
    var left = offset.left;
    var top = offset.top;
    var x, y;
    if (e.type.indexOf('mouse') !== -1) {
      x = e.x || e.pageX;
      y = e.y || e.pageY;
      return [x - left, y - top];
    }
    var touch = window.event.touches[0];
    x = touch.pageX - left;
    y = touch.pageY - top;
    x = (x < nodeW) ? x : nodeW;
    x = (x > 0) ? x : 1;
    y = (y < nodeH) ? y : nodeH;
    y = (y > 0) ? y : 1;
    return [x, y];
  };

function getFrom(d){
    if(d.fromLat && d.fromLng) return {
      lat: d.fromLat,
      lng: d.fromLng
    };
    if(d.from){
      var from  = d.from;
      if(typeof(from) === 'string'){
        if(from.indexOf(',') !== -1) {
          from = from.split(',')[1];
          return {
            lat: from[1],
            lng: from[0]
          };
        }
      }
      return from;
    }
  }

  function getTo(d){
    if(d.toLat && d.toLng) return {
      lat: d.toLat,
      lng: d.toLng
    };
    if(d.to){
      var to  = d.to;
      if(typeof(to) === 'string'){
        if(to.indexOf(',') !== -1) {
          to = to.split(',')[1];
          return {
            lat: to[1],
            lng: to[0]
          };
        }
      }
      return to;
    }
  }

function  geodesicArea (latLngs) {
    var pointsCount = latLngs.length,
      area = 0.0,
      d2r = L.LatLng.DEG_TO_RAD,
      p1, p2;

    if (pointsCount > 2) {
      for (var i = 0; i < pointsCount; i++) {
        p1 = latLngs[i];
        p2 = latLngs[(i + 1) % pointsCount];
        area += ((p2.lng - p1.lng) * d2r) *
            (2 + Math.sin(p1.lat * d2r) + Math.sin(p2.lat * d2r));
      }
      area = area * 6378137.0 * 6378137.0 / 2.0;
    }

    return Math.abs(area);
  };
function getLengthPolyline(latLngs){
  var dist = 0;
  var latlngP;
  var N = latLngs.length;
  for(var i = 0; i<N; i++){
    var next = (i + 1) % N;
    dist += latLngs[i].distanceTo(latLngs[next]);
  }
  return dist;
}

function fireEvent(name, e, self){
  var layer = e.target;
  var data = layer.__data;
  var event = 'child-' + name;
  self.fire(event, {
    layer: layer,
    data: data
  });
}

function getValue(f, a, b, c, d) {
  if (typeof(f) === 'function') return f(a, b, c, d);
  return f;
}

function applyCss(node, css) {
  if (!node) return console.log('节点不存在');
  for (var k in css) {
    node.style[k] = css[k];
  }
}

var kStyle = 'margin-right:5px; color:#999;white-space:nowrap; display:inline-block;';
var vStyle = 'white-space:nowrap;color:#fff;display:inline-block;font-weight:bold;text-decoration:none;';

function pretty(v) {
  if(!v) return '';
  if (typeof (v) === 'number') v = v.toString();
  if (v.length > 20) return v.substring(0, 20);
  return v;
}

function isURL(str){
  if(typeof(str)!== 'string') return false;
  var ks = ['http\:\/\/', 'https\:\/\/', 'www\.'];
  for(var i in ks){
    if(str.indexOf(ks[i]) !== -1) return true;
  }
}

function getPopupLine(v, k, isArray, options) {
  var url;
  if(isURL(v)){
    url = v;
  } else {
    v = pretty(v);
  }

  if (isArray){
    if (url){
      return  '<a href="' + url + '">点击查看</a><br>';
    }  else {
      return '<div>' + v + '</div><br>';
    }
  }

  if (url) return '<div style="' + kStyle + '">\
              <div style="' + kStyle + '">' + k + ': </div>\
              <a target="_Blank" style="' + vStyle + '" href="' + url + '">『点击查看』</a>\
            </div><br>';

  return '<div style="' + kStyle + '">\
            <div style="' + kStyle + '">' + k + ': </div>\
            <a style="' + vStyle + '">' + v + '</a>\
          </div><br>';
}

function toFixed (num, digit) {
  if(!digit) return num;
  if(num === 0) return '0';
  if(num && num.toString() && num.toString().indexOf('.') === -1) return num;
  return num.toFixed(digit);
};

function numberFormater (num, digit) {
  digit = digit || 2;
  if (num < 10000) return toFixed(num, digit);
  if (num < 10000 * 10000) return `${toFixed(num / 10000, digit)} 万` ;
  return `${toFixed(num / 100000000, digit)} 亿`;
};


function popupFromObject(obj, options){
  const isArray = (typeof(obj) === 'array');
  let v, html = '';
  for (let i in obj) {
    v = obj[i];
    if (typeof(v) === 'object') continue;
    if (typeof(v) === 'number') v = numberFormater(v, 2); // || !isNaN(parseFloat(v))
    html += getPopupLine(v, i, isArray, options);
  }
  return html;
}


const cleanObjectNull = (o) => {
  let v;
  for (let k in o) {
    v = o[k];
    if (v === null || v === undefined || v === '') delete o[k];
    if (isNaN(v) && typeof(v) === 'number') delete o[k];
  }
  return o;
}

function genPopupFromObject(list, options){
  return function(obj){
    var result = {};
    for(var k in list){
      var key = list[k];
      if(key in obj){
        result[key] = obj[key];
      }
    }
    return popupFromObject(result, options);
  }
}

function genPopupObject(popup) {
  return (a, b) => {
    let geo, d, properties;
    if (a && b && a.properties) {
      geo = a;
      properties = geo.properties;
      d = b;
    } else {
      d = a;
    }
    let result = {}, v;
    _.forEach(popup, (k, name) => {
      if (properties) v = properties[k];
      if (d) v = d[k] || v;
      result[name] =  v;
    });
    return Utils.popupFromObject(cleanObjectNull(result));
  };
}

// function genPopupObject(popup) {
//   return (geo, d) => {
//     d = d || {}
//     let result = {};
//     _.forEach(popup, (k, name) => {
//       result[name] = d[k];
//     });
//     return Utils.popupFromObject(result);
//   };
// }

function getLatBA(d){
  var lat = Utils.getLat(d);
  var lng = Utils.getLng(d);
  if(!lat || !lng) return;
  const latnew = projection.BD092GCJ(lat, lng).lat;
  return latnew;
}

function getLngBA(d){
  var lat = Utils.getLat(d);
  var lng = Utils.getLng(d);
  if(!lat || !lng) return;
  return projection.BD092GCJ(lat, lng).lng;
}

function getLatWA(d){
  var lat = Utils.getLat(d);
  var lng = Utils.getLng(d);
  if(!lat || !lng) return;
  return projection.WGS2GCJ(lat, lng).lat;
}

function getLngWA(d){
  var lat = Utils.getLat(d);
  var lng = Utils.getLng(d);
  if(!lat || !lng) return;
  return projection.WGS2GCJ(lat, lng).lng;
}


function getLatAB(d){
  var lat = Utils.getLat(d);
  var lng = Utils.getLng(d);
  if(!lat || !lng) return;
  return projection.GCJ2BD09(lat, lng).lat;
}

function getLngAB(d){
  var lat = Utils.getLat(d);
  var lng = Utils.getLng(d);
  if(!lat || !lng) return;
  return projection.GCJ2BD09(lat, lng).lng;
}

function map(v, min, max, vmin, vmax){ // 映射函数
  vmin = vmin || 0, vmax = (vmax === null || vmax === undefined) ? 1:vmax;
  var d =(max - min) || 0.001
  var k = (Math.max(min, Math.min(max, v))- min) / d;
  return vmin + k * (vmax - vmin);
}

function isNumber(d){
  if(d===null || d === undefined || isNaN(d)) return false;
  return typeof +d === 'number';
}

function getRange(ds, getValue) {
  var min = getValue(ds[0]);
  var max = min;
  var v;
  var tp = typeof(getValue);
  if (tp === 'function') {
    ds.forEach(function(d, i) {
      v = getValue(d, i);
      if (!isNumber(v)) return;
      min = Math.min(v, min);
      max = Math.max(v, max);
    });
  } else if (tp === 'string') {
    ds.forEach(function(d, i) {
      v = d[getValue];
      if (!isNumber(v)) return;
      min = Math.min(v, min);
      max = Math.max(v, max);
    });
  }
  return {
    min: min,
    max: max
  };
}
const isNull = d => {
  return (typeof (d) === 'number') ? d === null || d === undefined || isNaN(d) : false;
};
function getRangePercentTile(ds, key, percent){
  if(!ds || !ds.length) return {};
  percent = percent  || 0.05;
  const getValue = typeof(key) === 'function' ? key : d => d[key];
  ds = _.filter(ds, d => !isNull(getValue(d)));
  ds = _.sortBy(ds, d => parseFloat(getValue(d), 10));
  const p1 = Math.floor(percent * ds.length), p2 = Math.floor((1 - percent) * ds.length);
  const v1 = getValue(ds[p1]);
  const v2 = getValue(ds[p2]);
  return {
    min: Math.min(v1, v2),
    max: Math.max(v1, v2)
  };
}
module.exports = dmap.Utils = Utils.merge(Utils, projection, CurveUtils, LUtils, {
  getRangePercentTile,
  getLngBA,
  getLatBA,
  getLngAB,
  getLatAB,
  getLngWA,
  getLatWA,
  getFrom,
  getTo,
  getId,
  getPt,
  getRange,
  geodesicArea,
  getLengthPolyline,
  genPopupFromObject,
  // genPopupAreas,
  popupFromObject,
  genPopupObject,
  fireEvent,
  getValue,
  applyCss,
  EVENTS,
  EVENTSBasic,
  numberFormater,
  map
});
