/**
* @Author: eason
* @Date:   2017-03-06T17:46:52+08:00
* @Email:  uniquecolesmith@gmail.com
 * @Last modified by:   mark
 * @Last modified time: 2017-07-19T16:48:02+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/
import echarts from 'echarts';

module.exports = {
  backgroundColor: 'transparent',
  title: {
    show: true,
    text: '日历图',
    color: '#000000',
    left: '20px',
    textAlign: 'left',
  },
  tooltip: {
    position: 'top',
    formatter: (p) => {
      const format = echarts.format.formatTime('yyyy-MM-dd', p.data[0]);
      return `${format}: ${p.data[1]}`;
    },
  },
  visualMap: {
    orient: 'vertical',
    left: '670',
    top: 'center',
    pieces: [
      {
        gte: 0,
        lt: 1,
        color: '#E84A51',
      }, {
        gte: 1,
        lt: 2,
        color: '#F8D664',
      }, {
        gte: 2,
        lt: 3,
        color: '#8FEDD4',
      }, {
        gte: 3,
        color: '#3CCCA5',
      },
    ],
  },

  calendar: [
    {
      orient: 'horizontal',
      // range: [
      //   '2017-02', '2017-04',
      // ],
      // dayLabel: {
      //   firstDay: 1,
      //   nameMap: [
      //     '周日',
      //     '周一',
      //     '周二',
      //     '周三',
      //     '周四',
      //     '周五',
      //     '周六'
      //   ],
      // },
      // monthLabel: {
      //   nameMap: [
      //     '01月',
      //     '02月',
      //     '03月',
      //     '04月',
      //     '05月',
      //     '06月',
      //     '07月',
      //     '08月',
      //     '09月',
      //     '10月',
      //     '11月',
      //     '12月',
      //   ],
      // },
      yearLabel: {
        show: false,
      },
    },
  ],
};
