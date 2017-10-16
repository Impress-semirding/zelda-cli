/**
* @Author: eason
* @Date:   2016-11-01T10:02:58+08:00
* @Last modified by:   eason
* @Last modified time: 2017-06-20T20:14:20+08:00
*/



import React, {Component, PropTypes, Children, isValidElement, cloneElement} from 'react';
import styleMerge from 'style-merge';
import classNames from 'classnames';


const defaultStyle = {
  maxHeight: '2rem',
  flex: '1 1 2rem',
  display: 'flex',
  flexFlow: 'row wrap',
  alignItems: 'center',
  position: 'relative',
  boxSizing: 'border-box',
  width: '100%',
};

export default class ListItem extends Component {
  static propTypes = {
    children: PropTypes.any,
    style: PropTypes.object,
    className: PropTypes.string,
    childrenGrows: PropTypes.array,
    childrenShrinks: PropTypes.array,
    childrenBasises: PropTypes.array,
  };

  static defaultProps = {
    childrenGrows: [],
    childrenShrinks: [],
    childrenBasises: [],
  };

  render () {
    const {
      component,
      children, style, className,
      childrenGrows, childrenShrinks, childrenBasises,
      ...others} = this.props;
    const stl = styleMerge(defaultStyle, style);
    const cls = classNames({
      veui_list_item: true,
      [className]: className
    });
    const Component = component || 'li';

    if (typeof children === undefined || typeof children === 'string') {
      return <li style={stl} className={cls} {...others}>{children}</li>;
    }

    return (
      <Component style={stl} className={cls} {...others}>
        {
          Children.map(children, (child, index) => !child ? child : cloneElement(child, {
            style: {
              flexGrow: childrenGrows[index] || 1, // rest = width - flexBasis, then `rest` is divided for each child by flexGrow
              flexShrink: childrenShrinks[index] || 1, //  by shrink, bigerg or smaller
              flexBasis: childrenBasises[index] || 0, // default 0, that means default length is 0 px, you can set default length by yourself
              ...child.props.style,
            },
          }))
        }
      </Component>
    );
  }
}
