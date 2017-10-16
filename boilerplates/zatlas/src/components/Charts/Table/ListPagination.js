/**
* @Author: eason
* @Date:   2016-11-28T18:52:28+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2016-12-20T14:04:38+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

import React, { Component, PropTypes } from 'react';
import * as ReactUltimatePagination from 'react-ultimate-pagination';
import styleMerge from 'style-merge';
import classnames from 'classnames';

import FlatButton from 'material-ui/FlatButton';
import NavigationFirstPage from 'material-ui/svg-icons/navigation/first-page';
import NavigationLastPage from 'material-ui/svg-icons/navigation/last-page';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';


const defaultStyle = {
  textAlign: 'center',
};

const flatButtonStyle = {
  minWidth: 36,
  // color: 'rgb(78, 78, 78)',
};

const activeStyle = {
  color: '#009E55',
};

// export default class ListPagination extends Component {
//
//   render () {
//
//     return (
//       <div>
//         <div>上一页</div>
//         <ul>
//           <li>1</li>
//           <li>2</li>
//           <li>3</li>
//           <li>4</li>
//           <li>5</li>
//           <li>6</li>
//           <li>7</li>
//           <li>8</li>
//           <li>9</li>
//           <li>10</li>
//         </ul>
//         <div>下一页</div>
//       </div>
//     );
//   }
// }

const Page = ({value, isActive, onClick}) => (
  <FlatButton
    style={styleMerge(flatButtonStyle, isActive ? activeStyle : undefined)}
    label={value.toString()} primary={isActive}
    onClick={onClick}
    labelStyle={{ fontSize: 12 }}
  />
);

const Ellipsis = ({value, isActive, onClick}) => (
  <FlatButton style={flatButtonStyle} label="..." onClick={onClick} />
);

const FirstPageLink = ({value, isActive, onClick}) => (
  <FlatButton
    style={styleMerge(flatButtonStyle, {display: 'none'})}
    label="首页"
    onClick={onClick}
    labelStyle={{ fontSize: 12, color: 'rgb(78, 78, 78)' }}
  />
);

const PreviousPageLink = ({value, isActive, onClick}) => (
  <FlatButton
    style={flatButtonStyle}
    label="上一页"
    onClick={onClick}
    labelStyle={{ fontSize: 12, color: 'rgb(78, 78, 78)' }}
  />
);

const NextPageLink = ({value, isActive, onClick}) => (
  <FlatButton
    style={flatButtonStyle}
    label="下一页"
    onClick={onClick}
    labelStyle={{ fontSize: 12, color: 'rgb(78, 78, 78)' }}
  />
);

const LastPageLink = ({value, isActive, onClick}) => (
  <FlatButton
    style={styleMerge(flatButtonStyle, {display: 'none'})}
    label="尾页"
    onClick={onClick}
    labelStyle={{ fontSize: 12, color: 'rgb(78, 78, 78)' }}
  />
);

const WrapperComponent = ({children}) => (
  <div style={defaultStyle}>{children}</div>
);

const itemTypeToComponent = {
  'PAGE': Page,
  'ELLIPSIS': Ellipsis,
  'FIRST_PAGE_LINK': FirstPageLink,
  'PREVIOUS_PAGE_LINK': PreviousPageLink,
  'NEXT_PAGE_LINK': NextPageLink,
  'LAST_PAGE_LINK': LastPageLink
};

export default ReactUltimatePagination.createUltimatePagination({
  itemTypeToComponent,
  WrapperComponent,
});

// export default ReactUltimatePagination;
