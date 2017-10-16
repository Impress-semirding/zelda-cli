/**
* @Author: eason
* @Date:   2017-04-05T15:16:55+08:00
* @Email:  uniquecolesmith@gmail.com
 * @Last modified by:   mark
 * @Last modified time: 2017-08-24T14:40:30+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

function seriesCreator(series, option) {
  const length = series.length;
  if (length === 0) return [];

  return series.map(e => ({
    type: 'sankey',
    layout: 'none',
    symbol: 'circle',
    label: option.label ? option.label : {},
    itemStyle: {
      normal: {
        borderWidth: 1,
        borderColor: '#aaa',
      },
    },
    lineStyle: {
      normal: {
        color: 'source',
        curveness: 0.5,
      },
    },
    data: e.nodes,
    links: e.links,
  }));
}

export default function (option, data = {}) {
  if (data.mock) {
    option = data.option ? data.option : option; // eslint-disable-line
    data = data.data; // eslint-disable-line
  }
  const { legend = [], series = [] } = data;
  return {
    ...option,
    color: Array.isArray(option.color) ? option.color : Object.values(option.color),
    legend: {
      ...option.legend,
    },
    series: seriesCreator(series, option),
  };
}
