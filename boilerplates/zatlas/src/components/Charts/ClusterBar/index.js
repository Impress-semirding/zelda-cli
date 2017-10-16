/**
* @Author: eason
* @Date:   2017-04-05T14:42:22+08:00
* @Email:  uniquecolesmith@gmail.com
 * @Last modified by:   mark
 * @Last modified time: 2017-08-24T13:37:58+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/
import React, { PureComponent } from 'react';
import { connect } from 've-react-databinding';

import option from './option';
import getOption from './getOption';
import binding from './binding';
import transform from './transform';

import datas from './datas';
import BaseChart from '../Component/BaseChart';

@connect(binding, transform)
export default class Bar extends PureComponent {
  static defaultProps = {
    option,
    getOption,
    binding,
    datas,
  };

  render() {
    return (
      <BaseChart {...this.props} />
    );
  }
}
