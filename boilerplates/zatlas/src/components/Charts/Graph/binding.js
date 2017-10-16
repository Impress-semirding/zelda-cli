/**
 * @Author: mark
 * @Date:   2017-05-19T09:47:36+08:00
 * @Email:  mark_z1988@icloud.com
 * @Filename: binding.js
 * @Last modified by:   mark
 * @Last modified time: 2017-06-23T17:17:31+08:00
 * @License: MIT
 */

 export default [{
   name: '连接',
   key: 'X1',
   keyName: '连接节点',
   type: 'CATEGORY',
   bindingType: 'link',
   accept: [2, 2],
   valueType: ['string', 'object'],
 }, {
   name: '节点1社区',
   key: 'Y1',
   keyName: '节点1社区',
   type: 'CATEGORY',
   bindingType: 'node1',
   accept: [0, 1],
 }, {
   name: '节点2社区',
   key: 'Y2',
   keyName: '节点2社区',
   type: 'CATEGORY',
   bindingType: 'node1',
   accept: [0, 1],
 }];
