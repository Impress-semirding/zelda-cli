/**
* @Author: eason
* @Date:   2017-03-06T17:46:52+08:00
* @Email:  uniquecolesmith@gmail.com
 * @Last modified by:   mark
 * @Last modified time: 2017-07-19T16:55:03+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/
// import echarts from 'echarts';

module.exports = {
  backgroundColor: 'transparent',
  color: [
    '#0091EA',
    '#A13FC3',
    '#98C2CF',
    '#6FB3F1',
    '#4CBFCF',
    '#61D6B1',
    '#A0E896',
    '#E7F59B',
    '#D3C24B',
    '#536572',
  ],
  title: {
    show: true,
    text: '桑基图',
    color: '#000000',
    left: '20px',
    textAlign: 'left',
  },
  tooltip: {
    show: true,
    trigger: 'item',
    triggerOn: 'mousemove',
    backgroundColor: 'rgba(50, 50, 50, 0.7)',
    textStyle: {
      color: '#fff',
    },
  },
  label: {
    normal: {
      show: true,
      position: 'right',
      textStyle: {
        color: '#000',
      },
    },
  },
};
