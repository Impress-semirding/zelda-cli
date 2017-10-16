/**
* @Author: eason
* @Date:   2017-05-02T17:53:44+08:00
* @Email:  uniquecolesmith@gmail.com
 * @Last modified by:   mark
 * @Last modified time: 2017-08-29T11:01:12+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

/*
 * chartMap.js
 * Copyright (C) 2017 disoul <disoul@DiSouldeMacBook-Pro.local>
 *
 * Distributed under terms of the MIT license.
 */
import GraphChart from '../components/Charts/Graph';

const map = {
  GraphChart: {
    component: GraphChart,
    name: '图',
    icon: 'graph',
    option: GraphChart.defaultProps.option,
    binding: GraphChart.defaultProps.bindings,
    validation: GraphChart.defaultProps.validation,
    limit: 1000,
    transformChartType: [],
  },
};

export default map;
