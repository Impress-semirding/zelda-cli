/**
* @Author: eason
* @Date:   2017-04-05T00:52:33+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2017-04-14T00:41:14+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

export default {
  title: '访问来源',
  labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  series: [
    {
      name: '最高气温',
      type: 'pie',
      data: [
        { value: 335, name: '直接访问' },
        { value: 310, name: '邮件营销' },
        { value: 234, name: '联盟广告' },
        { value: 135, name: '视频广告' },
        { value: 1548, name: '搜索引擎' },
      ],
    },
  ],
};
