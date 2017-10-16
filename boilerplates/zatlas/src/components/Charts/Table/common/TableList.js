/**
* @Author: eason
* @Date:   2016-12-01T14:43:44+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2016-12-15T14:28:42+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/



import React, {PropTypes} from 'react';
import styleMerge from 'style-merge';

import {
  ListHeader, ListBody, ListFooter,
  List, ListItem, ListItemColumn,
  ListPagination,
  ListHeaderColumn, ListHeaderColumnWithFilter,
} from '../index';


const getStyles = (props, context) => {
  const {style, listStyle, listItemStyle, } = props;
  const {list} = context.muiTheme;

  return {
    padding: '1rem 1.5rem',
    color: '#7B7B7B',
    fontSize: 14,

    action: {
      selectAll: {
        display: 'flex',
      },
    },

    list: {
      color: '#4E4E4E',
      actionColor: '#4A90E2',
      ...listStyle,

      header: {
        primaryColor: '#7B7B7B',
        activeColor: '#009E55',
      },

      item: {
        upColor: '#FF1F1F',
        downColor: '#009E55',
        actionColor: '#4A90E2',
        ...listItemStyle
      },
    },

    ...style
  };
};

class SpecialListItem extends React.Component {

  render () {
    const { style, data, onClick, childrenGrows } = this.props;

    return (
      <ListItem onClick={() => onClick(data)} style={style} childrenGrows={childrenGrows}>
        { data.map((label, k) => <ListItemColumn key={k} label={label} />) }
      </ListItem>
    );
  }
}


export default class TableList extends React.Component {

  static propTypes = {

    header: PropTypes.arrayOf(PropTypes.string),

    /**
     * [pageSize which like list item count]
     * @type {number}
     */
    pageSize: PropTypes.number.isRequired,

    /**
     * [currentPage]
     * @type {number}
     */
    currentPage: PropTypes.number.isRequired,

    /**
     * [totalPages]
     * @type {number}
     */
    totalPages: PropTypes.number.isRequired,

    /**
     * [data which is all list item data]
     * @type {array}
     */
    body: PropTypes.array,

    /**
     * [onPaginate which emit when paginating]
     * @type {[type]}
     */
    onPaginate: PropTypes.func,

    /**
     * list
     * @type {object}
     */
    listStyle: PropTypes.object,

    /**
     * [listItemStyle description]
     * @type {object}
     */
    listItemStyle: PropTypes.object,

    /**
     * [listItemGrows description]
     * @type {array}
     */
    listItemGrows: PropTypes.array,

    /**
     * [onListItemClick description]
     * @type {function}
     */
    onListItemClick: PropTypes.func,
  };

  static defaultProps = {
    pageSize: 10,
    currentPage: 0,
    totalPages: 0,
    onListItemClick: e=>e,
  };

  static contextTypes = {
    muiTheme: PropTypes.object,
  };

  constructor (props) {
    super(props);
  }

  data () {
    const _data = this.props.body.slice(0, this.props.pageSize);

    for (let i=_data.length; i<this.props.pageSize; ++i) {
      _data.push([]);
    }

    return _data;
  }

  render () {
    const {
      header,
      pageSize, currentPage, totalPages, onPaginate,
      listItemGrows, onListItemClick,
    } = this.props;
    const stl = getStyles(this.props, this.context);
    const data = this.data();

    return (
      <div style={stl}>

        {
          ! header ? null : (
            <ListHeader component="div" childrenGrows={listItemGrows}>
              { header.map((label, index) => <ListHeaderColumn key={index} label={label} />)}
            </ListHeader>
          )
        }

        <ListBody>
          <List style={stl.list}>
            {
              data.map((e, index) => (
                <SpecialListItem
                  key={index}
                  style={styleMerge(stl.list.item)}
                  onClick={onListItemClick}
                  childrenGrows={listItemGrows}
                  data={e}
                />)
              )
            }
          </List>
        </ListBody>

        <ListFooter style={{display: totalPages > 1 ? '' : 'none'}}>
          <ListPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={onPaginate}
          />
        </ListFooter>

      </div>
    );
  }
}
