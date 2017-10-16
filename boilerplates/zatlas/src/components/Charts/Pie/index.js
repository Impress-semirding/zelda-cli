/**
* @Author: eason
* @Date:   2017-04-05T14:42:22+08:00
* @Email:  uniquecolesmith@gmail.com
 * @Last modified by:   mark
 * @Last modified time: 2017-09-06T10:14:42+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/
import React, { PureComponent } from 'react';
import _ from 'lodash';
import { connect } from 've-react-databinding';
import option from './option';
import getOption from './getOption';
import binding from './binding';
import transform from './transform';

import datas from './datas';
import BaseChart from '../Component/BaseChart';

@connect(binding, transform)
export default class Pie extends PureComponent {
  static defaultProps = {
    option,
    getOption,
    datas,
  };

  getTotal(data) {
    let count = 0;
    if (data && data.mock) {
      data = data.data; // eslint-disable-line
    }
    if (data) {
      _.forEach(data.series, (e) => {
        _.forEach(e.data, (d) => {
          count += Number(d.value);
        });
      });
    }
    return count;
  }

  render() {
    const { option, data } = this.props; // eslint-disable-line

    const total = this.getTotal(data);
    const text = option.indexCard && option.indexCard.text || '';
    const textLeft = option.indexCard && option.indexCard.left || '0px';
    const textTop = option.indexCard && option.indexCard.top || '0px';
    const textColor = option.indexCard && option.indexCard.color || '#333';
    const textFontSize = option.indexCard && option.indexCard.fontSize || '12';

    return (
      <div style={{ width: '100%', height: '100%' }}>
        <BaseChart {...this.props} />
        {
          option.indexCard && option.indexCard.show ?
            <div
              style={{ position: 'absolute',
                top: '50%',
                left: '50%',
                marginLeft: textLeft,
                marginTop: textTop,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: textColor,
                fontSize: (`${textFontSize}px`) }}
            >
              <div>{text}</div>
              <div>{total}</div>
            </div> : ''
        }
      </div>
    );
  }
}
