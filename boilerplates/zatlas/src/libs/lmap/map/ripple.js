/**
* @Author: eason
* @Date:   2016-11-13T14:08:41+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2017-01-05T00:58:47+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/
const Utils = require('./../core/utils');

class Ripple {
  constructor(options={}){
    this.options = Utils.deepMerge(Ripple.options, options);
  }
  addTo(map){
    this._map = map;
    this.isable = true;
    this.init();
  }
  init(){
    this.initDom();
    this.initEvents();
  }
  initDom(){
    const map = this._map;
    const wrapper = this.wrapper = document.createElement('div');
    const container = map._container;
    container.appendChild(wrapper);
    Utils.applyCss(wrapper, {
      position: 'absolute',
      left: 0,
      top:  0,
      width: '100%',
      height: '100%',
      zIndex: 22222,
      pointerEvents: 'none'
    });
  }
  enable(){
    this.isable = true;
  }
  disable(){
    this.isable = false;
  }
  addRipple(e){
    const p = e.containerPoint;   
    const { maxScale } = this.options;
    const r = 4;
    const css = {
      position: 'absolute',
      left: `${p.x - r}px`,
      top:  `${p.y - r}px`,
      width:  `${2 * r}px`,
      height: `${2 * r}px`,
      borderRadius: `${r * 2}px`,
      background: 'rgb(0,255,255)',
      transition: `all 0.6s`
    };
    const div = document.createElement('div');
    Utils.applyCss(div, css);
    this.wrapper.appendChild(div);
    setTimeout(d => {
      Utils.applyCss(div, {
        transform: `scale3d(${maxScale},${maxScale},1)`,
        transformOrigin: '50% 50%',
        opacity: 0
      });
      // this.cleanAnim(div);
    });
  }
  cleanAnim(div){
    setTimeout(() => {
      this.wrapper.removeChild(div);
    }, this.options.animTime)
  }
  initEvents(){
    this._map.on('dblclick', e => this.addRipple(e));
  }
}

Ripple.options = {    
  animTime: 3000,
  maxScale: 8
}

module.exports = Ripple;
