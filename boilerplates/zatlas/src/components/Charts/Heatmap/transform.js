/**
* @Author: eason
* @Date:   2017-05-11T14:24:59+08:00
* @Email:  uniquecolesmith@gmail.com
 * @Last modified by:   mark
 * @Last modified time: 2017-08-29T14:04:03+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/
// import flatten from 'lodash.flatten';

import _ from 'lodash';

// const _ = (object: Object, sort: Array) => {
//   return sort.map(e => (object[e] != null ? object[e] : '-'));
// };

export default function transform(data, types) {
  if (data.mock) {
    return data;
  }

  const { CATEGORY = [], MEASURE = [] } = types;

  const map = {
    category: CATEGORY.map(e => e.name),
    measure: MEASURE.map(e => (e.name === 'COUNT(COUNT)' ? 'COUNT' : e.name)),
  };

  const { category: [yAxis, xAxis], measure: [value] } = map; // eslint-disable-line

  const yAxisData = _.uniq(data.map(e => e[yAxis]));
  const xAxisData = _.uniq(data.map(e => e[xAxis]));

  const valueData = data.map(e => {
    return [xAxisData.indexOf(e[xAxis]), yAxisData.indexOf(e[yAxis]), e[value]];
  });

  return {
    yAxis: yAxisData,
    xAxis: xAxisData,
    value: valueData,
  };
}
