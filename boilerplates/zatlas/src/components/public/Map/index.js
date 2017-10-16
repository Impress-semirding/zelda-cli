/**
* @Author: eason
* @Date:   2017-04-05T14:42:22+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2017-05-17T16:30:33+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

import { connect } from 'dva';
import React, { Component, PropTypes } from 'react';
import { Map, TileLayer, AreaScalable, Areas, ScatterCanvas, ScatterKonva, ScatterKonvaPlain, HeatmapGeohashGrid, HeatmapGrid, LinkKonva, Bound} from 'lmap-react';
import mapMap from './../../../charts/mapMap';
import options from './option';
import MapLayerControl from './MapLayerControl';
import _ from 'lodash';
import zUtils from 'zcontrol/lib/utils';
import validation from './validation';

function getStyles(props, state, context){
  const { option } = props;
  const titleO = option.title;
  return {
    main: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      background: '#ff0'
    },
    header: {
      maxWidth: '100%',
      zIndex: 2,
      position: 'absolute',
      top: 0,
      left: 0,
      background: titleO.background,
      color:      titleO.color,
      display:    titleO.show ? 'block' : 'none',
      textAlign:  titleO.textAlign,
      marginLeft: titleO.left,
      marginTop: titleO.top,
      padding:    '0 10px',
      height:     '30px',
      lineHeight: '30px',
      fontSize:   '18px',
      fontWeight: '600',
    }
  };
}

class MapWrapper extends Component {
  static defaultProps = {
    name_cn: '2d地图',
    option: zUtils.toObject(validation),
    validation,
    onLayerChange: (id) => {}
  };
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };
  constructor(){
    super();
    this.state = {};
  }
  _genMap(){
    const props = {...this.props, options: this.props.option};
    const {_children: children} = props;
    return (
      <Map 
        ref="map" 
        key="map" 
        {...props}
      >
       {this.props.children}
     </Map>
    );
  }
  _updateLayerControl () {
    const { mapcontrol } = this.refs;
    if (!mapcontrol || !mapcontrol.state) return;
    const id = mapcontrol.state.selectedLayerId;
    if (id !== this.state.selectedLayerId) {
      this.props.onLayerChange(id);
      this.setState({ selectedLayerId: id });
    }
  }
  _getCurLayer(){
    return this.state.selectedLayerId;
  }
  onLayerSelect = (selectedLayerId) => {
    if (this.state.selectedLayerId === selectedLayerId) {
      const options = this.props.options.planes[selectedLayerId];
      const parentId = options.parentId;
      this.props.dispatch({ type: 'options/setactive', payload: parentId })
      this.setState({ selectedLayerId: undefined });
      return undefined;
    } 
    this.props.dispatch({ type: 'options/setactive', payload: selectedLayerId })
    this.setState({ selectedLayerId });
    return selectedLayerId;
  }
  onLayerAdd = (component) => {
    const parentId = this.props.id;
    this.props.dispatch({ type: 'grid/chart/append', payload: {
      component, parentId
    }});
  }
  onLayerDelete = (component) => {
    this.props.dispatch({type: 'grid/chart/delete', payload: { component }});
  }
  componentDidMount(){
    this._updateLayerControl();
  }
  componentDidUpdate(){
    this._updateLayerControl();
  }
  componentWillUnmount(){
  }

  isShow() {
    if (!this.props.activePlane) return false;
    const options = this.props.options.planes[this.props.activePlane];
    const parentId = options.parentId;
    return this.props.activePlane === this.props.comId || parentId === this.props.comId;
  }
  render(){
    const {activePlane, comId, option={}} = this.props;
    const styles = getStyles(this.props, this.state, this.context);
    return (
      <div style={styles.main}>
        <header
          style={styles.header}
        >
          {option.title.show ? option.title.text : ''}
        </header>
        <MapLayerControl
          ref="mapcontrol"
          comId={this.props.comId}
          onLayerSelect={ this.onLayerSelect }
          onLayerDelete={ this.onLayerDelete }
          onLayerAdd={ this.onLayerAdd }
          isShow={ this.isShow() }
          activePlane={ this.props.options.activePlane }
          dispatch={ this.props.dispatch}
          planes={this.props.options.planes}
        >
          { this._genMap() }
        </MapLayerControl>
      </div>
    );
  }
};

const MapWrapperC = connect((state) => {
  return {...state};
})(MapWrapper);

MapWrapperC.defaultProps = Object.assign(MapWrapperC.defaultProps || {}, MapWrapper.defaultProps);

export default MapWrapperC;
