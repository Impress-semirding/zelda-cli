/**
* @Author: eason
* @Date:   2017-05-11T11:45:33+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2017-06-07T11:59:47+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

module.exports = [{
  name: '分类',
  key: 'X1',
  type: 'CATEGORY',
  valueType: ['string', 'object'], // @TODO typeof null === 'object'
  bindingType: 'axis',
  accept: [1, 1],
}, {
  name: '值',
  key: 'Y1',
  type: 'MEASURE',
  bindingType: 'axis',
  accept: [1, 1],
}];
