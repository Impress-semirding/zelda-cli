/**
* @Author: eason
* @Date:   2017-04-05T00:52:33+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2017-05-22T15:39:23+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/
import echarts from 'echarts';

function getVirtulData(year) {
  year = year || '2017';
  const date = +echarts.number.parseDate(year + '-01-01');
  const end = +echarts.number.parseDate((+ year + 1) + '-01-01');
  const dayTime = 3600 * 24 * 1000;
  const data = [];
  for (let time = date; time < end; time += dayTime) {
    data.push([
      echarts.format.formatTime('yyyy-MM-dd', time),
      Math.floor(Math.random() * 1000)
    ]);
  }
  return data;
}

export default {
  range: '2017',
  series: getVirtulData(),
};
