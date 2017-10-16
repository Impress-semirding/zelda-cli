/**
* @Author: eason
* @Date:   2016-11-02T10:09:17+08:00
* @Last modified by:   eason
* @Last modified time: 2016-12-02T17:34:49+08:00
*/



import React, {Component, PropTypes, isValidElement} from 'react';
import styleMerge from 'style-merge';
import classNames from 'classnames';
import warning from 'warning';


const defaultStyle = {

};

export default function ListItemColumn ({children, label, style, className, ...others}) {
    const stl = styleMerge(defaultStyle, style);
    const cls = classNames({
      veui_list_item_column: true,
      [className]: className
    });

    // warning(typeof children === 'string' || isValidElement(children), `ListItemColumn children expected String or React Element.`);

    return (
      <div style={stl} className={cls}>
        {label || children}
      </div>
    );
}
