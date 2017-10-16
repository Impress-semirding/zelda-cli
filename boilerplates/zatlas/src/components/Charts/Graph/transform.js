/**
 * @Author: mark
 * @Date:   2017-05-19T09:53:42+08:00
 * @Email:  mark_z1988@icloud.com
 * @Filename: transform.js
 * @Last modified by:   mark
 * @Last modified time: 2017-07-27T13:29:48+08:00
 * @License: MIT
 */


 export default function transform(data, map, feed) {
   if (data.mock) {
     return data.data;
   }

   return {
     data,
     feed,
   };
 }
