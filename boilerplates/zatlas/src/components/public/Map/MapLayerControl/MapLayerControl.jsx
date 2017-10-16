/*
* @Author: zhouningyi
* @Date: 2016-10-29 20:01:17
*/
import QueueAnim from 'rc-queue-anim';
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import {fade, emphasize} from 'material-ui/utils/colorManipulator';
import _          from 'lodash';
import MoreIcon    from 'material-ui/svg-icons/navigation/more-horiz';
import EyeIcon from 'material-ui/svg-icons/action/visibility';
import DelIcon from 'material-ui/svg-icons/action/delete';
import LayerIcon   from 'material-ui/svg-icons/maps/layers';
import TouchRipple from 'material-ui/internal/TouchRipple';
import IconButton from 'material-ui/IconButton';
import { GridList, GridTile } from 'material-ui/GridList';
import Toggle      from 'material-ui/Toggle';
import Popover from 'material-ui/Popover';
import Icon from '../../../../components/Icon';
import css from './index.css';
import mapMap from './../../../../charts/mapMap';
//
import getStyles   from './getStyles';
const Utils = require('bcore/utils');

function prevent(e){
  if (e.preventDefault)  e.preventDefault();
  if (e.stopPropagation) e.stopPropagation();
}

function getTransform(x=0, y=0){
  return `translate3d(${x}px,${y}px, 0px)`;
}

export default class MapLayerControl extends Component {
  static propTypes = {
    options: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
  }
  static defaultProps = {
    options: {
      id: d => d.com,
      draggable: true
    },
    data: [],
    onChange: () => console.log('请覆盖onChange函数'),
    isShow: false
  }
  static contextTypes = {
    muiTheme: PropTypes.object,
  }
  constructor(props) {
    const options = Utils.deepMerge({}, MapLayerControl.defaultProps.options);
    super(props);
    this.state = {
      options: Utils.deepMerge(options, props.options),
      data: props.data,
      hOffsetX: 0, 
      hOffsetY: 0,
      isAddingLayer: false,
      show: true,
    };
  }
  onLayerMouseOver = (hoverid) => {
    this.setState({hoverid});
  }
  onLayerMouseOut = () => {
    this.setState({hoverid: null});
  }
  onLayerSelect = (e, selectedLayerId) => {
    e.preventDefault();
    e.stopPropagation();
    const id = this.props.onLayerSelect(selectedLayerId);
    this.setState({ selectedLayerId: id });
  }
  onLayerHideToggle = (isHide, i) => {
    // const {data} = this.state;
    // data.children[i] = child;
    // this.setState({data});
    // this.props.onChange(data);
  }
  onLayerExpandClick = (eId) => {
    const {expandId} = this.state;
    if(eId === expandId) return this.setState({expandId: null});
    this.setState({expandId: eId});
  }
  onHeaderMouseDown = (e) => {
    if (!this.state.options.draggable) return;
    prevent(e);
    this.isDown = true;
    this.hClientX = e.clientX;
    this.hClientY = e.clientY;
    this.dhOffsetX = this.dhOffsetY = 0;
  }
  onHeaderMouseMove = (e) => {
    if (!this.state.options.draggable) return;
    prevent(e);
    if (!this.isDown) return;
    this.dhOffsetX = e.clientX - this.hClientX;
    this.dhOffsetY = e.clientY - this.hClientY;
    this.setState({});
  }
  onHeaderMouseUp = (e) => {
    if (!this.state.options.draggable) return;
    prevent(e);
    this.setState({
      hOffsetX: this.state.hOffsetX + this.dhOffsetX,
      hOffsetY: this.state.hOffsetY + this.dhOffsetY
    });
    this.dhOffsetX = this.dhOffsetY = 0;
    this.isDown = false;
  }
  onHeaderClick = () => {
    this.setState({
      show: !this.state.show,
    });
  }
  switchAddLayerPanel = () => {
    this.setState({ isAddingLayer: !this.state.isAddingLayer });
  }
  closeAddLayerPanel = () => {
    this.setState({ isAddingLayer: false });
  }
  onLayerAdd = (component) => {
    this.props.onLayerAdd(component)
  }

  handleVisiable = (id) => {
    const hidden = this.props.planes[id].props.option ? this.props.planes[id].props.option.hidden : false;
    this.props.dispatch({
      type: 'options/updateprops',
      payload: {
        key: id,
        newProps: {
          option: {
            hidden: !hidden,
          },
        },
      },
    });
  }

  handleDeleteLayer = (id) => {
    const parentId = this.props.planes[this.props.comId].parentId || this.props.comId;
    this.props.dispatch({ type: 'options/setactive', payload: parentId })
    this.props.dispatch({
      type: 'manager/switch/dialogOpen',
      payload: {
        content: '是否删除当前图层?',
        onEnter: () => {
          this.props.dispatch({ type: 'options/chart/delete', payload: { key: id } });
        },
      },
    })
  }

