/**
* @Author: eason
* @Date:   2017-06-20T17:56:28+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2017-07-11T16:24:33+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

module.exports = (data) => {
  if (data.mock) {
    return data.data;
  }

  return {
    header: Object.keys(data[0] || {}).map(e => ({ label: e, labelName: e })),
    body: data.map((e, i) => ({ ...e, id: i })),
  };
};
