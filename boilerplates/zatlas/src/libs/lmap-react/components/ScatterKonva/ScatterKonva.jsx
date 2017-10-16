/*
* @Author: zhouningyi
* @Date: 2016-10-29 19:40:35
*/

import React, { Component, PropTypes } from 'react';
import Layer from 'lmap/layer/scatter_konva';
import Utils from 'lmap/core/utils';
import BaseLayer from './../../lib/BaseLayer';

export default class ScatterKonva extends BaseLayer {
  static defaultProps = {
    name_cn: '点图(konva)',
    options: {
      container: '.leaflet-overlay-pane',
      id: d => d.price,
      blending: 'lighter',
      lat: d => d.lat || 0,
      lng: d => d.lng || 0,
      size: 10,
      sprite: {
        drawN: 1.15,
        color: {
          from: 'rgba(245,230,0,1)',
          to: 'rgba(205,0,0, 0.6)',
          easing: 'Linear.None.1.7',
          space: 'rgb'
        }
      },
      filter: () => true
    },
    data: null
  }
  _getOptions(){
    let options = _.cloneDeep(this.state.options);
    const {popup, lat, lng} = options;
    if (lat === 'ba') options.lat = Utils.getLatBA;
    if (lng === 'ba') options.lng = Utils.getLngBA;
    options.popup = Utils.genPopupObject(popup);
    return options;
  }
  constructor(props) {
    super(props, Layer, ScatterKonva.defaultProps);
  }
}
