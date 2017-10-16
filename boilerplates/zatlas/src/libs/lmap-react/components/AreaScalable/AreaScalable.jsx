/*
* @Author: zhouningyi
* @Date: 2016-10-29 19:40:35
*/

import React, { Component, PropTypes } from 'react';
import AreaScala from './areaScalable';
import Utils     from 'bcore/utils';
import BaseLayer from './../../lib/BaseLayer';

const defaultProps = {
    name_cn: '自动缩放区域图',
    options: {
      id: (d) => d.id || d.adcode
    },
    data: null
  };

export default class AreaScalable extends BaseLayer {
  static propTypes = {
    options: PropTypes.object,
    data: PropTypes.any
  }
  static defaultProps = defaultProps;
  static contextTypes = {
    map: PropTypes.object,
  };
  constructor(props) {
    super(props, AreaScala, defaultProps);
  }
  componentDidMount(){
    const map = this.map = this.context.map;
    if (map) this._createLayer1();
    if (this.layer) this.layer.addTo(map);
    this._initEvents();
  }
  _createLayer1(){
    if(!this.layer) this.layer = new this.Layer(this._getOptions());
  }
  _initEvents(){
    const {layer, map} = this;
    const render = (id) => {
      this.props.fetchAreaCurrent({regionId:id})
      this.props.fetchAreaChildren({regionId:id})
    };
    //
    layer
    .on('child-click', function(d) {
      var p = d.data.properties;
      if (!p.parent_id) return
      render(p.region_id)
    })
    .on('change-active', (d) => {
      if (this.props.changeActive) {
        this.props.changeActive(d);
      }
    })
    //
    map
    .on('click', () => {
      var pid = layer.getParentId();
      if(!pid) return
      render(pid)
    });
  }
  _geojson(data){
    if(!data) return;
    if(!this.layer) return;
    this.layer.addId(data.regionId);
    if (data.current.geojson) {
      this.layer.renderCurrent(data.current.geojson)
    }
    if (data.children.geojson) {
      this.layer.renderChildren(data.children.geojson)
    }
  }
  _render(ds){
    if(this.layer) this.layer.renderData(ds);
  }
  render() {
    if (this.optionsNeedsUpdate) this._updateOptions();
    const {areadata, data} = this.props;
    if (!_.isEqual(areadata, this.areadata || {}) &&  areadata) {
      this.areadata = _.cloneDeep(areadata);
      this._geojson(areadata);
    }
    
    if (!_.isEqual(data, this.data || {}) || data) {
      this.data = data;
      this._render(data);
    }
    return null;
  }
}
