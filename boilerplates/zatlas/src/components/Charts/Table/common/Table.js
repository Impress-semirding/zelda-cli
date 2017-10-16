/**
* @Author: eason
* @Date:   2016-12-01T14:43:44+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2016-12-08T20:42:17+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/



import React, {PropTypes} from 'react';

import Checkbox from 'material-ui/Checkbox';

import {
  ListHeader, ListBody, ListFooter,
  List, ListItem, ListItemColumn,
  ListPagination,
  ListHeaderColumn, ListHeaderColumnWithFilter,
} from '../index';


const getStyles = (props, context) => {
  const {list} = context.muiTheme;
  const {
    style,
    listStyle,
    listItemStyle
  } = props;

  return {
    padding: '1rem 1.5rem',
    color: '#7B7B7B',
    fontSize: 12,

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

    ...style,
  };
};

class SpecialListItem extends React.Component {

  render () {
    const {
      style,
      data,
      onCheck,
      childrenGrows
    } = this.props;

    const {id, checked, actions, progress, ...others} = data;
    const {value: pValue, color: pColor} = progress || {
      value: 0,
      color: 'rgba(208, 1, 27, 0.08)'
    };

    return (
      <ListItem childrenGrows={childrenGrows} style={style}>
        <div style={{
            zIndex: -10,
            position:'absolute',
            left: 0, top: 0,
            height: '100%', width: pValue * 100 + '%',
            backgroundColor: pColor,
          }}
        ></div>
        <ListItemColumn
          style={{flex: 'none', visibility: id ? 'visible' : 'hidden'}}
          label={<Checkbox onCheck={(event, checked) => onCheck(id, checked)} checked={checked} />}
        />
        {
          Object.values(others).map((label, k) => <ListItemColumn style={{ flex: k === 0 ? 1.5 : 1}} key={k} label={label} />)
        }
        <ListItemColumn style={{display: id ? '' : 'none'}}>
          {actions.map(({label, handler}, i) => (
            <a
              key={i}
              style={{cursor: 'pointer', padding: '0 2px', color: style.actionColor}}
              onClick={() => handler(id)}
            >
              {label}
            </a>
          ))}
        </ListItemColumn>
      </ListItem>
    );
  }
}


export default class CheckboxList extends React.Component {

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
     * [onSelect which emit when un/selectAll or un/selectone]
     * @type {[type]}
     */
    // onSelect: PropTypes.func.isRequired,

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
    batchActions: [{label: '批量撤销', handler: e=>e}],
    itemActions: [{label: '撤销', handler: e=>e}],
  };

  static contextTypes = {
    muiTheme: PropTypes.object,
  };

  state = {
    filter: {}, // {key: value}
    selectedAll: false,
    selected: [],
  };

  constructor (props) {
    super(props);

    // this.onFilter = this.onFilter.bind(this);
    this.onSelectAll = this.onSelectAll.bind(this);
    this.onSelectOne = this.onSelectOne.bind(this);
  }

  data () {
    const _data = this.props.body
      .slice(0, this.props.pageSize)
      .map(
        ({id, ...other}) => ({id, ...other, checked: this.state.selected.includes(id)})
      );

    for (let i=_data.length; i<this.props.pageSize; ++i) {
      _data.push({});
    }

    return _data;
  }

  // onFilter (key, value) {
  //   this.props.onFilter(key, value);
  // }

  onSelectAll (event, checked) {
    this.setState({
      selectedAll: checked,
      selected: !checked ? [] : this.props.body.map(({id}) => id),
    });
  }

  onSelectOne (id, checked) {
    this.setState({
      selectedAll: false,
      selected: checked ? [...this.state.selected, id] : this.state.selected.filter(e => e!=id),
    });
  }

  render () {
    const {
      header,
      pageSize, currentPage, totalPages, onPaginate, onFilter, onSort,
      listItemGrows
    } = this.props;
    const stl = getStyles(this.props, this.context);
    const data = this.data();

    return (
      <div style={stl}>

        <div style={stl.action.selectAll}>
          <div style={{flex: 'none'}}><Checkbox onCheck={this.onSelectAll} checked={this.state.selectedAll} /></div>
          <div style={{display: 'flex', alignItems: 'center'}}>全选</div>
          {
            this.props.batchActions.map(({label, handler}, i) => (
              <a
                key={i}
                style={{cursor: 'pointer', marginLeft: 24, color: stl.list.actionColor, display: 'flex', alignItems: 'center'}}
                onClick={() => handler(this.state.selected)}
              >
                {label}
              </a>
            ))
          }
        </div>

        <ListHeader childrenGrows={listItemGrows}>
          <ListHeaderColumn style={{flex: 'none', visibility: 'hidden'}}><Checkbox /></ListHeaderColumn>
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

        <ListBody>
          <List style={stl.list}>
            {
              data.map((e, index) => (
                <SpecialListItem
                  style={stl.list.item}
                  key={index}
                  onCheck={this.onSelectOne}
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
