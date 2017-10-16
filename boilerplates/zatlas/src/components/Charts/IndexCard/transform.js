/**
* @Author: eason
* @Date:   2017-06-20T17:56:28+08:00
* @Email:  uniquecolesmith@gmail.com
 * @Last modified by:   mark
 * @Last modified time: 2017-07-24T10:58:10+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

module.exports = (data) => {
  if (data.mock) {
    return data;
  }

  if (data.length > 0) {
    return {
      count: Object.values(data[0])[0],
    };
  } else {
    return data;
  }
};
