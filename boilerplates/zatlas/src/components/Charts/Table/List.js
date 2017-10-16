/**
* @Author: eason
* @Date:   2016-11-01T09:51:02+08:00
* @Last modified by:   eason
* @Last modified time: 2016-12-15T15:56:29+08:00
*/



import React, { Component, PropTypes, Children, isValidElement, cloneElement } from 'react';
import styleMerge from 'style-merge';
import classNames from 'classnames';

import './index.scss';

const defaultStyle = {
  position: 'relative',
  padding: '.5rem 0',
  margin: 0,
  width: '100%',
  // height: '100%',
  flex: 1,
  listStyle: 'none',
  display: 'flex',
  flexFlow: 'column wrap',
  // justifyContent: 'center',

  borderTop: '1px rgba(238,238,238,1) solid',
  borderBottom: '1px rgba(238,238,238,1) solid',
  // color: '#4B4B4B',
};

export default class List extends Component {
  static propTypes = {
    /* Usually `ListItem` passed */
    children: PropTypes.node,
    /* Override inline-style */
    style: PropTypes.object,
    /* Succeed class name passed */
    className: PropTypes.string,
  };

  render () {
    const { children, style, className, ...others } = this.props;
    const stl = styleMerge(defaultStyle, style);
    const cls = classNames({
      veui_list: true,
      [className]: className
    });

    return (
      <ul style={stl} className={cls} {...others}>
        {
          children
        }
      </ul>
    );
  }
}
