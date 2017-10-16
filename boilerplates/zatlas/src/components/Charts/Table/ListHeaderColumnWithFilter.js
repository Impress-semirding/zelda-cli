/**
* @Author: eason
* @Date:   2016-12-01T18:34:16+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2016-12-06T11:05:02+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

import React, {Component, PropTypes} from 'react';
import styleMerge from 'style-merge';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';


const getStyles = (props, context) => {
  const {style} = props;

  return {

    ...style
  };
};

/**
 * ListHeaderItemWithFilter
 *
 * Example:
 *
 *  data = [{
 *    age: 19,
 *    sex: 'female'
 *    }, {
 *    age: 20,
 *    sex: 'male'
 *  }, {
 *    age: 21,
 *    sex: 'male'
 *  }];
 *
 *  Props:
 *    {
 *      label: '年龄',
 *      labelName: 'age',
 *      filters: [19, 20],
 *      onChange: (labelName, filter) => { ... }
 *    }
 *
 */
export default class ListHeaderItemWithFilter extends Component {

  static propTypes = {
    /**
     * [label Display Name]
     * @type {Any}
     */
    label: PropTypes.any.isRequired,

    /**
     * [labelName which euqal data object key name]
     * @type {String}
     */
    labelName: PropTypes.string.isRequired,

    /**
     * [labelStyle description]
     * @type {[type]}
     */
    labelStyle: PropTypes.object,

    /**
     * [filters which is an array of value of key labelName of data obj]
     * Array of String or Number
     * @type {array}
     */
    filters: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])).isRequired,

    /**
     * onChange when click filter item, which call this
     * @type {func}
     */
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    labelStyle: {
      primaryColor: '#7B7B7B',
      defaultColor: '#7B7B7B',
      activeColor: '#009E55',
    },
  };

  render () {
    const {style, label, labelName, labelStyle, filters, onChange} = this.props;
    const stl = getStyles(this.props, this.context);

    return (
      <div style={stl}>
        <DropDownMenu
          value={0}
          style={{height: 'auto'}}
          iconStyle={{fill: labelStyle.primaryColor, top: -5}}
          labelStyle={styleMerge({paddingLeft: 0, color: labelStyle.primaryColor, lineHeight: 'initial'}, style)}
          underlineStyle={{ border: 'none' }}
        >
          <MenuItem innerDivStyle={{color: labelStyle.activeColor}} value={0} primaryText={label} onClick={() => onChange(labelName, null)}/>
          {
            filters.map(
              (filter, index) => <MenuItem key={index} value={index+1} primaryText={filter} onClick={() => onChange(labelName, filter)}/>
            )
          }
        </DropDownMenu>
      </div>
    );
  }
}
