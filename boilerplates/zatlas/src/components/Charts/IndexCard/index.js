/**
* @Author: eason
* @Date:   2017-04-05T14:42:22+08:00
* @Email:  uniquecolesmith@gmail.com
 * @Last modified by:   mark
 * @Last modified time: 2017-07-24T10:00:01+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

import React, { PureComponent } from 'react';

import { connect } from 've-react-databinding';
// import { connect } from 've-databinding';

import option from './option';
import getOption from './getOption';
import binding from './binding';
import transform from './transform';

import datas from './datas';

@connect(binding, transform)
export default class Area extends PureComponent {
  static defaultProps = {
    option,
    getOption,
    datas,
  };

  render() {
    const { getOption, ...otherProps } = this.props; // eslint-disable-line

    const option = getOption(this.props.option, this.props.data); // eslint-disable-line

    return (
      <div style={option.style}>
        <div style={option.style.titleStyle}>{option.title}</div>
        <div style={option.style.indexStyle}>{option.count}</div>
      </div>
    );
  }
}
