var Map = require('./../map/map');
var L = require('./../leaflet');
require('./edit_circle.css');
var Utils = require('bcore/utils');
var EditCircle = L.Circle.extend({
  options: {
    infoNode:{
      className: 'leaflet-edit-node no-events'
    }
  },
  initialize: function (latlng, radius, options) {
    L.Circle.prototype.initialize.call(this, latlng, radius, options);
    opt = L.setOptions(options);
    this.id = this.options.id;
  },
  addTo: function (map) {
     L.Circle.prototype.addTo.call(this, map);
     this._initEditDot();
     this.addEvents();
     this.addEventsEditDot();
     this._onMovingEnd();
     this._initInfoMarker();
     this._updateCommon();
     return this;
  },
  addEvents: function () {
    var self = this;
    var container = this._container;
    //
    container.addEventListener('mousedown', function (e) {
      self._disableMarker();
      self.isDown = true;
    })
    container.addEventListener('mousemove', self._onMoving.bind(self))
    container.addEventListener('mouseover', self._onHover.bind(self))
    container.addEventListener('mouseout', self._onMovingEnd.bind(self))
    container.addEventListener('mouseup', function (e) {
      self.isDown = false;
      if(self.infoMarker) self.infoMarker._icon.innerHTML = '';
      // e.stopPropagation();
    });
  },
  addInfo: function (info) {
    if (!info) return;
    this.info = info;
  },
  addEventsEditDot: function () {
    var self = this;
    var editRadiusDot = this.editRadiusDot;
    var container = editRadiusDot._container;
    var map = this._map;
    //
    container.addEventListener('mouseover', function(e) {
      editRadiusDot.setStyle({
        fillOpacity: 0.9
      });
      e.stopPropagation();
      L.DomEvent.stopPropagation(e);
     });
    container.addEventListener('mousedown', function(e) {
      self._initInfoMarker();
      self._disableMarker();
      self.isDotDown = true;
      e.stopPropagation();
      L.DomEvent.stopPropagation(e);
    });
    container.addEventListener('mousemove', self._onScaling.bind(self));
    container.addEventListener('mouseup', function(e) {
      self.isDotDown = false;
    });
    container.addEventListener('mouseout', function(e) {
      self._onScalingEnd();
    });
  },
  _initEditDot: function () {
    var editRadiusDot = this.editRadiusDot = L.circleMarker(this._latlng, {
      radius: 15,
      weight: 0,
      fillColor: '#0ff',
      fillOpacity: 0
    }).addTo(this._map);
    this._updateEditDotPos();
  },
  _initInfoMarker: function () {
    if(this.infoMarker) return;
    var infoNode;
    if(!(infoNode = this.options.infoNode))return;
     var icon = this.icon = L.divIcon({
      className: infoNode.className,
      html: '',
      iconSize: null
    });
    this.infoMarker = L.marker(
      this._latlng,
      {icon: icon}).addTo(this._map);
  },

  _onHover: function (e) {
    if(this.isEdit) return;
    var node = this.infoMarker._icon;
    node.setAttribute('class', 'leaflet-edit-node leaflet-edit-node-submit');
    node.innerHTML = '删除';
    this.editRadiusDot.setStyle({
      fillOpacity: 0.8
    });
    this.setStyle({
      dashArray: '12, 6',
      weight: '2',
      color: '#0ff'
    });
    e.stopPropagation();
  },

  _onMoving: function(e){
    e.stopPropagation();
    L.DomEvent.stopPropagation(e);
    if(!this.isDown) return;
    this.isEdit = true;
    this._updateCenterPos(e);
    this._updateInfoMoving();
    this.updateEditing();
  },

  _disableMarker: function () {
    var node = this.infoMarker._icon;
    node.setAttribute('class', 'leaflet-edit-node no-events');
  },

  _updateMarkerPos: function(latlng){
    this.infoMarker.setLatLng(latlng);
  },

  _updateCenterPos: function(e){//中心点的位置改变
    var map = this._map;
    var containerPoint = map.mouseEventToContainerPoint(e);
    var layerPoint = map.containerPointToLayerPoint(containerPoint);
    var latlng = map.layerPointToLatLng(layerPoint);
    this.setLatLng(latlng);
    this._updateMarkerPos(latlng);
    e.stopPropagation();
    this._updateEditDotPos();
  },
  _updateEditDotPos: function(){//改变中心点的位置
    var lngRadius = this._getLngRadius();
    var center = this._latlng;
    var lnglat = L.latLng(center.lat, center.lng + lngRadius);
    this.editRadiusDot.setLatLng(lnglat);
  },
  _onMovingEnd: function(e){
    this.isDown = false;
    if(this.isEdit) return this.updateEdited();
    this.editRadiusDot.setStyle({
      fillOpacity: 0.0
    });
    this.setStyle({
      weight: 2,
      dashArray: '',
      color: '#0ff'
    });
    e && L.DomEvent.stopPropagation(e);
    e && e.stopPropagation();
  },

  _onScaling: function(e){
    if(!this.isDotDown) return;
    this.isEdit = true;
    var editRadiusDot = this.editRadiusDot;
    var map = this._map;
    var containerPoint = map.mouseEventToContainerPoint(e),
    layerPoint = map.containerPointToLayerPoint(containerPoint);
    var latlng = map.layerPointToLatLng(layerPoint);
    editRadiusDot.setLatLng(latlng);
    var center = this._latlng;
    var radius = center.distanceTo(L.latLng(center.lat, latlng.lng));
    this.setRadius(radius);
    this._updateInfoScaling();
    e.stopPropagation();
    this.updateEditing();
  },

  _onScalingEnd: function(){
    this.isDotDown = false;
    if (this.isEdit) return this.updateEdited();
    this._updateCommon();
  },

  _updateInfoMoving: function(){
    var infoHtml =  '经度' + this._latlng.lat.toFixed(5) + ' | ' + '纬度' + this._latlng.lng.toFixed(5) ;
    this.infoMarker._icon.innerHTML = infoHtml;
  },

  _updateInfoScaling: function(){
    var infoHtml = '半径 ' + parseInt(this.getRadius()) + '米';
    this.infoMarker._icon.innerHTML = infoHtml;
  },

  _updateCommon: function(){
    this.editRadiusDot.setStyle({
      fillColor: '#0ff'
    });
    this.setStyle({
      color: '#0ff',
      dashArray: ''
    });
    var node = this.infoMarker._icon;
    node.setAttribute('class', 'leaflet-edit-node no-events');
    node.innerHTML = '';
    this._addButtonDeleteEvent();
  },
  updateEditing: function(){
  this.editRadiusDot.setStyle({
      fillColor: '#930',
    });
    this.setStyle({
      color: '#930',
      dashArray: '12, 6'
    });  
  },
  updateEdited: function(){
    this.editRadiusDot.setStyle({
      fillColor: '#930',
    });
    this.setStyle({
      color: '#930',
      dashArray: '12, 6'
    });
    if(this.infoMarker){
      var node = this.infoMarker._icon;
      node.setAttribute('class', 'leaflet-edit-node leaflet-edit-node-submit');
      node.innerHTML = this.isUploading ?'上传中..':'提交';
      this._addButtonSubmitEvent();
    }
  },
  _onOperationEnd: function(){
    if(this.isEdit) return this.updateEdited();
    this._updateCommon();
  },
  _addButtonSubmitEvent: function(){
    this.infoMarker._icon.removeEventListener('click');
    this.infoMarker._icon.addEventListener('click', this._onSubmit.bind(this));
  },
  _addButtonDeleteEvent: function(){
    this.infoMarker._icon.removeEventListener('click');
    this.infoMarker._icon.addEventListener('click', this._onDelete.bind(this));
  },
  _onDelete: function(){
    this.isUploading = true;
    this.infoMarker._icon.innerHTML = '删除中..';
    this.fire('delete');
  },
  _onSubmit: function (){
    this.isUploading = true;
    this.infoMarker._icon.innerHTML = '上传中..';
    this.fire('upload');
  },
  onCreateCallback: function (id){
    this.id = id;
    this.isUploading = false;
    this.isEdit = false;
    this.infoMarker._icon.removeEventListener('click');
    this._updateCommon();
  },
  onModifyCallback: function (id){
    this.isUploading = false;
    this.isEdit = false;
    this.infoMarker._icon.removeEventListener('click');
    this._updateCommon();
  },
  _onDeleteCallback: function (){
    this.destory();
  },
  destory: function(){
    var map = this._map;
    this.editRadiusDot && map.removeLayer(this.editRadiusDot);
    this.infoMarker && map.removeLayer(this.infoMarker);
    map.removeLayer(this);
  }
});

module.exports = EditCircle;