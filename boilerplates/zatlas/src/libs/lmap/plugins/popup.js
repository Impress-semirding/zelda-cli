'use strict';

/**
 * @class Popup
 */
var L = require('./../leaflet');
var Utils = require('bcore/utils');
var Event = require('bcore/event');

require('./popup.css');


function Popup(container, options) {
  this.container = Utils.getContainer(container);
  options = arguments[arguments.length - 1];
  this.options = Utils.deepMerge(Popup.options, options);
}


function eachNode(nodes, fn) {
  var node;
  for (var i = 0; i < nodes.length; i++) {
    node = nodes[i];
    if (!node.style) continue;
    fn(node);
  }
}

Popup.options = {
  type: 'list',
  // include: [{
  //   key: 'value',
  //   name: '值'
  // }],
  colorValue: '#00ffe1',
  colorLine: 'rgba(0,0,0,0.2)',
  colorKey: '#938c8c',
  background: 'rgba(20,20,20,0.4)',
  limitName: 8,
  limitValue: 15
};

Popup = Event.extend(Popup, {
  bindTo: function(layer){

  },
  updateStyle: function () {
    var options = this.options;
    var container = this.container;
    var parent = container.parentNode;
    var tip = parent.nextSibling.getElementsByClassName('leaflet-popup-tip')[0];
    parent.style.background = tip.style.background = options.background;
    eachNode(container.getElementsByClassName('leaflet-popup-line'), function (node) {
      node.style.color = options.colorKey;
    });
    eachNode(container.getElementsByClassName('leaflet-popup-name'), function (node) {
      node.style.color = options.colorKey;
    });
    eachNode(container.getElementsByClassName('leaflet-popup-value'), function (node) {
      node.style.color = options.colorValue;
    });
  },
  data: function (data) {
    this._data = data;
  },
  render: function (data) {
    if (data) this.data(data);
    this.draw();
    this.updateStyle();
    this.initEvents();
  },
  getIncludeDefault: function (d) {
    var d, result = [];
    for (var j in d) {
      result.push({
        key: j
      });
    }
    return result;
  },
  draw: function () {
    var ds = this._data;
    var self = this;
    var include = this.options.include || this.getIncludeDefault(ds);
    var html = '';
    include.forEach(function (obj) {
      var key = obj.key;
      var name = obj.name || key;
      var value = ds[key];
      if (value) html += self.getHTML(value, name, key);
    });
    this.container.style.width = 'auto'
    this.container.innerHTML = html;
  },
  getHTML: function (value, name, key) {
    var options = this.options;
    var type = this.options.type || 'list';
    if (type === 'record') return getPopupRecord(value, name, key, options.limitName, options.limitValue);
    if (type === 'input') return getPopupInput(value, name, key, options.limitName, options.limitValue);
    // if (type === 'list'){
    //   if(Utils.getLineHtml){
    //     return Utils.getLineHtml(value, name, key, options.limitName, options.limitValue);
    //   }
    // }  
    return getPopupRecord(value, name, key, options.limitName, options.limitValue);
  },
  initEvents: function(){
    var type = this.options.type || 'list';
     if (type === 'record') return this.initEventsLine();
     if (type === 'input') return this.initEventsInput();
     if (type === 'list') return this.initEventsLine();
     this.initEventsLine();
  },
  initEventsLine: function () {
    var nodes = this.container.getElementsByClassName('leaflet-popup-line');
    var self = this;
    var EVENTS = ['click'];
    EVENTS.forEach(function (eventName) {
      eachNode(nodes, function (node) {
        node.addEventListener(eventName, function () {
          var id = node.getAttribute('id');
          self.emit(eventName, {
            id: id,
            data: self._data,
            layer: self
          });
        });
      });
    });
  },
  initEventsInput: function () {
  },
  updateOptions: function (options) {
    this.options = Utils.deepMerge(this.options, options);
    this.updateStyle();
  }
});


function pretty(v, maxLength) {
  maxLength = maxLength || 10;
  if (typeof (v) === 'number') v = v.toString();
  if (v.length > maxLength) return v.substring(0, maxLength);
  return v;
}

function getPopupRecord(value, name, key, limitName, limitValue) {
  value = pretty(value, limitValue);
  name = pretty(name, limitName);
  return '<div class="leaflet-popup-line" id="' + key + '">\
            <div class="leaflet-popup-name">' + name + ': </div>\
            <a href="#' + value + '" class="leaflet-popup-value">' + value + '</a>\
          </div>';
}


function getPopupInput(value, name, key, limitName, limitValue) {
  value = pretty(value, limitValue);
  name = pretty(name, limitName);
  return '<div class="leaflet-popup-line" id="' + key + '">\
            <div class="leaflet-popup-name">' + name + ': </div>\
            <input placeholder="' + value + '" class="leaflet-popup-value" value="' + value + '"></input>\
          </div>';
}


var dmap = L.dmap = L.dmap || {};
dmap.Popup = Popup;
dmap.popup = function (options) {
  return Popup(options);
};

module.exports = Popup;
