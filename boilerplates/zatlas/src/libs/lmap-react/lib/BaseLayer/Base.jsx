/*
* @Author: zhouningyi
* @Date: 2016-10-29 20:01:17
*/

import React, { Component, PropTypes } from 'react';
import Utils from './../utils';
import _     from 'lodash';


export default class Base extends Component {
  static propTypes = {
    options: PropTypes.object.isRequired,
    data:    PropTypes.any,
  }
  static defaultProps = {
    options: {
    }
  }
  static contextTypes = {
    map: PropTypes.object
  }
  constructor(props, Layer, defaultProps) {
    super(props);
    const options = Utils.deepMerge(_.cloneDeep(defaultProps.options || {}), props.options || {});
    this.state = {options};
    this.Layer = Layer
    this.dataNeedsUpdate = true;
    this.geojsonNeedsUpdate = true;
    setTimeout(() => this._initEvents());
  }
  _initEvents(){
    const layer = this.layer || this._map || this.map;
    const { events } = this.props;
    if (events && layer) _.forEach(events, (fn, evt) => layer.on(evt, fn));
  }
  componentWillMount() {
    this._extendState();
  }
  _extendState(){
    this.setState({ data: this.props.data });
  }
  _updateLayer(){
    if (this.optionsNeedsUpdate) this._updateOptions();
    if (this.dataNeedsUpdate) {
      this._render();
    }
  }
  componentDidMount() {
    const map = this.map = this.context.map;
    if (map) this._createLayer();
    if (this.layer) this.layer.addTo(map);
    this._updateLayer();
    this.checkHide();
  }
  checkHide(options){
    options = options || this.state.options;
    const {layer} = this;
    if (!layer) return;
    if (options.isHide) {
      if (layer.hide) layer.hide();
      if (this.hide)  this.hide();
    } else if (!options.isHide ) {
      if (layer.show) layer.show();
      if (this.show)  this.show();
    }
  }
  componentWillReceiveProps(newProps){
    //数据对比
    const newData    = newProps.data;
    if (! _.isEqual(newData, this.props.data)) this.dataNeedsUpdate = true;
    //配置对比
    const oldOptions = Utils.deepMerge(this.props.options, this.state.options);
    const newOptions = Utils.deepMerge(oldOptions, newProps.options);
    if (! _.isEqual(newOptions, oldOptions)){
      // this.state.options = newOptions;
      this.setState({ options: newOptions });
      this.optionsNeedsUpdate = true;
    }
    if (! _.isEqual(newProps.feedings, this.props.feedings)) this.optionsNeedsUpdate = true;
    this.checkHide(newProps.options);
  }
  _getOptions(){
    return this.state.options;
  }
  _updateOptions(){
    const options = this._getOptions();
    if (this.layer.updateOptions) this.layer.updateOptions(options);
    this.optionsNeedsUpdate = false;
  }
  _render(){
    if (this.layer && this.layer.render && this.props.data) {
      let { data, types, feedings } = this.props.data;
      /* data 有可能是mock数据，特殊处理 */
      if (data.mock) {
        this._updateOptions();
        data = data.data;
      }
      data = _.filter(data, d => d !== null && d !== undefined).map(d => {
        d.feeding = feedings;
        return d;
      });
      // FIXME(disoul) 保存恢复时无法更新之前的opt
      if (this.state.mock) {
        const options = this._getOptions();
        this.layer.updateOptions(options);
        this.setState({mock: false});
      } else {
        this.layer.render(data);
      }
      this.dataNeedsUpdate = false;
    }
  }
  componentWillUnmount(){
    this._destroy();
  }
  _destroy(){
    const {layer, map} = this;
    if (!layer) return;
    if (layer.destroy) layer.destroy();
    if (map)           map.removeLayer(layer);
  }
  _createLayer(){
    if(!this.layer) this.layer = new this.Layer(this._getOptions());
  }
  render() {
    this._updateLayer();
    return null;
  }
  parseOptions(options){
    const { feedings, binding } = this.props;
    return Utils.parseOptions(options, feedings, binding);
  }
}
