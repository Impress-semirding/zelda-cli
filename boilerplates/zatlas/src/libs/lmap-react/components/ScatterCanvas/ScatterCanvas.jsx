/*
* @Author: zhouningyi
* @Date: 2016-10-29 19:40:35
*/

import React, { Component, PropTypes } from 'react';
import Layer from 'lmap/layer/scatter_canvas';
import Utils from './../../lib/utils';
import BaseLayer from './../../lib/BaseLayer';
import validation from './validation';
export default class ScatterCanvas extends BaseLayer {
  static propTypes = {
    options: PropTypes.object,
    // data: PropTypes.array
  }
  static defaultProps = {
    name_cn: '点图(canvas)',
    validation,
    options: {
      id: (d) => {
        const id = d.id || d.amap_id;
        return id;
      },
      container: 'overlayPane',
      size: 5,
      blending: 'lighter',
      filter: d => true,
      sprite: {
        drawN: 1.15,
        color: {
          from: 'rgba(245,230,0,1)',
          to: 'rgba(205, 0, 0, 0.6)',
          easing: 'Linear.None.1.7',
          space: 'rgb'
        }
      },
    },
    // data: null
  }
  constructor(props) {
    super(props, Layer, ScatterCanvas.defaultProps);
  }
  _getOptions(){
    const options = _.cloneDeep(this.state.options);
    return Utils.parseOptions(options);
  }
}
