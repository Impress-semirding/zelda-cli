/**
* @Author: eason
* @Date:   2017-04-05T14:42:22+08:00
* @Email:  uniquecolesmith@gmail.com
 * @Last modified by:   mark
 * @Last modified time: 2017-08-24T10:45:44+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

import React, { Component } from 'react';
import { connect } from 've-react-databinding';

import option from './option';
// import validation from './validation';
import getOption from './getOption';
import bindings from './binding';
import transform from './transform';

import datas from './datas';
import BaseChart from '../Component/BaseChart';

@connect(bindings, transform)
export default class Line extends Component {
  static defaultProps = {
    option,
    // validation,
    getOption,
    datas,
  };
  render() {
    return (
      <BaseChart {...this.props} />
    );
  }
}
