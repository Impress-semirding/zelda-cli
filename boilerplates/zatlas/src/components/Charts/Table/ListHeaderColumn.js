/**
* @Author: eason
* @Date:   2016-12-01T18:45:06+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2016-12-06T10:37:05+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

import React, {Component, PropTypes} from 'react';

import ListHeaderColumnWithFilter from './ListHeaderColumnWithFilter';
import ListHeaderColumnWithSort from './ListHeaderColumnWithSort';

const getStyles = (props, context) => {

  return {
    position: 'relative',
    ...props.style,
  };
};

export default class ListHeaderItem extends Component {

  static propTypes = {
    /**
     * Label
     * @type {Any}
     */
    label: PropTypes.any,

    /**
     * ListHeaderItem Types
     * @type {oneOf}
     */
    type: PropTypes.oneOf(['plain', 'filter', 'sort']), // now support plain/filter

    // other props following is for type == filter

    /**
     * [labelName which euqal data object key name]
     * @type {String}
     */
    labelName: PropTypes.string,

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
    ])),

    /**
     * onChange when click filter item, which call this
     * @type {func}
     */
    onChange: PropTypes.func,
  };

  static defaultProps = {
    type: 'plain',
  };

  static contextTypes = {
    muiTheme: PropTypes.object,
  };

  render () {
    const {children, label, type, style, ...others} = this.props;
    const styles = getStyles(this.props, this.context);

    switch (type) {
      case 'filter':
        return (
          <ListHeaderColumnWithFilter
            label={label} style={style} onChange={others.onFilter} {...others} />
        );
      case 'sort':
        return (
          <ListHeaderColumnWithSort label={label} style={style} onChange={others.onSort} {...others} />
        );
      default:
        return (
          <div style={style}>
            {label || children}
          </div>
        );
    }
  }
}
