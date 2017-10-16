/**
* @Author: eason
* @Date:   2017-04-05T15:16:55+08:00
* @Email:  uniquecolesmith@gmail.com
 * @Last modified by:   mark
 * @Last modified time: 2017-08-28T10:04:51+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

function seriesCreator(series) {
  const length = series.length;
  if (length === 0) return [];

  return series.map(e => ({
    type: 'funnel',
    sort: 'descending',
    gap: 2,
    labelLine: {
      normal: {
        length: 10,
        lineStyle: {
          width: 1,
          type: 'solid',
        },
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
  const { series = [], legend } = data;
  return {
    ...option,
    color: Array.isArray(option.color) ? option.color : Object.values(option.color),
    legend: {
      ...option.legend,
      data: legend,
    },
    series: seriesCreator(series),
  };
}
