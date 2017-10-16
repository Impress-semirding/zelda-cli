/**
* @Author: eason
* @Date:   2017-05-11T14:24:59+08:00
* @Email:  uniquecolesmith@gmail.com
 * @Last modified by:   mark
 * @Last modified time: 2017-08-29T14:04:23+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/
import flatten from 'lodash.flatten';

const _ = (object: Object, sort: Array) => {
  return sort.map(e => object[e]);
};

export default function transform(data, types) {
  if (data.mock) {
    return data;
  }

  const { CATEGORY = [], MEASURE = [] } = types;

  const map = {
    category: CATEGORY.map(e => e.name),
    measure: MEASURE.map(e => (e.name === 'COUNT(COUNT)' ? 'COUNT' : e.name)),
  };
  const { category: [source, target], measure: [value] } = map;

  const names = [source, target, value];

  const series = [{
    nodes: [...new Set(flatten(data.map(e => _(e, [source, target]))))].map(e => ({ name: e })),
    links: data.map(e => ({
      source: e[source],
      target: e[target],
      value: e[value],
    })),
  }];

  return {
    names,
    series,
  };
}
