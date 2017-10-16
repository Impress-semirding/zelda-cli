/*
* @Author: zhouningyi
* @Date: 2016-10-29 19:40:35
*/

import React, { Component, PropTypes } from 'react';
import LinesKonvaL from 'lmap/layer/lines_konva';
import Utils     from 'bcore/utils';
import BaseLayer from './../../lib/BaseLayer';

const defaultProps = {
    name_cn: '路线图',
    options: {
      id: (d) => d.id || d.adcode
    },
    data: null
  };

export default class LinesKonva extends BaseLayer {
  static propTypes = {
    options: PropTypes.object,
    data: PropTypes.any,
    geojson: PropTypes.object,
  }
  static defaultProps = defaultProps;
  static contextTypes = {
    map: PropTypes.object,
  };
  constructor(props) {
    super(props, LinesKonvaL, defaultProps);
  }
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
  _updateLayer(){
    if (this.optionsNeedsUpdate)  this._updateOptions();
    if (this.geojsonNeedsUpdate)  this._geojson();
    if (this.dataNeedsUpdate)     setTimeout(d => this._render());
  }
  _geojson(){
    const {geojson} = this.props;
    if (!geojson || !this.layer || !geojson.type || !geojson.type.toLowerCase() === 'featurecollection') return;
    this.layer.geojson(geojson);
    this.layer.draw();
    this.geojsonNeedsUpdate = false;
  }
  // _render(ds){
  //   if(this.layer) this.layer.renderData(ds);
  // }
  // render() {
  //   const {areadata, data} = this.props;
  //   if (!_.isEqual(areadata, this.areadata || {}) &&  areadata) {
  //     this.areadata = _.cloneDeep(areadata);
  //     this._geojson(areadata);
  //   }

  //   if (!_.isEqual(data, this.data || {}) || data) {
  //     this.data = data;
  //     this._render(data);
  //   }
  //   return null;
  // }
}
