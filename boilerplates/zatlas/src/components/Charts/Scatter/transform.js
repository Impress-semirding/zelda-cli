/**
* @Author: eason
* @Date:   2017-05-11T14:24:59+08:00
* @Email:  uniquecolesmith@gmail.com
 * @Last modified by:   mark
 * @Last modified time: 2017-09-07T13:47:27+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

import _ from 'lodash';

const sortArray = (object: Object, sort: Array) => {
  return sort.map(e => object[e]);
};

export default function transform(data, types, feedings) {
  if (data.mock) {
    return data;
  }

  const { CATEGORY = [], MEASURE = [] } = types;

  const [category, measure] = [
    CATEGORY.map(e => e.name),
    MEASURE.map(e => (e.name === 'COUNT(COUNT)' ? 'COUNT' : e.name)),
  ];

  const cat = category[0];
  const legendObj = {};

  data.forEach((e) => {
    legendObj[e[cat]] = 1;
  });

  const legend = Object.keys(legendObj);
  let series = [];
  let names = [];
  let yAxisData = [];
  let xAxisData = [];
  if (MEASURE.length === 2) {
    names = [].concat(measure).concat(category);

    series = legend.map((name) => {
      return {
        name,
        data: data
          .filter(e => e[cat] === name)
          .map(e => sortArray(e, names)),
      };
    });
  } else if (CATEGORY.length === 3) {
    const [, xAxis, yAxis] = category;

    yAxisData = _.uniq(data.map(e => e[yAxis]));
    xAxisData = _.uniq(data.map(e => e[xAxis]));

    names = [].concat(category);

    series = legend.map((name) => {
      return {
        name,
        data: data
          .filter(e => e[cat] === name)
          .map((e) => {
            return [xAxisData.indexOf(e[xAxis]), yAxisData.indexOf(e[yAxis])];
          }),
      };
    });
  } else if (CATEGORY.length === 2 && MEASURE.length === 1) {
    const [, xAxis] = category;

    xAxisData = _.uniq(data.map(e => e[xAxis]));

    names = [].concat(category).concat(measure);

    series = legend.map((name) => {
      return {
        name,
        data: data
          .filter(e => e[cat] === name)
          .map((e) => {
            return [xAxisData.indexOf(e[xAxis]), e[measure]];
          }),
      };
    });
  }

  return {
    legend,
    series,
    names,
    yAxis: yAxisData,
    xAxis: xAxisData,
  };
}
