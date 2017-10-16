/*
* @Author: zhouningyi
* @Date: 2016-10-29 19:40:35
*/

import React, { Component, PropTypes } from 'react';
import Layer from 'lmap/layer/link_konva';
import Utils from 'lmap/core/utils';
import BaseLayer from './../../lib/BaseLayer';

// const colorF = Utils.getColorFunc({
//     from: 'rgba(8,47,173,0.9)',
//     to:   'rgba(12,255,255,0.9)',
//     easing: 'Linear.None.1.7',
//     space: 'rgb'
// });

export default class LinkKonva extends BaseLayer {
  static propTypes = {
    options: PropTypes.object,
    // data: PropTypes.array
  }
  static defaultProps = {
    name_cn: 'od图',
    options: {
      ptN: 30,
      kHeight: 0.9,
      refreshInterval: 1,
      ptNPerLayer: 1000,
      lazyFresh: {
        transition: 'opacity 0.4s'
      },
      weight:  2,
      popup: d => `流动量: ${d.count}`,
      id:  (d, i) => d.id || i ,
      color: 'rgba(0,200,255,0.5)', //(d, i) => 'rgba(0,200,255,0.5)',
      filter: d => true,
      value: d => d ? d.count: null,
      head: {
        phiWeight: 3, //箭头和粗细的比例
        phi: Math.PI / 6
      },
      from: Utils.getFrom,
      to:   Utils.getTo,
      hoverScale: 0.2,
      blending: 'source-over',
      container: '.leaflet-overlay-pane',
      child: {
      },
      pointerEvents: 'auto'
    },
    // data: null
  };
  _getOptions(){
    const options = _.cloneDeep(this.state.options);
    const {id, popup, zIndex} = options;
    if (typeof(id) === 'string')      options.id = d => d[id];
    if (typeof(popup) !== 'function') options.popup = Utils.genPopupObject(popup);
    if (typeof(zIndex) === 'string')  options.zIndex = d => d[zIndex];
    return options;
  }
  constructor(props) {
    super(props, Layer, LinkKonva.defaultProps);
  }
}
