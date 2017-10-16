/**
* @Author: eason
* @Date:   2016-12-01T14:43:44+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2017-06-20T20:05:12+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/



import React from 'react';
import PropTypes from 'prop-types';
import styleMerge from 'style-merge';

import {
  ListHeader, ListBody, ListFooter,
  List, ListItem, ListItemColumn,
  ListPagination,
  ListHeaderColumn, ListHeaderColumnWithFilter,
} from '../base';

// import IconInfo from 'IMGS/info.svg';

const getStyles = (props, context) => {
  const {list} = context.muiTheme;
  const {
    style,
    listStyle, listItemStyle,
  } = props;

  return {
    // padding: '1rem 1.5rem',
    color: '#7B7B7B',
    fontSize: 14,
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'flex-start',

    listHeader: {
      flex: '0 1 2rem',
      // paddingLeft: 10,
    },

    listBody: {
      flex: 1,
      display: 'flex',
    },

    action: {
      selectAll: {
        display: 'flex',
      },
    },

    list: {
      color: '#4E4E4E',
      actionColor: '#4A90E2',
      flex: 1,
      ...listStyle,

      empty: {
        textAlign: 'center',
        display: props.body.length === 0 ? 'flex' : 'none',
        justifyContent: 'center',
        alignItems: 'center',
      },

      header: {
        primaryColor: '#7B7B7B',
        activeColor: '#009E55',
      },

      item: {
        upColor: '#FF1F1F',
        downColor: '#009E55',
        actionColor: '#4A90E2',
        ...listItemStyle,
      },
    },

    ...style
  };
};

class SpecialListItem extends React.Component {

  render () {
    const {
      style,
      data,
      onClick,
      childrenGrows
    } = this.props;

    const {id, actions, progress, ...others} = data;
    const {
      value: pValue,
      color: pColor,
      pullRight
    } = progress || {
      value: 0,
      color: 'rgba(208, 1, 27, 0.08)'
    };

    if (id === undefined) return <div></div>;

    return (
      <ListItem style={style} childrenGrows={childrenGrows}>
        <div style={{
            zIndex: -10,
            position:'absolute',
            [pullRight ? 'right': 'left']: 0, top: 0,
            height: '100%', width: pValue * 100 + '%',
            backgroundColor: pColor,
          }}
        ></div>
        {
          Object.values(others).map((label, k) => <ListItemColumn key={k} style={{ flex: k === 0 ? 1.5 : 1}} label={label} />)
        }
      </ListItem>
    );
  }
}


export default class PlainList extends React.PureComponent {

  static propTypes = {

    header: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.any.isRequired,
      type: PropTypes.string,
      labelName: PropTypes.string,
      labelStyle: PropTypes.object,
      filters: PropTypes.array,
      // onChange: PropTypes.func,
    })),

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
    body: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.any.isRequired
    })).isRequired,

    /**
     * [onPaginate which emit when paginating]
     * @type {[type]}
     */
    onPaginate: PropTypes.func,

    /**
     * [onFilter filter]
     * @type {function}
     */
    onFilter: PropTypes.func,

    /**
     * when type equals sort, it must.
     * @type {function}
     */
    onSort: PropTypes.func,

    /**
     * [batchActions 批量动作， 如批量撤销]
     * @type {array}
     */
    batchActions: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      handler: PropTypes.func.isRequired,
    })),

    /**
     * itemActions
     * @type {array}
     */
    itemActions: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      handler: PropTypes.func.isRequired,
    })),

    /**
     * list
     * @type {object}
     */
    listStyle: PropTypes.object,

    /**
     * [listItemStyle description]
     * @type {[type]}
     */
    listItemStyle: PropTypes.object,

    /**
     * [listItemGrows description]
     * @type {[type]}
     */
    listItemGrows: PropTypes.array,
  };

  static defaultProps = {
    pageSize: 10,
    currentPage: 0,
    totalPages: 0,
    header: [],
    body: [],
    batchActions: [{label: '批量撤销', handler: e=>e}],
    itemActions: [{label: '撤销', handler: e=>e}],
  };

  static contextTypes = {
    muiTheme: PropTypes.object,
  };

  state = {
    filter: {}, // {key: value}
  };

  constructor (props) {
    super(props);

    this.onFilter = this.onFilter.bind(this);
  }

  data () {
    const _data = this.props.body.slice(0, this.props.pageSize);

    for (let i=_data.length; i<this.props.pageSize; ++i) {
      _data.push({});
    }

    return _data;
  }

  onFilter (key, value) {
    this.props.onFilter(key, value);
  }

  render () {
    const {
      header,
      pageSize, currentPage, totalPages, onPaginate,
      listItemGrows,
    } = this.props;
    const stl = getStyles(this.props, this.context);
    const data = this.data();

    return (
      <div style={stl}>

        <ListHeader component="div" style={stl.listHeader} childrenGrows={listItemGrows}>
          {
            header.map((e, index) => (
              <ListHeaderColumn
                key={index}
                style={{ flex: index === 0 ? 1.5 : 1, fontSize: stl.fontSize }}
                onFilter={this.props.onFilter}
                onSort={this.props.onSort}
                {...e}
              />
            ))
          }
        </ListHeader>

        <ListBody style={stl.listBody}>
          <List style={stl.list}>
            <div style={stl.list.empty}>
              {/* <IconInfo style={{ width: 16, height: 16 }}/> */}
              <span style={{padding: '0 8px'}}>没有数据</span>
              <div style={{cursor: 'pointer', padding: '0 8px', display: this.props.triggerLoadingData ? '' : 'none'}} onClick={this.props.triggerLoadingData}>点击加载数据</div>
            </div>
            {
              data.map((e, index) => (
                <SpecialListItem
                  style={styleMerge(stl.list.item, {paddingLeft: 10})}
                  key={index}
                  childrenGrows={listItemGrows}
                  data={{...e, actions: this.props.itemActions}}
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
