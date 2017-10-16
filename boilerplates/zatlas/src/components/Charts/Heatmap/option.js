/**
* @Author: eason
* @Date:   2017-03-06T17:46:52+08:00
* @Email:  uniquecolesmith@gmail.com
 * @Last modified by:   mark
 * @Last modified time: 2017-08-29T17:10:40+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/
// import echarts from 'echarts';

module.exports = {
  backgroundColor: 'transparent',
  title: {
    show: true,
    text: '热力图',
    color: '#000000',
    left: '20px',
    textAlign: 'left',
  },
  tooltip: {
    show: true,
    trigger: 'item',
    backgroundColor: 'rgba(50, 50, 50, 0.7)',
    textStyle: {
      color: '#fff',
    },
  },
  grid: {
    show: false,
    width: 'auto',
    left: '10%',
    top: '40px',
    right: '10%',
    bottom: '60px',
    width: 'auto',
    height: 'auto',
    containLabel: false,
  },
  xAxis: {
    type: 'category',
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
    splitArea: {
      show: true,
    },
  },
  yAxis: {
    type: 'category',
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
    splitArea: {
      show: true,
    },
  },
  seriesLabel: {
    normal: {
      show: true,
    },
  },
  visualMap: {
    min: '0',
    max: '10',
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    top: 'auto',
    bottom: '0',
    right: 'auto',
    textStyle:{
      color : '#000',
      fontSize: '12'
    },
    inRange: {
      color: [
        '#0091EA',
        '#A13FC3',
      ],
    },
  },
};
