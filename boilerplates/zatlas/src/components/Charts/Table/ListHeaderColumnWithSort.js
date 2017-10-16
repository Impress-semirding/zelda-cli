/**
* @Author: eason
* @Date:   2016-12-06T08:27:42+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2016-12-06T21:26:49+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/



import React, {Component, PropTypes} from 'react';

import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more';

const getStyles = (props, context) => {
  const {style, labelStyle, iconStyle} = props;

  return {
    position: 'relative',
    cursor: 'pointer',

    labelStyle: {
      cursor: 'pointer',

      ...labelStyle
    },

    iconStyle: {
      width: 16,
      height: 16,
      position: 'absolute',
      right: 16,
      top: 0,

      ...iconStyle,
    },

    ...style
  };
};

export default class ListHeaderColumnWithSort extends Component {

  static propTypes = {
    /**
     * Display name or node
     * @type {any}
     */
    label: PropTypes.any.isRequired,

    /**
     * data object key, like identify node target
     * @type {string}
     */
    labelName: PropTypes.string.isRequired,

    /**
     * When the order changes, which call this function
     * @type {function}
     */
    onChange: PropTypes.func.isRequired,

    /**
     * labelStyle can override default labelStyle
     * @type {object}
     */
    labelStyle: PropTypes.object,

    /**
     * iconStyle can override default iconStyle
     * @type {object}
     */
    iconStyle: PropTypes.object,
  };

  state = {
    sort: -1 // 1 order, -1 reverse
  };

  componentDidUpdate(previousProps, previousState) {
    // @TODO cannot do here
    // this.props.onChange(this.props.labelName, this.state.sort, this.state === 1 ? 'order' : 'reverse');
  }

  onSort = e => {
    // @TODO 1
    // this.props.onChange(this.props.labelName, this.state.sort, this.state === 1 ? 'order' : 'reverse'); // @TODO
    // this.props.onChange(this.props.labelName, this.state.sort, this.state === 1 ? 'reverse' : 'order'); // @TODO here is reverse, because state change async
    // this.setState({sort: this.state.sort === 1 ? -1 : 1});

    // @TODO 2
    // this.setState((prevState, props) => {
    //   // @TODO do here right ?
    //   props.onChange(this.props.labelName, this.state.sort === 1 ? -1 : 1, this.state === 1 ? 'reverse' : 'order');
    //
    //   return {
    //     sort: prevState.sort === 1 ? -1 : 1
    //   };
    // });

    // @TODO 3
    this.setState({sort: this.state.sort === 1 ? -1 : 1}, () => {
      this.props.onChange(this.props.labelName, this.state.sort, this.state.sort === 1 ? '升序' : '降序');
    });
  }

  render () {
    const {label, style, onChange, ...others} = this.props;
    const stl = getStyles(this.props, this.context);

    const Component = this.state.sort === -1 ? NavigationExpandMore : NavigationExpandLess;

    return (
      <div style={stl} onClick={this.onSort}>
        <label style={stl.labelStyle}>{label}</label>
        <Component style={stl.iconStyle}/>
      </div>
    );
  }
}
