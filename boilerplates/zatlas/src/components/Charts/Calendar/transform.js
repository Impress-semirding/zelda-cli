/**
* @Author: eason
* @Date:   2017-05-11T14:24:59+08:00
* @Email:  uniquecolesmith@gmail.com
 * @Last modified by:   mark
 * @Last modified time: 2017-08-29T14:02:06+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

import _ from 'lodash';

export default function transform(data, types) {
  if (data.mock) {
    return data;
  }

  const { MEASURE = [], TIME = [] } = types;
  const category = TIME.length !== 0 ? `${TIME[0].method}(${TIME[0].name})` : null;
  const measures = MEASURE.map(e => (e.name === 'COUNT(COUNT)' ? 'COUNT' : e.name));

  const time = category ? data.map(e => e[category]) : [];
  time.sort((a, b) => {
    return new Date(b) - new Date(a);
  });
  const s = category && measures.length > 0 ? data.map(e => ([e[category], e[measures[0]]])) : [];

  return {
    range: [_.last(time), _.first(time)],
    series: s,
  };
}
