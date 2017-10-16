/*
* @Author: zhouningyi
* @Date: 2016-10-29 19:40:35
*/

import React, { Component, PropTypes } from 'react';
import AreaL from 'lmap/layer/areas';
import Utils from './../../lib/utils';
import BaseLayer from './../../lib/BaseLayer';
import _ from 'lodash';
import validation from './validation';
import binding    from './binding';

export default class Area extends BaseLayer {
  static propTypes = {
    options: PropTypes.object,
    // data:    PropTypes.array,
    geojson: PropTypes.object,
    feedings: PropTypes.object,
  }
  static defaultProps = {
    name_cn: '区域热力图',
    options: AreaL.options,
    validation,
    binding,
    feedings: {
      geoid: 'id',
      id: 'id',
      value: 'count'
    }
  };
  componentWillUpdate(newProps){
    //数据对比
    const newData    = newProps.data;
    if (! _.isEqual(newData, this.props.data)) this.dataNeedsUpdate = true;
    //
    const newGeojson = newProps.geojson;
    if (!_.isEqual(newGeojson, this.props.geojson)) this.geojsonNeedsUpdate = true;
    //配置对比
    const oldOptions = Utils.deepMerge({}, this.props.options);
    const newOptions = Utils.deepMerge(oldOptions, newProps.options);
    if (! _.isEqual(newOptions, oldOptions)) {
      this.state.options = newOptions;
      this.optionsNeedsUpdate = true;
    }
  }
  _geojson(){
    const {geojson} = this.props;
    if (!geojson || !this.layer || !geojson.type || !geojson.type.toLowerCase() === 'featurecollection') return;
    this.layer.geoJson(geojson);
    // setTimeout(() => this.layer.draw(), 1000)
    this.layer.draw();
    this.geojsonNeedsUpdate = false;
  }
  render() {
    this._updateLayer();
    return null;
  }
  _updateLayer(){
    if (this.optionsNeedsUpdate)  this._updateOptions();
    if (this.geojsonNeedsUpdate)  this._geojson();
    if (this.dataNeedsUpdate)     setTimeout(d => this._render());
  }
  componentDidUpdate(){
    // this._updateLayer();
  }
  _getOptions(){
    const options = this.parseOptions(this.state.options);
    const { fillColor } = options.style;
    options.style.fillColor = (v, min, max) => {
      if (!v) return 'rgba(0,0,0,0.1)';
      const ki = (v - min) / (max - min);
      return fillColor(ki);
    }
    return options;
  }
  constructor(props) {
    super(props, AreaL, Area.defaultProps);
  }
}
