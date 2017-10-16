/**
* @Author: eason
* @Date:   2017-03-06T17:46:52+08:00
* @Email:  uniquecolesmith@gmail.com
 * @Last modified by:   mark
 * @Last modified time: 2017-09-06T11:22:57+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

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
    text: '簇型条形图',
    color: '#000000',
    left: '20px',
    textAlign: 'left',
  },
  legend: {
    show: true,
    width: 'auto',
    left: 'auto',
    top: '10px',
    right: 'auto',
    bottom: 'auto',
    textStyle: {
      color: '#333',
      fontSize: 12,
    },
  },
  dataZoom: [{
    type: 'inside',
    orient: 'vertical',
  }],
  tooltip: {
    show: true,
    trigger: 'axis',
    backgroundColor: 'rgba(50, 50, 50, 0.7)',
    textStyle: {
      color: '#fff',
    },
  },
  grid: {
    show: false,
    left: '10%',
    top: '20px',
    right: '10%',
    bottom: '60px',
    width: 'auto',
    height: 'auto',
    containLabel: false,
  },
  xAxis: {
    show: true,
    type: 'value',
    splitLine: {
      show: true,
      lineStyle: {
        color: '#ccc',
        type: 'dashed',
      },
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#333',
      },
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: '#333',
      },
    },
    axisLabel: {
      show: true,
      inside: false,
      rotate: '0',
      margin: '8',
      textStyle: {
        fontSize: 10,
        color: '#666666',
      },
    },
  },
  yAxis: {
    show: true,
    type: 'category',
    inverse: false, // 是否反向坐标轴
    splitLine: {
      show: true,
      lineStyle: {
        color: '#ccc',
        type: 'dashed',
      },
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#333',
      },
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: '#333',
      },
    },
    axisLabel: {
      show: true,
      inside: false,
      rotate: '0',
      margin: '8',
      textStyle: {
        fontSize: 10,
        color: '#666666',
      },
    },
  },
  bar: {
    barWidth: 'auto',
    label: {
      normal: {
        show: false,
        position: 'right',
        formatter: '{c}',
        textStyle: {
          color: '#000',
        },
      },
    },
  },
  labelOnRight: false,
  labelOnRightColor: '#ccc',
};
