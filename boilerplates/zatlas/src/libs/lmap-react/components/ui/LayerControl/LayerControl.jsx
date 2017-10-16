/*
* @Author: zhouningyi
* @Date: 2016-10-29 20:01:17
*/
console.log('LayerControl...');
import React, { Component, PropTypes } from 'react';
import BaseLayer from './../../../lib/BaseLayer';
import _          from 'lodash';
import {fade} from 'material-ui/utils/colorManipulator';

const Utils = require('bcore/utils');

function getStyles(props, state, context){
  console.log(context, 'context');
  return {
    main: {
      position: 'absolute',
      right: '10%',
      top: '10%',
      width: '160px',
      height: '80%',
      background: '#222',
      pointerEvents: 'auto'
    },
    layer: {
      height: '40px',
      width: '100%',
      lineHeight: '40px',
      textAlign: 'center',
      background: '#444',
      cursor:'pointer'
    },
    layerText: {
      height: '40px',
      lineHeight: '40px',
      width:  'calc(100% - 40px)',
      background: 'rgba(0,0,0,0.0)'
    },
    layerIcon: {
      height: '40px',
      width:  '40px',
      lineHeight: '40px',
      background: 'rgba(0,0,0,0.3)'
    }
  };
}

export default class LayerControl extends BaseLayer {
  static propTypes = {
    options: PropTypes.object
  }
  static defaultProps = {
    options: {
      id: d => d.key
    },
    data: [],
    onChange: () => console.log('请覆盖onChange函数')
  }
  static contextTypes = {
  }
  constructor(props) {
    const options = Utils.deepMerge({}, LayerControl.defaultProps.options);
    super(props);
    this.state = {
      options: Utils.deepMerge(options, props.options)
    };
  }
  onLayerMouseOver = () => {
    const styles = getStyles(this.props, this.state, this.context);
  }
  onLayerMouseOut = () => {
    const styles = getStyles(this.props, this.state, this.context);
  }
  _genLayerUI(child){
    const {options} = this.state;
    const id = options.id(child);
    const styles = getStyles(this.props, this.state, this.context);
    return (
      <div
        ref={id}
        key={id} 
        style={styles.layer}
        onMouseOver={this.onLayerMouseOver}
        onMouseOut={this.onLayerMouseOut}
      >
        <div style={styles.layerText}>{id}</div>
        <div style={styles.layerIcon}>{'xx'}</div>
      </div>
    );
  }
  _updateOptions(){
    const {options} = this.state;
    const tileO = config[options.type];
    const filterFinal = Object.assign({}, tileO.filter, options.filter || {});
    if(!tileO) return;
    const tileType = tileO.layer || tileO.id;
    if (this.layer && tileType !== this.curTileType) this.layer.update(tileType);
    if (this.filter) this.filter.updateOptions(filterFinal);
    this.curTileType = tileType;
  }
  render(){
    const {data} = this.props;
    const styles = getStyles(this.props, this.state, this.context);
    return (
      <div style={styles.main}> 
        {_.map(_.reverse(data), (child, i) => this._genLayerUI(child))}
      </div>
    );
  }
}
