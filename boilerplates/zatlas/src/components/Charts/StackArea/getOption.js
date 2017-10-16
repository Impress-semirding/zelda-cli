/**
* @Author: eason
* @Date:   2017-04-05T15:16:55+08:00
* @Email:  uniquecolesmith@gmail.com
 * @Last modified by:   mark
 * @Last modified time: 2017-09-07T12:44:19+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

function formatter(params) {
  if (!Array.isArray(params)) return;
  return `
    ${
      params.map(({
        color,
        seriesName,
        value,
      }) => `
        <span style="
          background-color: ${color};
          display: inline-block;
          width: 6px;
          height: 6px;
          line-height:
          6px;border-radius: 3px;">
        </span>
        ${seriesName}: ${value}<br />
      `).join('')
    }
  `;
}

function seriesCreator(series) {
  return series.map(e => ({
    type: 'line',
    symbol: 'circle',
    smooth: true,
    stack: 'STACK@TODO',
    areaStyle: { normal: {
      opacity: 0.6,
    } },
    ...e,
  }));
}

export default function (option, data = {}) {
  if (data.mock) {
    option = data.option ? data.option : option; // eslint-disable-line
    data = data.data; // eslint-disable-line
  }
  const { tooltip, xAxis } = option;
  const { legend, category: labels, series = [] } = data;
  return {
    ...option,
    color: Array.isArray(option.color) ? option.color : Object.values(option.color),
    dataZoom: Array.isArray(option.dataZoom) ? option.dataZoom : Object.values(option.dataZoom),
    legend: {
      ...option.legend,
      data: legend,
    },
    tooltip: {
      ...tooltip,
      formatter,
    },
    xAxis: {
      ...xAxis,
      data: labels || [],
    },
    series: seriesCreator(series),
  };
}
