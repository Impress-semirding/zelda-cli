/*
* @Author: zhouningyi
* @Date: 2016-10-29 19:40:35
*/

import React, { Component, PropTypes } from 'react';
import Layer from 'lmap/layer/scatter_konva';
import Utils from './../../lib/utils';
import BaseLayer from './../../lib/BaseLayer';
import LUtils from 'lmap/core/utils';
import _ from 'lodash';
import datas from './datas';
import validation from './validation';
import binding    from './binding';

const genSprite = (cfunc) => {
  return d => {
    const color = cfunc ? cfunc(d): 'rgba(0,200,200,0.2)';
    const o = {
      'width': 150,
      'height': 150,
      'drawN': 1,
      'type': 'radian',
      'color': {
        'from': color, //'rgba(255,255,255,0.18)',
        'to':   color,
        'easing': 'Linear.None.1.7',
        'space': 'hsl'
      }
    };
    return LUtils.getSprite(o);
  }
}

const genGetFunc = (k, i) => {
  if(typeof(k) === 'function') return k
  return d => d[k];
};


export default class ScatterKonvaPlain extends BaseLayer {
  static defaultProps = {
    comType: 'childComponent',
    name_cn: '散点图',
    validation,
    binding,
    datas,
    options: {
      container: '.leaflet-overlay-pane',
      id: d => Utils.getFeedingValue(d, 'id', d.feeding),
      blending: 'lighter',
      lat: d => Utils.getFeedingValue(d, 'lat', d.feeding) || 0,
      lng: d => Utils.getFeedingValue(d, 'lng', d.feeding) || 0,
      size: 10,
      color: 'rgba(0,255,0,0.5)',
      filter: () => true,
    },
    events: {
    },
    data: null
  }

  // XXX(disoul) bundle 代码获取组建名称
  static componentName = 'ScatterKonvaPlain'

  constructor(props) {
    super(props, Layer, ScatterKonvaPlain.defaultProps);
  }

  _getOptions(){
    let options = _.cloneDeep(this.state.options);
    if (this.props.data && this.props.data.data && this.props.data.data.mock) {
      this.setState({ mock: true });
      options = { ...ScatterKonvaPlain.defaultProps.options, ...this.props.data.data.option };
    }
    options.hidden = this.state.options.hidden;
    const { color } = options;
    delete options.color;
    options.sprite = (typeof(color) === 'string') ? genSprite(d => color) : genSprite(color);
    // options = this.parseOptions(options);
    return options;
  }
  render () {
    return super.render();
  }
}
