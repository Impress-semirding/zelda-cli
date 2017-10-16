/**
* @Author: eason
* @Date:   2017-04-20T14:13:35+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2017-05-26T14:36:37+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

export default class DataTransformer {

  constructor(props) {
    if (props) {
      this.transform = props;
    }
  }

  transform = (data, map) => {
    const { categoryData, legendData } = this.buildCategory(data, map);
    const flattenedCategory = this.flattenCategory(categoryData, map.category);
    return this.produce(flattenedCategory, map.measure, legendData);
  }

  buildCategory = (data, map) => {
    const { category: categoryMap, measure: measureMap, legend: legendMap } = map;

    const categoryData = {};
    const legendKey = {};

    data.forEach((item) => {
      let oneCategoryData = categoryData;
      categoryMap.forEach((name) => {
        const category = item[name];
        oneCategoryData = categoryData[category] = categoryData[category] || {};
      });

      measureMap.forEach((name) => {
        oneCategoryData[name] = oneCategoryData[name] || {};
        if (legendMap.length) {
          const legend = [];
          legendMap.forEach((lname) => {
            legend.push(item[lname]);
          });
          legendKey[legend.join('/')] = 1;
          oneCategoryData[name][legend.join('/')] = item[name];
        } else {
          oneCategoryData[name] = item[name];
        }
      });
    });

    return {
      categoryData,
      legendData: Object.keys(legendKey),
    };
  }

  flattenCategory = (categoryData, categoryMap) => {
    const deepin = (path, node, current, max) => {
      current += 1; // eslint-disable-line
      if (current > max) {
        return [{
          path,
          data: node,
        }];
      }

      const result = [];
      Object.keys(node).forEach((key) => {
        const newPath = [].concat(path).concat([key]);
        if (current === max) {
          result.push({
            path: newPath,
            data: node[key],
          });
        } else {
          result.push(deepin(newPath, node[key], current, max));
        }
      });
      return result;
    };

    return deepin([], categoryData, 0, categoryMap.length);
  }

  produce = (flattenedCategory, measureMap, legend) => {
    const series = [];
    const category = [];
    const mapLegend = {};
    flattenedCategory.forEach(({ path, data }) => {
      category.push(path[0]);
      // const sumMeasureMap = measureMap.map(name => {
      //   const vData = Object.values(data[name])
      //   return {
      //     length: vData.length,
      //     res: 100,
      //     sum: vData.reduce((m, n) => m + n, 0)
      //   };
      // });

      measureMap.forEach((mname, mindex) => {
        // let { length, res, sum } = sumMeasureMap[mindex];
        if (legend.length) {
          legend.forEach((lname, lindex) => {
            const actualIndex = (mindex * legend.length) + lindex;
            const legendItem = `${mname}/${lname}`;
            mapLegend[legendItem] = 1;
            series[actualIndex] = {
              name: legendItem,
              // type: 'bar',
              stackName: mname,
              data: ((series[actualIndex] && series[actualIndex].data) || []).concat(
                Object.keys(data[mname]).map(name => ({ name, value: data[mname][name] })),
              ),
              // percent: Object.keys(data[mname]).map((name, index) => {
              //   if (index === length - 1) {
              //     return res;
              //   }
              //   const value = parseInt(data[mname][name] / sum * 100, 10);
              //   res -= value;
              //   return value;
              // }),
            };
            // series[actualIndex].data.push(data[mname] || 0);
            // series[actualIndex].data = [].concat(
            //   Object.keys(data[mname]).map(name => ({ name, value: data[mname][name] })),
            // );
          });
        } else {
          mapLegend[mname] = series[mindex];
          series[mindex] = {
            // type: 'bar',
            name: mname,
            stackName: mname,
            data: ((series[mindex] && series[mindex].data) || []).concat(
              [{ name: mname, value: data[mname] }],
            ),
            // percent: Object.keys(data[mname]).map((name, index) => {
            //   if (index === length - 1) {
            //     return res;
            //   }
            //   const value = parseInt(data[mname][name] / sum * 100, 10);
            //   res -= value;
            //   return value;
            // }),
          };
          // series[mindex].data.push(data[mname] || 0);
          // series[mindex].data = [].concat(
          //   // Object.keys(data[mname]).map(name => ({ name, value: data[mname][name] })),
          //   [{ name: mname, value: data[mname] }],
          // );
        }
      });
    });

    return {
      category,
      series,
      legend: Object.keys(mapLegend),
    };
  };
}
