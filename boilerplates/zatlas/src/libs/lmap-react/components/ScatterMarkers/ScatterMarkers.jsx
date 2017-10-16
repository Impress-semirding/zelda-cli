/*
* @Author: zhouningyi
* @Date: 2016-10-29 19:40:35
*/

import React, { Component, PropTypes } from 'react';
import Layer from 'lmap/layer/scatter_markers';
import Utils from 'lmap/core/utils';
import BaseLayer from './../../lib/BaseLayer';
import _ from 'lodash';

const applyCss = (node, css) => {
  _.forEach(css, (v, k) => {
    node.style[k] = v;
  });
}

const getColorFunc = Utils.getColorFunc;

const gradient = {
  'from': 'rgba(14,141,210,0.3)',
  'to': '#ff0096',
  'easing': 'Linear.None.1',
  'space': 'hsl'
};
  const countMin = 4;
  function getLat(d) {
    return d.lat;
  }

  function getLng(d) {
    return d.lng;
  }

  function getId(d) {
    return d.id;
  }

  function getText(d) {
    return d.text;
  }
  const rRange = {
    min: 8,
    max: 30
  };
export default class ScatterMarkers extends BaseLayer {
  static defaultProps = {
    name_cn: '点图(div)',
    options: {
    lat: getLat,
    lng: getLng,
    id: getId,
    text: getText,
    popup: {
        type: 'input',
        eventType: 'click',
        include: [{
          key: 0,
          name: '时间'
        }, {
          key: 1,
          name: '震级'
        }, {
          key: 5,
          name: '地名'
        }],
        colorValue: '#ff0096',
        colorLine: 'rgba(0,0,0,0.2)',
        colorKey: '#938c8c',
        background: 'rgba(0,0,0,0.7)',
      },
    child: {
      css: function (d, node) {
        var colorFunc = getColorFunc(gradient);
        // node = $(node);
        var degree = parseInt(d.value, 10);
        var rMin = rRange.min,
          rMax = rRange.max;
        var cMax = 7;
        var ki = Math.max(Math.min(degree / cMax, 1), 0);
        var radius = rMin + ki * ki * (rMax - rMin);
        var bgColor = colorFunc(ki);
        applyCss(node, {
          'background': bgColor,
          'left': -radius + 'px',
          'top':  -radius + 'px',
          'width': 2 * radius + 'px',
          'height': 2 * radius + 'px',
          'lineHeight': 2 * radius + 'px',
          'borderRadius': 2 * radius + 'px',
        });
        applyCss(node.parentNode, {zIndex: degree});
        if (degree > countMin) return applyCss(node, {color: '#fff'});
        applyCss(node, {color: 'transparent'});
      }
    }
  },
    data: null
  }
  _getOptions(){
    const {options} = this.state;
    return options;
  }
  _initEvents(){
    this.layer.on('child-mousedown', (d) => {
      if(this.props.onChildClick) this.props.onChildClick(d);
    })
  }
  constructor(props) {
    super(props, Layer, ScatterMarkers.defaultProps.options);
  }
}
