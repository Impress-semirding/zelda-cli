/**
* @Author: eason
* @Date:   2017-05-11T11:45:33+08:00
* @Email:  uniquecolesmith@gmail.com
 * @Last modified by:   mark
 * @Last modified time: 2017-09-07T13:22:37+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

module.exports = [{
  name: '分类',
  key: 'X1',
  type: 'CATEGORY',
  bindingType: 'axis',
  accept: [1, 1],
  valueType: ['string', 'object'],
}, {
  name: '值/分类',
  key: 'Y1',
  type: ['MEASURE', 'CATEGORY'],
  bindingType: 'axis',
  accept: [2, 2],
  valueType: ['number', 'string', 'object'],
}];
