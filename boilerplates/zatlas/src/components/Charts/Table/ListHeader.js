/**
* @Author: eason
* @Date:   2016-11-28T11:22:18+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2016-12-06T16:27:00+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

import React, {Component, PropTypes} from 'react';
import styleMerge from 'style-merge';
import classNames from 'classnames';

import ListItem from './ListItem';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

const defaultStyle = {
  width: '100%',
  // height: '100%',
  padding: '.5rem 0',

  filterComp: {
    labelStyle: {
      primaryColor: '#009e55',
      defaultColor: '#7B7B7B',
      activeColor: '#4B4B4B',
    },
  },
};

class Filter extends React.Component {

  render () {
    const {label, filters, labelStyle, onChange} = this.props;
    const _labelStyle = styleMerge(defaultStyle.filterComp.labelStyle, labelStyle);

    return (
      <DropDownMenu
        value={1}
        iconStyle={{fill: _labelStyle.primaryColor}}
        labelStyle={{paddingLeft: 0, color: _labelStyle.primaryColor}}
        underlineStyle={{ border: 'none' }}
      >
        {
          filters.map(({label, onChange}, index) =>(
            <MenuItem key={index} value={index} primaryText={label} onClick={() => onChange(label)} />
          )).unshift(
            <MenuItem innerDivStyle={{color: _labelStyle.activeColor}} value={0} primaryText={label} />
          )
        }
      </DropDownMenu>
    );
  }
}

export default class ListHeader extends Component {

  static propTypes = {
    data: PropTypes.array,
  };

  render () {
    const {children, style, className, ...others} = this.props;
    const stl = styleMerge(defaultStyle, style);
    const cls = classNames({
      'veui-list-header': true,
      [className]: className
    });

    return (
      <ListItem style={stl} className={cls} {...others}>
        {children}
      </ListItem>
    );
  }
}
