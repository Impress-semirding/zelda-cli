
var Popup = require('./../plugins/popup');
var Utils = require('bcore/utils');
const _ = require('lodash');

//对象生成popup
function parseContent(ds, colorImportant, colorNormal){
  colorImportant = colorImportant || '#0cc';
  colorNormal = colorNormal || '#bbb';
  var content = '';
  var d, line, styl;
  var style = 'display:inline-block;white-space:nowrap;';
  var stylNormal = style + 'color:' + colorNormal + ';margin-right:5px;';
  var stylImportant = style + 'color:' + colorImportant + ';font-weight:normal';
  if(Array.isArray(ds)){
    ds.forEach(function(d, k){
      if(typeof(d) == 'string'){
        line = '<a style="' + stylImportant + '">'+ d + '</a><br>';
        content += line;
      }
    });
  } else if(typeof(ds) === 'object') {
    for(var k in ds){
      var d = ds[k];
      if(typeof(d) === 'string'){
        line = '<a style="' + stylNormal + '">' + k + ': </a><a style="' + stylImportant + '">'+ d + '</a><br>';
        content += line;
      }
    }
  }
  return content;
}


function isLatlng(arr) {
  if (typeof (arr[0]) === 'object') return false;
  return true;
}

function isNone(d) {
  return d === undefined;
}

function getBBoxCoords(coords, bbox) {
  bbox = bbox || {};
  var lat, lng;
  coords.forEach(function (arr) {
    if (isLatlng(arr)) {
      var lng = arr[0], lat = arr[1];
      bbox.latMax = Math.max(bbox.latMax || lat, lat);
      bbox.lngMax = Math.max(bbox.lngMax || lng, lng);
      bbox.latMin = Math.min(bbox.latMin || lat, lat);
      bbox.lngMin = Math.min(bbox.lngMin || lng, lng);
    } else {
      getBBoxCoords(arr, bbox);
    }
  });
  return bbox;
}


function getBBoxFeatures(features) {
  var result = {};
  features.forEach(function (feature) {
    var coords = feature.geometry.coordinates;
    var bbox = getBBoxCoords(coords);
    result.latMax = Math.max(result.latMax || bbox.latMax, bbox.latMax);
    result.lngMax = Math.max(result.lngMax || bbox.lngMax, bbox.lngMax);
    result.latMin = Math.min(result.latMin || bbox.latMin, bbox.latMin);
    result.lngMin = Math.min(result.lngMin || bbox.lngMin, bbox.lngMin);
  });
  return result;
}

function getBBox(data) {
  if (data.features) return getBBoxFeatures(data.features);
  if (data.type && data.type.toLowerCase() === 'feature') {
    var geometry = data.geometry;
    if (!geometry) return;
    var coords = geometry.coordinates;
    if (!coords) return;
    return getBBoxCoords(coords);
  }
}

function getTopPointCoords(coords, pt) {
  pt = pt || [];
  var lat, lng;
  coords.forEach(function (arr) {
    if (isLatlng(arr)) {
      var lng = arr[0], lat = arr[1];
      if (pt[0] === undefined || pt[0] === null) pt = arr;
      if (lat > pt[1]) {
        pt[0] = arr[0];
        pt[1] = arr[1];
      }
    } else {
      pt = getTopPointCoords(arr, pt);
    }
  });
  return pt;
}

function getTopPointFeatures(features){
  var pt = getTopPointCoords(features.map(function(feature) {
    return getTopPointCoords(feature.geometry.coordinates);
  }));
  return pt;
}

function getTopPoint(data) {
  if (data.features) return getTopPointFeatures(data.features);
  if (data.type && data.type.toLowerCase() === 'feature') {
    var geometry = data.geometry;
    if (!geometry) return;
    var coords = geometry.coordinates;
    if (!coords) return;
    return getTopPointCoords(coords);
  }
  return getTopPointCoords(data);
}



///////////popup相关///////////////
function getPopupGroup(popup, container, data, data2) {
  var popupType = typeof (popup);
  //
  if (popupType === 'function') {
    var str = popup(data, data2);
    if (typeof (str) === 'string' || typeof (str) === 'number') {
      return container.innerHTML = str;
    } else {
      return str;
    }
  }
  //
  if (popupType === 'string' || popupType === 'number') {
    return container.innerHTML = popup;
  }
  //
  if (popupType === 'object') {
    var pp = new Popup(container, popup);
    pp.render(data);
    return pp;
  }
}

function initEventsPopup(opt) {
  if(!opt) return;
  var parent = opt.parent, child = opt.child, map = opt.map, datas = opt.datas, popupOption = opt.popup;
  if (!map) return console.log('map  缺少...');
  if (!datas) return console.log('datas 缺少...');
  if(!popupOption) return;
  var eventName = popupOption.eventType || 'click';
  var data = datas[0];
  var data1 = datas[1];
  //
  child
  .off(eventName)
  .on(eventName, function (e) {
    var latlng = child.popupPosition || e.latlng;
    map.openPopup(popup, latlng);
    var popup = map._popup;
    if (popupOption) {
      var container = popup._container.getElementsByClassName('leaflet-popup-content')[0];
      var popupGroup = child.popupGroup = getPopupGroup(popupOption, container, data, data1);
      setTimeout(function () {
        popup._updateLayout();
        popup._updatePosition();
      });
      if (typeof (popupGroup) !== 'object') return;
      popupGroup.on(eventName, function (d) {
        (child.emit || child.fire).bind(child)('popup-' + eventName, d);
        (parent.emit || parent.fire).bind(parent)('child-popup-' + eventName, d);
      });
    }
  });
}

function createContainer(container, styles={ position: 'absolute', left: '0%', top: '0%'}){
  var container = Utils.getContainer(container);
  var con = document.createElement('div');
  con.style.width = con.style.height = '100%';
  _.forEach(styles, (v, k) => {
    container.style[k] = v;
  })
  container.appendChild(con);
  return con;
}

module.exports = {
  parseContent: parseContent,
  getTopPoint: getTopPoint,
  getBBox: getBBox,
  // getPopup: getPopup,
  initEventsPopup: initEventsPopup,
  createContainer: createContainer
};
