/**
* @Author: eason
* @Date:   2017-05-15T14:46:13+08:00
* @Email:  uniquecolesmith@gmail.com
 * @Last modified by:   mark
 * @Last modified time: 2017-08-29T14:02:14+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

import { uniq, flattenDepth, find } from 'lodash';

module.exports = (data, types, feedings) => {
  if (data.mock) {
    return data;
  }

  const { CATEGORY = [], MEASURE = [], TIME = [] } = types;
  const COLOR = feedings.COLOR || [];

  const category = TIME.length !== 0 ? `${TIME[0].method}(${TIME[0].name})` : CATEGORY[0].name;
  const measures = MEASURE.map(e => (e.name === 'COUNT(COUNT)' ? 'COUNT' : e.name));
  const legends = COLOR
    .map(e => [e.name])
    .map(([e]) => [e, uniq(data.map(d => d[e]))]); // [ ['type', ['online', 'shop'] ], []]

  let legend;
  let series;

  const uniqCategory = uniq(data.map(e => e[category]));
  if (legends.length > 0) {
    legend = flattenDepth(measures.map((m) => {
      return legends.map(l => l[1].map(v => `${m}/${v}`));
    }), 2);
    series = flattenDepth(legends.map(([type, values]) =>
      values.map((v) => {
        return measures.map((m) => {
          const fData = data.filter(d => d[type] === v);
          return {
            name: `${m}/${v}`,
            stackName: 'measure',
            data: uniqCategory.map((value) => {
              const item = find(fData, { [category]: value });
              if (item) {
                return item[m];
              } else {
                return '-';
              }
            }),
          };
        });
      }),
    ), 2);
  } else {
    legend = measures;
    series = measures.map(m => ({
      name: m,
      data: data.map(e => ({
        name: e[category],
        value: e[m],
      })),
    }));
  }

  return {
    legend,
    category: uniqCategory,
    series,
  };
};
