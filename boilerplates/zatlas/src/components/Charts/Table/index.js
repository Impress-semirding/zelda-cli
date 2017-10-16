/**
* @Author: eason
* @Date:   2017-04-05T14:42:22+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2017-07-11T14:46:41+08:00
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

import PlainList from './common/PlainList';
import datas from './datas';

@connect(binding, transform)
export default class Table extends PureComponent {
  static defaultProps = {
    option,
    getOption,
    datas,
  };

  render() {
    const { getOption, ...otherProps } = this.props; // eslint-disable-line

    const option = getOption(this.props.option, this.props.data); // eslint-disable-line

    const { header, body } = this.props.data || {};

    return (
      <PlainList
        style={{ width: '100%', height: '100%' }}
        listItemStyle={{ maxHeight: 41 }}
        header={header}
        body={body}
        pageSize={20}
        currentPage={1}
        totalPages={1}
        onPaginate={this.onPaginate}
        onFilter={this.onFilter}
        onSort={this.onSort}
        triggerLoadingData={this.triggerLoadingData}
        batchActions={[
          { label: '批量撤销', handler: orderIds => this.handleRevokeComission(orderIds) },
        ]}
        itemActions={[
          { label: '撤销', handler: d => console.log(d) },
        ]}
      />
    );
  }
}
