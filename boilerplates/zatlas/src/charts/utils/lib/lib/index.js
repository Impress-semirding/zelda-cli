/**
* @Author: eason
* @Date:   2017-05-02T13:33:35+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2017-06-05T14:17:50+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

import FeedManager from './FeedManager';
import QueryEngine from './QueryEngine';
import DataTransformer from './DataTransformer';

export {
  FeedManager,
  QueryEngine,
  DataTransformer,
};


// connect({
//   bindings: [{
//     key: 'X',
//     type: 'CATEGORY',
//     name: '分类',
//     accept: [0, 1],
//   }, {
//     key: 'Y',
//     type: 'MEASURE',
//     name: '数值',
//     accept: [0, Infinity],
//   }],
//   validateFeedings,
//   query: function (categories, measures) {
//     return data;
//   },
//   validateQuery: function (data) {
//     return true;
//   },
//   transform: function (data) {
//     return data;
//   },
// });
