/**
 * @Author: mark
 * @Date:   2017-05-19T09:58:06+08:00
 * @Email:  mark_z1988@icloud.com
 * @Filename: getOption.js
 * @Last modified by:   mark
 * @Last modified time: 2017-07-27T13:29:27+08:00
 * @License: MIT
 */

 import _ from 'lodash';

 function dataCreator(data, feed) {
   const nodes = [];
   const edges = [];
   const compareObject = {};
   _.forEach(data, (d, idx) => {
     const node1 = d[feed.X1[0].name];
     const node2 = d[feed.X1[1].name];
     const node1Community = feed.Y1.length > 0 ? d[feed.Y1[0].name] : '';
     const node2Community = feed.Y2.length > 0 ? d[feed.Y2[0].name] : '';
     if (node1 && node2) {
       edges.push({
         id: `e${idx}`,
         source: node1,
         target: node2,
       });
     }
     if (node1 && !compareObject[node1]) {
       nodes.push({
         id: node1,
         label: node1,
         x: Math.random(),
         y: Math.random(),
         community: node1Community,
       });
       compareObject[node1] = node1;
     }

     if (node2 && !compareObject[node2]) {
       nodes.push({
         id: node2,
         label: node2,
         x: Math.random(),
         y: Math.random(),
         community: node2Community,
       });
       compareObject[node2] = node2;
     }
   });
   return {
     nodes,
     edges,
   };
 }

 export default function (option, dataSource = {}) {
   const { data = [], feed } = dataSource;
   return {
     ...option,
     data: dataCreator(data, feed),
   };
 }
