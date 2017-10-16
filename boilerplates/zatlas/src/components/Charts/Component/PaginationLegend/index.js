/**
 * @Author: mark
 * @Date:   2017-08-17T10:15:26+08:00
 * @Email:  mark_z1988@icloud.com
 * @Filename: index.js
 * @Last modified by:   mark
 * @Last modified time: 2017-08-29T14:28:07+08:00
 * @License: MIT
 */


import React, { PureComponent } from 'react';
import _ from 'lodash';
import styles from './index.css';
import Icon from '../../../../components/Icon';

export default class PaginationLegend extends PureComponent {
  static defaultProps = {
    option: {},
    boxItemClick: null,
    selected: {},
  };

  constructor(options) {
    super(options);
    this.navChange = this.navChange.bind(this);
    this.boxItemClick = this.boxItemClick.bind(this);
  }

  componentDidMount() {
    this.changeIcon();
  }

  componentDidUpdate() {
    this.changeIcon();
  }

  changeIcon() {
    if (this.nextIcon && this.prevIcon) {
      const { width: bcWidth } = this.boxContainer.getBoundingClientRect();
      const left = this.boxContainer.offsetLeft;
      const { width: bvWidth } = this.viewBox.getBoundingClientRect();
      if (Math.abs(left - bvWidth) > bcWidth) {
        this.prevIcon.style.color = '#CCC';
      } else {
        this.prevIcon.style.color = '#000';
      }

      if (left >= 0) {
        this.nextIcon.style.color = '#CCC';
      } else {
        this.nextIcon.style.color = '#000';
      }
    }
  }

  navChange(state) {
    if (this.boxContainer && this.viewBox) {
      const { width: bcWidth } = this.boxContainer.getBoundingClientRect();
      const left = this.boxContainer.offsetLeft;
      const { width: bvWidth } = this.viewBox.getBoundingClientRect();
      if (Math.abs(left - bvWidth) <= bcWidth && state < 0) {
        this.boxContainer.style.left = `${left - bvWidth}px`;
      } else if (left <= 0 && state > 0) {
        this.boxContainer.style.left = `${Math.min(0, left + bvWidth)}px`;
      }


      this.changeIcon();
    }
  }

  boxItemClick(item) {
    if (this.props.boxItemClick) {
      this.props.boxItemClick(item);
    }
  }

  render() {
    const { color, legend } = this.props.option;
    const { data: legendData } = legend;
    const { top, bottom, left, right, width } = legend;
    const { color: fontColor, fontSize } = legend.textStyle;
    return (
      <div className={styles.container} style={{
        marginTop: top,
        marginBottom: bottom,
        marginLeft: left,
        marginRight: right,
      }}>
        <Icon
          style={{ visibility: 'hidden'}}
          refs={(prevIcon) => { this.prevIcon = prevIcon; }}
          onClick={() => { this.navChange(-1); }}
          name="arrowleft"
        />
      <div className={styles.viewbox} style={{ width: width && width !== 'auto' ? width : 'calc(100% - 35px)' }}ref={(vb) => { this.viewBox = vb; }}>
          <div className={styles.box_container} ref={(bc) => { this.boxContainer = bc; }}>
            {
           _.map(legendData, (d, idx) => {
             return (<div className={styles.box_item} key={idx}>
               <Icon
                 name="legend" style={{
                   color: this.props.selected[d] ? color[idx % 10] : '#ccc',
                   fontSize: fontSize || '14px',
                 }}
               />
               <div
                 className={styles.box_text} style={{
                   color: this.props.selected[d] ? (fontColor || '#000') : '#ccc',
                   fontSize: fontSize || '14px',
                 }} onClick={(e) => { this.boxItemClick(d, e); }}
               >{d}</div>
             </div>);
           })
         }
          </div>
        </div>
        <Icon
          style={{ visibility: 'hidden' }}
          refs={(nextIcon) => { this.nextIcon = nextIcon; }}
          onClick={() => { this.navChange(1); }}
          name="arrowright"
        />
      </div>
    );
  }
}
