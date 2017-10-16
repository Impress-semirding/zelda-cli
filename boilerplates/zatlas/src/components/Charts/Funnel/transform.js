/**
* @Author: eason
* @Date:   2017-05-11T14:24:59+08:00
* @Email:  uniquecolesmith@gmail.com
 * @Last modified by:   mark
 * @Last modified time: 2017-08-29T14:03:33+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

export default function transform(data, types) {
  if (data.mock) {
    return data;
  }

  const { CATEGORY = [], MEASURE = [] } = types;

  const category = CATEGORY[0] && CATEGORY[0].name;
  const measure = MEASURE[0] && MEASURE[0].name === 'COUNT(COUNT)' ? 'COUNT' : MEASURE[0].name;

  return {
    legend: data.map(e => e[category]),
    series: [{
      name: '漏斗图',
      data: data.map(e => ({
        name: e[category],
        value: e[measure],
      })),
    }],
  };
}
