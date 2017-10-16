/**
* @Author: eason
* @Date:   2017-04-05T15:16:55+08:00
* @Email:  uniquecolesmith@gmail.com
 * @Last modified by:   mark
 * @Last modified time: 2017-08-24T11:08:15+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

export default function (option, data = {}) {
  if (data.mock) {
    option = data.option ? data.option : option; // eslint-disable-line
    data = data.data; // eslint-disable-line
  }
  const { range, series } = data;

  if (!Array.isArray(option.calendar)) {
    option.calendar = Object.values(option.calendar);
  }
  return {
    ...option,
    calendar: option.calendar.map(e => ({
      ...e,
      range,
    })),
    series: [{
      type: 'heatmap',
      coordinateSystem: 'calendar',
      calendarIndex: 0,
      data: series,
    }],
  };
}
