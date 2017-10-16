/**
* @Author: eason
* @Date:   2017-05-11T14:24:59+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2017-06-08T11:10:33+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

export default function transform(data, types) {
  const { CATEGORY, MEASURE } = types;

  const [category, measure] = [
    CATEGORY.map(e => e.name),
    MEASURE.map(e => e.name),
  ];

  const categories = {};

  category.forEach((cat) => {
    const t = {};
    data.forEach((d) => {
      t[d[cat]] = true;
    });

    categories[cat] = Object.keys(t);
  });

  const series = measure.map((m) => {
    return {
      name: m,
      data: data.map((d) => {
        return {
          name: d[category[0]],
          value: d[m],
        };
      }),
    };
  });

  return {
    series,
  };
}
