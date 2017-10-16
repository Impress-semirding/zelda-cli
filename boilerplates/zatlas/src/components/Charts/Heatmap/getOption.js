/**
* @Author: eason
* @Date:   2017-04-05T15:16:55+08:00
* @Email:  uniquecolesmith@gmail.com
 * @Last modified by:   mark
 * @Last modified time: 2017-07-24T17:10:42+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

export default function (option, data = {}) {
  if (data.mock) {
    option = data.option ? data.option : option; // eslint-disable-line
    data = data.data; // eslint-disable-line
  }
  const { xAxis, yAxis, value } = data;
  return {
    ...option,
    xAxis: {
      ...option.xAxis,
      data: xAxis,
    },
    yAxis: {
      ...option.yAxis,
      data: yAxis,
    },
    series: [{
      name: 'Punch Card',
      type: 'heatmap',
      data: value,
      label: option.seriesLabel || {
        normal: {
          show: true,
        },
      },
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    }],
  };
}
