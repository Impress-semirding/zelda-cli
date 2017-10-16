/*
* @Author: zhouningyi
* @Date: 2016-10-29 20:01:17
*/
import Event from 'bcore/event';
import Utils from 'bcore/utils';
import './index.css';
import L from 'lmap/leaflet';

const addEvent = (container, event, fn) => container.addEventListener(event, fn);
const getPos = e => {
  return {
    x: e.offsetX,
    y: e.offsetY
  };
}

const sub = (p1, p2) => ({
  x: p1.x - p2.x,
  y: p1.y - p2.y
});

const translate = p => {
  const x = p.x > 0 ? 0 : 1 * p.x;
  const y = p.y > 0 ? 0 : 1 * p.y;
  return `translate(${x}px,${y}px)`;
}

export default class Bound extends Event {
  static options = {
    bound: {
      borderColor: '#fff',
      borderWidth: '1.1',
      border: 'dashed',
    }
  }
  constructor(options){
    super();
    this.options = Utils.deepMerge(Bound.options, options);
  }
  addTo(map){
    this._map = map;
    if (this.options.isable) this.enable();
  }
  enable(){
    this._initLayer();
    this._map && this._map.dragging.disable();
    this.isable = true;
  }
  disable(){
    this._removeLayer();
    this._map && this._map.dragging.enable();
    this.isable = false;
  }
  _initLayer(){
    const map = this._map;
    if (!map) return;
    if (this.container) return;
    const container = this.container = document.createElement('div');
    container.setAttribute('class', 'lmap_bound-container');
    const parentNode = this.parentNode = map._container.parentNode;
    parentNode.appendChild(container);
    //
    this._initEvents();
  }
  _genBound(pStart, pEnd){
    if (!pStart || !pEnd) return;
    const pmin = L.point(Math.min(pStart.x, pEnd.x), Math.max(pStart.y, pEnd.y));
    const pmax = L.point(Math.max(pStart.x, pEnd.x), Math.min(pStart.y, pEnd.y));
    let screenDistance = pmin.distanceTo(pmax);
    let screenToralence = 10;
    if(screenDistance < screenToralence) return this.emit('select', {lat: {}, lng: {}});
    const map = this._map;
    if(!map) return;
    const llmin = map.containerPointToLatLng(pmin);
    const llmax = map.containerPointToLatLng(pmax);
    //
    const range = {
      lat: {
        min: llmin.lat,
        max: llmax.lat
      },
      lng: {
        min: llmin.lng,
        max: llmax.lng
      }
    };
    this.emit('select', range);
  }
  _initEvents(){
    let isdown  = false;
    let isMoved = false;
    let p, pdown;
    this._map
    .on('mousedown', (d) => {
      if(!this.isable) return;
      isdown = true;
      pdown = p = d.containerPoint;
      isMoved = false;
      this._removeBound();
      this._createBound(p);
    })
    .on('mousemove', (d) => {
      if(!this.isable) return;
      if(!isdown) return;
      isMoved = true;
      p = d.containerPoint;
      this._updateBound(sub(p, pdown));
    })
    .on('mouseup', (d) => {
      if(!this.isable) return;
      this._genBound(pdown, p);
      if (isdown) this._removeBound();
      isdown = false;
      isMoved = false;
    });
  }
  _createBound(p){
    const {borderColor, borderWidth, border} = this.options.bound;
    const boundDiv = this.boundDiv = document.createElement('div');
    boundDiv.setAttribute('class', 'lmap_bound-div');
    boundDiv.style.left = `${p.x}px`;
    boundDiv.style.top  = `${p.y}px`;
    boundDiv.style.border = `${border} ${borderWidth}px ${borderColor}`.replace('pxpx', 'px');
    //
    this.container.appendChild(boundDiv);
  }
  _updateBound(p){
    const {boundDiv} = this;
    if (!boundDiv) return;
    boundDiv.style.width  = `${Math.abs(p.x)}px`;
    boundDiv.style.height = `${Math.abs(p.y)}px`;
    boundDiv.style.transform = translate(p);
  }
  _removeBound(){
    const {boundDiv, container} = this;
    if (!boundDiv || !container) return;
    container.removeChild(boundDiv);
    this.boundDiv = null;
  }
  _removeLayer(){
    this._removeBound();
    if(!this.container) return;
    this.container.remove();
    this.container = null;
  }
  updateOptions(options){
    options = this.options = Utils.deepMerge(this.options, options);
    if(options.isable) {
      this.enable();
    } else {
      this.disable();
    }
  }
  render(){
  }
}
