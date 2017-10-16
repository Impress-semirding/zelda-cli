/**
* @Author: eason
* @Date:   2017-04-05T15:16:55+08:00
* @Email:  uniquecolesmith@gmail.com
 * @Last modified by:   mark
 * @Last modified time: 2017-09-06T11:21:35+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/
const PERCENT = {
  max: 70,
  min: 0,
};

function seriesCreator(series, option) {
  const length = series.length;
  if (length === 0) {
    return [{
      type: 'pie',
      symbol: 'circle',
      data: [],
    }];
  }

  const one = parseInt((option.maxRadius || PERCENT.max) / series.length, 10);
  const minR = parseInt(option.minRadius || PERCENT.min, 10);
  const gap = parseInt(one * 0.35, 10);

  return series.map((e, index) => ({
    type: 'pie',
    symbol: 'circle',
    smooth: true,
    selected: false,
    radius: [`${index === 0 ? minR : one * (index + 1)}%`, `${one * (index + 1) + gap}%`], // eslint-disable-line
    label: {
      normal: {
        show: option.showLabel,
        position: index + 1 !== length ? 'inner' : 'outer',
        formatter: (params) => {
          return `${params.name} ${(params.percent - 0).toFixed(0)}%`;
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
    legend: {
      ...option.legend,
      data: legend,
    },
    series: seriesCreator(series, option),
  };
}
