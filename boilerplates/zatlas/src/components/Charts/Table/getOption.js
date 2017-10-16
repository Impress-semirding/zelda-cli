/**
* @Author: eason
* @Date:   2017-04-05T15:16:55+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2017-06-20T18:24:43+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

export default function (option, data = {}) {
  return {
    title: option.title || '指标',
    count: data.count || '12,768',
    style: {
      ...option,
      textAlign: 'center',
    },
  };
}
