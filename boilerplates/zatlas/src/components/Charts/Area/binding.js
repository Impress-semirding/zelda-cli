/**
* @Author: eason
* @Date:   2017-05-03T13:24:38+08:00
* @Email:  uniquecolesmith@gmail.com
 * @Last modified by:   mark
 * @Last modified time: 2017-08-29T15:10:56+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

export default [{
  'name': '分类/时间',
  'key': 'X1',
  'type': ['CATEGORY', 'TIME'],
  'bindingType': 'axis',
  'accept': [1, 1],
  valueType: ['string', 'object'],
}, {
  'name': '值',
  'key': 'Y1',
  'type': 'MEASURE',
  'bindingType': 'axis',
  'accept': [1, Infinity],
  valueType: ['number', 'string', 'object'],
}, {
  'name': '图例',
  'key': 'COLOR',
  'type': 'CATEGORY',
  'bindingType': 'legend',
  'accept': [0, 1]
}];
