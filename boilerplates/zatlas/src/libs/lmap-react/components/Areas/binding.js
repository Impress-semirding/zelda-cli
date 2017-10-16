/*
* @Author: zhouningyi
* @Date:   2017-06-20 21:10:49
* @Last Modified by:   zhouningyi
* @Last Modified time: 2017-06-27 00:46:23
*/

'use strict';
export default [{
  name: '填充色',
  key: 'value',
  type: 'CATEGORY|MEASURE',
  bindingType: 'raw',
  accept: [0, 1],
  // target: 'style.fillColor'
}, {
  name: '浮窗',
  key: 'popup',
  type: 'MEASURE',
  bindingType: 'popup',
  accept: [1, Infinity]
}, {
  name: '唯一识别(geojson.id)',
  key: 'geoid',
  type: 'CATEGORY',
  bindingType: 'geoid',
  accept: [0, 1]
}, {
  name: '唯一识别(id)',
  key: 'id',
  type: 'CATEGORY',
  bindingType: 'raw',
  accept: [0, 1]
}];

