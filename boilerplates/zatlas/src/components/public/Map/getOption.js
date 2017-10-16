/**
* @Author: eason
* @Date:   2017-04-05T15:16:55+08:00
* @Email:  uniquecolesmith@gmail.com
 * @Last modified by:   mark
 * @Last modified time: 2017-05-19T13:27:03+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/
const PERCENT = {
  max: 70,
  min: 0,
};

function seriesCreator(series) {
  const length = series.length;
  if (length === 0) return [];

  const one = parseInt(PERCENT.max / series.length, 10);
  const gap = parseInt(one * .35, 10);

  return series.map((e, index) => ({
    type: 'pie',
    symbol: 'circle',
    smooth: true,
    radius: [`${index === 0 ? 0 : one * (index + 1)}%`, `${one * (index + 1) + gap}%`],
    label: {
      normal: {
        position: index + 1 !== length ? 'inner': 'outer',
      },
    },
    ...e,
  }));
}

export default function (option, data = {}) {
  const { series = [] } = data;
  return {
    ...option,
    series: seriesCreator(series),
  };
}
