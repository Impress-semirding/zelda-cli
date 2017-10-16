/**
* @Author: eason
* @Date:   2016-11-28T11:22:44+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2016-12-06T16:28:05+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

import React, {Component, PropTypes} from 'react';
import styleMerge from 'style-merge';
import classNames from 'classnames';

const defaultStyle = {
  width: '100%',
  // height: '100%',
};

export default class ListHeader extends Component {

  render () {
    const {children, style, className, ...others} = this.props;
    const stl = styleMerge(defaultStyle, style);
    const cls = classNames({
      'veui-list-body': true,
      [className]: className
    });

    return (
      <div style={stl} className={cls} {...others}>
        {children}
      </div>
    );
  }
}