  _genLayerGrid = (d) => {
    return (
      <GridTile
        key={d.name}
        style={{
          width: '72px',
          height: '48px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <TouchRipple>
          <div
            onClick={() => this.onLayerAdd(d)}
            styleName="layerItem"
          >
            <Icon 
              name={d.icon} 
              style={{
                width: '24px',
                height: '24px'
              }}
            />
            <p styleName="name">{d.name}</p>
          </div>
        </TouchRipple>
      </GridTile>
    );
  }
  _genAddLayerPanel = () => {
    const {isAddingLayer} = this.state;
    if (!isAddingLayer) return null;
    return (
      <Popover
        open={true}
        anchorEl={this.refs.addAnchorEl}
        onRequestClose={this.closeAddLayerPanel}
        useLayerForClickAway={true}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
      >
        <GridList
          cellHeight={48}
          cols={3}
          style={{
            maxWidth: '240px',
          }}
        >
         {_.map(_.filter(mapMap, d => d.comType !== 'component'), this._genLayerGrid)}
        </GridList>
      </Popover>
    );
  }
  _genHeader(){
    const styles = getStyles(this.props, this.state, this.context);
    return (
      <div
        style={styles.header}
      >
        <div 
          styleName="layers__header__icon"
          onClick={this.onHeaderClick}
        > 
          <TouchRipple>
            <Icon name="layers"/>
          </TouchRipple>
        </div>
        <div 
          style={styles.headerText}
        > 
          <TouchRipple>图层管理</TouchRipple>
        </div>
        <div 
          style={styles.headerLayerIcon}
          onClick={this.switchAddLayerPanel}
          ref="addAnchorEl"
        >
          <TouchRipple>+</TouchRipple>
        </div>
      </div>
    );
  }
  _genMap(){
    const {children} = this.props;
    // return  children ? React.Children.map(children, map => {
    //   return map ? React.cloneElement(map, {map}) : null;
    // }) : null;
    return children;
  }
  _getMoveStyle(){
    const {offsetX, offsetY} = this.state;
  }
  _genLayerUI = (id, showName) => {
    const {options} = this.props;
    const planeOption = this.props.planes[id].props.option;
    const styles = getStyles(this.props, this.state, this.context);
    return (
      <div
        ref={id}
        key={id}
        onClick={(e) => this.onLayerSelect(e, id)}
        styleName={classnames({
          "layers__layer": true,
          "selected": this.props.activePlane === id,
          "hidden": planeOption && planeOption.hidden,
        })}
      >
        <div
          style={{...styles.layerText}}
          styleName="layers__layer__text"
        >
            <TouchRipple>{showName}</TouchRipple>
        </div>
        <IconButton
          style={styles.layerIcon}
          styleName="layers__layer__eyeicon"
          iconStyle={{
            width: '16px',
            height: '16px',
            color: 'transparent'
          }}
          onClick={() => this.handleVisiable(id)}
        >
          <EyeIcon style={{...styles.layerIconMore}}/>
        </IconButton>
        <IconButton
          style={styles.layerIcon}
          iconStyle={{ width: '16px', height: '16px', color: 'transparent' }}
          onClick={(e) => { e.stopPropagation(); this.handleDeleteLayer(id)}}
        >
          <DelIcon style={{...styles.layerIconMore}}/>
        </IconButton>
      </div>
    );
  }
  _genLayerSubEditor(id){
    const {expandId} = this.state;
    const styles = getStyles(this.props, this.state, this.context);
    if(expandId !== id) return null;
    return (
      <div style={styles.subMenu}>
      </div>
    );
  }
  _genLayersUI(){
    // const {data} = this.state;
    // if(!this.props.children) return null;
    const styles = getStyles(this.props, this.state, this.context);
    const transform = getTransform(this.state.hOffsetX + this.dhOffsetX, this.state.hOffsetY + this.dhOffsetY);
    return this.props.isShow ? (
        <div
          style={styles.uiContainer}
          styleName={classnames({
            'layers-container': true,
            'show': this.state.show
          })}
          key="uiContainer"
        >
        <div
          styleName="layers__wrapper"
        >
          <div style={{...styles.main, transform}}> 
            {this._genHeader()}
            {this._genAddLayerPanel()}
            <div styleName="layers-list">
              {
                React.Children.map(this.props.children, (Map) => {
                  this.mapId = Map.props.comId;
                  return _.map([...(Map.props.children || [])].reverse(), (layer) => {
                    const { props, type } = layer;
                    const comName = type.name;
                    const id = this._getLayerId(layer);
                    const selectedLayerId = this.state;
                    const showName = props.name_cn || comName
                    return this._genLayerUI(id, showName, selectedLayerId === id);
                  });
                })
              }
            </div>
          </div>
        </div>
        </div>
    ) : null;
  }
  _getId(){
    return this.mapId || this.key || this.props.key || this.props.comId || this.props.id;
  }
  _getLayerId(layer){
    return layer.key || layer.props.comId || layer.type.name;
  }
  render(){
    const styles = getStyles(this.props, this.state, this.context);
    return (
      <div>
        <QueueAnim
          delay={200}
        >
          {this._genLayersUI()}
        </QueueAnim>
        <div style={styles.mapContainer}>
          {this._genMap()}
        </div>
      </div>
    );
  }
}
