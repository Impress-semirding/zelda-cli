/*
* @Author: zhouningyi
* @Date: 2016-10-29 20:01:17
*/

import React, { Component, PropTypes } from 'react';
import config     from './config';
import Filter     from 'lmap/plugins/filter/tilelayer';
import LTileLayer from 'lmap/layer/tilelayer';
import { TileLayer as TLayer} from 'leaflet';
import Utils      from './../../lib/utils';
import BaseLayer  from './../../lib/BaseLayer';
import _          from 'lodash';
import validation from './validation';

export default class TileLayer extends BaseLayer {
  static propTypes = {
    options: PropTypes.object
  }
  static defaultProps = {
    comType: 'childComponent',
    validation,
    name_cn: '瓦片层',
    options: {
      type: 'amapwhite',
      // filter: {
      //   opacity: .5
      // }
    }
  }
  static contextTypes = {
    map: PropTypes.object,
  }

  // XXX(disoul) bundle 代码获取组建名称
  static componentName = 'TileLayer'

  constructor(props) {
    super(props, LTileLayer, TileLayer.defaultProps);
    this.state = {
      options: Utils.deepMerge(TileLayer.defaultProps.options, this.props.options),
      globalAlpha: 1
    };
  }
  _render(){
    this._createLayer();
  }
  _updateOptions(){
    const {options} = this.state;
    if (options.hidden) {
      this.globalAlpha = 0.1;
    } else {
      this.globalAlpha = this.state.globalAlpha;
    }

    const tileO = config[options.type];
    const filterFinal = Object.assign({}, tileO.filter, options.filter || { opacity: this.globalAlpha });
    if(!tileO) return;
    const tileType = tileO.layer || tileO.id;
    if (this.layer && tileType !== this.curTileType) this.layer.update(tileType);
    if (this.filter) this.filter.updateOptions(filterFinal);
    this.curTileType = tileType;
  }
  hide(){
    const alpha = 0.0001;
    this.state.globalAlpha = alpha;
    this.setState({
      globalAlpha: alpha
    });
  }
  show(){
    this.setState({
      globalAlpha: 1
    });
  }
  componentWillUnmount(){
    this.layer._container.remove();
  }
  _createLayer(){
    const {options, globalAlpha} = this.state;
    const tileO = config[options.type];
    if(!tileO) return;
    const tileType = tileO.layer || tileO.id;
    const filterFinal = Object.assign({}, tileO.filter, options.filter || {}, { opacity: this.globalAlpha });
    //更新的情况
    if (this.curTileType) {
      if (this.layer && tileType !== this.curTileType){
        this.layer.update(tileType);
      }
      if (this.filter) this.filter.updateOptions(filterFinal);
      this.curTileType = tileType;
      return;
    } else { //初始化的情况
      const layer = this.layer = new LTileLayer(tileType);
      this.curTileType = tileType;
      clearTimeout(this.loopid);
      this.loopid = setTimeout(() => {
        this.filter = new Filter(layer, {...filterFinal, opacity: this.globalAlpha });
      });
    }
  }
}

// const layer = this.layer = new TLayer('//webrd03.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}&ldmap=8630347');
