/*
* @Author: zhouningyi
* @Date:   2017-06-20 21:10:49
* @Last Modified by:   zhouningyi
* @Last Modified time: 2017-06-23 18:13:12
*/

'use strict';
export default [{
  name: '经度(lng)',
  key:  'lng',
  type: 'MEASURE',
  bindingType: 'raw',
  accept: [0, 1],
}, {
  name: '纬度(lat)',
  key: 'lat',
  type: 'MEASURE',
  bindingType: 'raw',
  accept: [0, 1]
}, 
/*
{
  name: '浮窗',
  key: 'popup',
  type: 'MEASURE',
  bindingType: 'popup',
  accept: [0, Infinity]
}, 
*/

// {
//   name: '点大小',
//   key: 'size',
//   type: 'MEASURE',
//   bindingType: 'raw',
//   accept: [0, 1]
// }, 

{
  name: '唯一识别(id)',
  key: 'id',
  type: 'CATEGORY',
  bindingType: 'raw',
  accept: [0, 1]
}];

