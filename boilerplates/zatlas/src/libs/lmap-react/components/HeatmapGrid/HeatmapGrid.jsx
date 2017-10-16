/*
* @Author: zhouningyi
* @Date: 2016-10-29 19:40:35
*/

import React, { Component, PropTypes } from 'react';
import Layer from 'lmap/layer/heatmap_grid_new';
import Utils from './../../lib/utils';
import BaseLayer from './../../lib/BaseLayer';

var range = {
  min: 10000,
  max: 90000
};


function toFixed (num, digit) {
  if(!digit) return num;
  if(num === 0) return '0';
  return num.toFixed(digit);
};


function numberFormater (num, digit) {
  digit = digit || 2;
  if (num < 10000) return toFixed(num, digit);
  if (num < 10000 * 10000) return `${toFixed(num / 10000, digit)} 万` ;
  return `${toFixed(num / 100000000, digit)} 亿`;
};

function getAvg(ds, key, count) {
  let v, areas = 0, total = 0;
  ds.forEach(d => {
    const count = d[count] || 1;
    v = d[key];
    if (v === null || v === undefined) return;
    total += count * d[key];
    areas += count;
  });

  let value = total / areas;
  // if (range) return Math.min(range.max, Math.max(range.min, v))
  return value;
}

export default class HeatmapGrid extends BaseLayer {
  static propTypes = {
    options: PropTypes.object,
    data: PropTypes.array
  }
  static defaultProps = {
    name_cn: '热力图(网格)',
    options: {
      shape: {
        type: 'hex',
        scale: (d) => Math.pow(d, 0.4) * 0.95,
        rx: 10,
        ry: 9
      },
      value: 'price',
      count: null,
      color: {
        from: 'rgba(0,7,0,0.3)',
        to: 'rgba(248,248,15,0.8)',
        space: 'rgb',
        easing: 'linear.Out.1.9'
      },
    },
    // data: null
  };
  _getOptions(){
    const options = _.cloneDeep(this.state.options);
    const {count, value} = options;
    delete options.count;
    delete options.value;
    options.value = (ds) => getAvg(ds, value, count);
    options.popup = (ds, layer) => {
      return Utils.popupFromObject({
        '数值': numberFormater(getAvg(ds, value, count)),
        '面积': (Utils.geodesicArea(layer._latlngs) / 1000 / 1000).toFixed(2) + 'km²',
        '样本数': ds.length + '个'
      })
    };
    return Utils.parseOptions(options);
  }
  constructor(props) {
    super(props, Layer, HeatmapGrid.defaultProps);
  }
}
