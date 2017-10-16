<!--
@Author: eason
@Date:   2016-12-06T18:55:13+08:00
@Email:  uniquecolesmith@gmail.com
@Last modified by:   eason
@Last modified time: 2016-12-06T20:19:39+08:00
@License: MIT
@Copyright: Eason(uniquecolesmith@gmail.com)
-->



# List
==================
* 包含基础列表组件和常用列表组件

### Usage

```jsx
import { List, ListItem, ListItemColumn, ListHeader, ListBody, ListFooter } from 'COMPONENTS/List';
import { ListPagination, ListHeaderColumnWithFilter, ListHeaderColumnWithSort}

render () {

  return (
      <div>
        <ListHeader> ... </ListHeader>

        <ListBody> ... </ListBody>

        <ListFooter> ... </ListFooter>
      </div>
  );
}
```

### Common List Example

``` jsx
import Input from 'COMPONENTS/List/CommonList'

const header = [
  { label: '时间'},
  { label: '买卖方向', type: 'filter', labelName: 'tradeType', filters: ['买入', '卖出'] },
  { label: '委托类型', type: 'filter', labelName: 'commissionType', filters: ['市价', '限价'] },
  { label: '委托数' },
  { label: '委托价格' },
  { label: '尚未成交' },
  { label: '平均成交价' },
  { label: '状态/操作' },
];

const data = [
  {
    id: 1,
    time: '2016-12-13 23:22:10',
    tradeType: '买入',
    commissionType: '市价',
    commissionCount: 1999,
    commissionPrice: '¥ 4628.18',
    noDeal: '¥ 1628.18',
    averagePrice: '现货账户',
    progress: {
      value: .3,
      color: 'rgba(208,1,27,0.08)',
      pullRight: true
    }
  },
  {
    id: 2,
    time: '2016-12-13 23:22:10',
    tradeType: '卖出',
    commissionType: '限价',
    commissionCount: 1999,
    commissionPrice: '¥ 4628.18',
    noDeal: '¥ 1628.18',
    averagePrice: '现货账户',
  },
  {
    id: 3,
    time: '2016-12-13 23:22:10',
    tradeType: '买入',
    commissionType: '市价',
    commissionCount: 1999,
    commissionPrice: '¥ 4628.18',
    noDeal: '¥ 1628.18',
    averagePrice: '现货账户',
    progress: {
      value: .55,
      color: 'rgba(0, 159, 82, 0.08)'
    },
  },
  {
    id: 4,
    time: '2016-12-13 23:22:10',
    tradeType: '卖出',
    commissionType: '市价',
    commissionCount: 1999,
    commissionPrice: '¥ 4628.18',
    noDeal: '¥ 1628.18',
    averagePrice: '现货账户',
  },
];


...

render() {
  return (
    <CommonList
      type='checkbox'
      header={header}
      body={data}
      onPaginate={this.onPaginate}
      onFilter={this.onFilter}
      batchActions={[{ label: '批量撤销', handler: d => console.log(d) }]}
      itemActions={[
        { label: '撤销', handler: d => console.log(d) },
      ]}
    />
  );
}
```

## Props列表
| Name             | Type        | Default   | Description           |
| ---------------- | ----------- | --------- | --------------------- |
| type             | String      | plain     | List type in [checkbox, plain, table] |
| header           | array       | -         | `Required`            |
| body             | array       | -         | `Required`            |
| pageSize         | number      | 10        | Each page item count  |
| currentPage      | number      | 0         |                       |
| totalPages       | number      | 0         |                       |
| onPaginate       | func        | -         | paginate function     |
| onFilter         | func        | -         | filter function       |
| onSort           | func        | -         | sort function         |
| batchActions     | array       | []        | 批量操作s               |
| itemActions      | array       | []        | Each item actions     |
