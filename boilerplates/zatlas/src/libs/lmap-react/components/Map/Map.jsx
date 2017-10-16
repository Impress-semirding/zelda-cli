/*
* @Author: zhouningyi
* @Date: 2016-10-29 15:48:22
*/

import React, { Component, PropTypes } from 'react';
import GeoCodingSearch from 'lmap/plugins/geo_coding_popup';
import LMap  from 'lmap/map/map';
import L from 'lmap/leaflet';
import Utils from 'bcore/utils';
import BaseLayer from './../../lib/BaseLayer';
import Bound     from './../selectors/Bound/bound';
// import LayerControl from './../ui/LayerControl';

const defaultMapOptions = {
  zoomControl: false,
  attributionControl: false,
  doubleClickZoom: false,
  doubleClickGeoCoding: true,
  center: {
    lat: 31.12951,
    lng: 121.36734
  },
  zoom: 10,
  background: '#000',
  enableBoundSelect: false,
  preferCanvas: true,
  zoomSnap: 0.01
};

const full = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  left: '0',
  top: '0',
};

function getStyles(props, state, context) {
  return {
    main: full,
    ui:  Object.assign({}, full, { zIndex: 1, pointerEvents: 'none' }),
    map: Object.assign({}, full, { zIndex: 0 }),
  };
}
//
export default class Map extends BaseLayer {
  static propTypes = {
    options: PropTypes.object,
    onChange: PropTypes.func
  }
  static defaultProps = {
    name_cn: '地图',
    options: defaultMapOptions
  }
  static childContextTypes = {
    map: PropTypes.object,
  };
  constructor(props) {
    super(props, LMap, Map.defaultProps);
  }
  getChildContext(){
    return {
      map: this._map
    };
  }
  componentDidMount() {
    const container = this.refs.container;
    const {options} = this.state;
    const map = this._map    = new LMap(container, options);

    const bound = this.bound = new Bound({enable: options.enableBoundSelect});
    bound.addTo(map);
    this.initEvents();
    this.setState({map});
    this._updatePlugins();
  }
  _updatePlugins(){
    const {doubleClickGeoCoding} = this.state.options;
    const map = this._map;
    if(!map) return;
    if(doubleClickGeoCoding && this._map && !this.geocoding){
      this.geocoding = new GeoCodingSearch(map);
    } else if (this.geocoding && doubleClickGeoCoding){
      this.geocoding.enable();
    } else if (this.geocoding){
      this.geocoding.disable();
    }
  }
  _updateMap(){
    if(!this._map) return;
    let {options} = this.state;
    options = {...options, draggable: !options.enableBoundSelect};
    this._map.updateOptions(options);
    this._updatePlugins();
    this.bound.updateOptions({isable: options.enableBoundSelect});
  }
  _genChildren(){
    const map = this._map;
    return  map ? React.Children.map(this.props.children, child => {
      return child ? React.cloneElement(child, {map}) : null;
    }) : null;
  }
  initEvents(){
    const map = this._map;
    map
    .on('moveend', (e) => {
      const c    = map.getCenter();
      const zoom = map.getZoom();
      const center = { lat: c.lat, lng:c.lng};
      this.state.options.center = center;
      this.state.options.zoom = zoom;
      if (this.props.onChange) {
        this.props.onChange({zoom, center});
      }
    });
    //
    const {bound} = this;
    bound.on('select', (d) => {
      if (this.props.onBoundChange) this.props.onBoundChange(d);
    })
  }
  render() {
    const { options } = this.props;
    const styles = getStyles(this.props, this.state, this.context);
    if (this.optionsNeedsUpdate) this._updateMap();
    const children = this._genChildren();
    return (
      <div ref='container' style={styles.map} >
        { children }
      </div>
    );
    // return (
    //   <div style={styles.main} >
    //     <div style={styles.ui} >
    //       <LayerControl data={children}/>
    //     </div>
    //     <div ref='container' style={styles.map} >
    //       { children }
    //     </div>
    //   </div>
    // )
  }
}
