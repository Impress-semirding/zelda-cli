/**
* @Author: eason
* @Date:   2017-04-05T15:16:55+08:00
* @Email:  uniquecolesmith@gmail.com
 * @Last modified by:   mark
 * @Last modified time: 2017-09-07T14:08:17+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

function seriesCreator(series, option, names) {
  const length = series.length;
  if (length === 0) return [];

  return series.map(e => ({
    type: 'scatter',
    symbol: 'circle',
    symbolSize(data) {
      return option.symbolSize; // Math.sqrt(parseInt(data[0], 10)) / 10;
    },
    label: {
      emphasis: {
        show: false,
        formatter(param) {
          return param.data.map((d, i) => `${names && names[i]}: ${d}`).join('\n');
        },
        position: 'top',
      },
    },
    ...e,
  }));
}

export default function (option, data = {}) {
  if (data.mock) {
    option = data.option ? data.option : option; // eslint-disable-line
    data = data.data; // eslint-disable-line
  }
  const { names, legend = [], series = [], yAxis = [], xAxis= [] } = data;
  return {
    ...option,
    color: Array.isArray(option.color) ? option.color : Object.values(option.color),
    dataZoom: Array.isArray(option.dataZoom) ? option.dataZoom : Object.values(option.dataZoom),
    legend: {
      ...option.legend,
      data: legend,
    },
    xAxis: {
      ...option.xAxis,
      data: xAxis.length > 0 ? xAxis : null,
    },
    yAxis: {
      ...option.yAxis,
      data: yAxis.length > 0 ? yAxis : null,
    },
    series: seriesCreator(series, option, names),
  };
}
