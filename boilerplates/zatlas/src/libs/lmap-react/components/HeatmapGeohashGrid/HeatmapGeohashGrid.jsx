/*
* @Author: zhouningyi
* @Date: 2016-10-29 19:40:35
*/

import React, { Component, PropTypes } from 'react';
import Layer from 'lmap/layer/heatmap_geohash_grid';
import Utils from './../../lib/utils';
import BaseLayer from './../../lib/BaseLayer';

export default class HeatmapGeohashGrid extends BaseLayer {
  static propTypes = {
    name_cn: '热力图(geohash)',
    options: PropTypes.object,
    data: PropTypes.array
  }
  static defaultProps = {
    options: {
      container: '.leaflet-overlay-pane',
      fill: 'rgba(0, 255, 255, 0.3)',
      weight: 1,
      value: d => d.count,
      stroke: 'rgba(255,255,255,0)',
      hoverColor: '#0ff',
      geohash: d => d.geohash,
      id: d => d.geohash,
      isable: true,
      shapeNPerLayer: 5000,
      popup: d => d.geohash,
      lazyFresh: {
        transition: 'opacity 0.4s'
      },
    },
    // data: null
  };
  _getOptions(){
    const options = _.cloneDeep(this.state.options);
    return Utils.parseOptions(options);
  }
  constructor(props) {
    super(props, Layer, HeatmapGeohashGrid.defaultProps);
  }
}
