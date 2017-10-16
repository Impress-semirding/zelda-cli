/**
 * @Author: mark
 * @Date:   2017-04-21T18:04:02+08:00
 * @Email:  mark_z1988@icloud.com
 * @Filename: data.js
 * @Last modified by:   mark
 * @Last modified time: 2017-06-30T09:53:32+08:00
 * @License: MIT
 */
 // const icons = [
 //   '\uF11b',
 //   '\uF11c',
 //   '\uF11d',
 //   '\uF128',
 //   '\uF129',
 //   '\uF130',
 //   '\uF131',
 //   '\uF132',
 // ];

 export default {
   nodes: [{
     id: 'n0',
     label: 'Node n0',
     x: 0.5,
     y: 0.5,
     size: 5,
     color: '#666',
     community: 'com1',
    //  icon: {
    //    font: 'FontAwesome',
    //    scale: 1.0, // size ratio of (icon / node)
    //    color: '#fff',
    //    content: icons[Math.floor(Math.random() * icons.length)],
    //  },
   }, {
     id: 'n1',
     label: 'Node n1',
     x: 0.9,
     y: 0.3,
     size: 5,
     color: '#666',
     community: 'com1',
   }, {
     id: 'n2',
     label: 'Node n2',
     x: 0.4,
     y: 0.2,
     size: 5,
     color: '#666',
     community: 'com1',
   }, {
     id: 'n3',
     label: 'Node n3',
     x: 0.06,
     y: 0.4,
     size: 5,
     color: '#666',
     community: 'com1',
   }, {
     id: 'n4',
     label: 'Node n4',
     x: 0.4,
     y: 0.07,
     size: 5,
     color: '#666',
     community: 'com1',
   },{
     id: 'c0',
     label: 'Node c0',
     x: 0.1,
     y: 0.1,
     size: 5,
     color: '#666',
     community: 'com2',
    //  icon: {
    //    font: 'FontAwesome',
    //    scale: 1.0, // size ratio of (icon / node)
    //    color: '#fff',
    //    content: icons[Math.floor(Math.random() * icons.length)],
    //  },
   }, {
     id: 'c1',
     label: 'Node c1',
     x: 0.02,
     y: 0.02,
     size: 5,
     color: '#666',
     community: 'com2',
   }, {
     id: 'c2',
     label: 'Node c2',
     x: 0.05,
     y: 0.01,
     size: 5,
     color: '#666',
     community: 'com2',
   }, {
     id: 'c3',
     label: 'Node c3',
     x: 0.06,
     y: 0.07,
     size: 5,
     color: '#666',
     community: 'com2',
   }, {
     id: 'c4',
     label: 'Node c4',
     x: 0.05,
     y: 0.05,
     size: 5,
     color: '#666',
     community: 'com2',
   }],
   edges: [{
     id: 'e0',
     source: 'n0',
     target: 'n1',
     size: 10,
     color: '#ccc',
   }, {
     id: 'e1',
     source: 'n1',
     target: 'n2',
     size: 20,
     color: '#ccc',
   }, {
     id: 'e2',
     source: 'n2',
     target: 'n3',
     size: 5,
     color: '#ccc',
   }, {
     id: 'e3',
     source: 'n1',
     target: 'n4',
     size: 1,
     color: '#ccc',
   }, {
     id: 'cc0',
     source: 'c0',
     target: 'c1',
     size: 10,
     color: '#ccc',
   }, {
     id: 'cc1',
     source: 'c1',
     target: 'c2',
     size: 20,
     color: '#ccc',
   }, {
     id: 'cc2',
     source: 'c2',
     target: 'c3',
     size: 5,
     color: '#ccc',
   }, {
     id: 'cc3',
     source: 'c1',
     target: 'c4',
     size: 1,
     color: '#ccc',
   }],
 };
