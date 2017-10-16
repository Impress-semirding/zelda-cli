/**
* @Author: eason
* @Date:   2017-04-05T15:16:55+08:00
* @Email:  uniquecolesmith@gmail.com
 * @Last modified by:   mark
 * @Last modified time: 2017-08-11T14:09:36+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

export default function (option, data = {}) {
  if (data.mock) {
    option = data.option ? data.option : option; // eslint-disable-line
    data = data.data; // eslint-disable-line
  }
  let count = data.count || 0;
  count = parseFloat(parseFloat(count).toFixed(3)); // later precision can be an option
  return {
    title: option.title || '指标',
    count: count,
    style: {
      ...option,
      textAlign: 'center',
    },
  };
}
