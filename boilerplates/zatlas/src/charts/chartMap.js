/**
* @Author: eason
* @Date:   2017-05-02T17:53:44+08:00
* @Email:  uniquecolesmith@gmail.com
 * @Last modified by:   mark
 * @Last modified time: 2017-08-29T11:21:09+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

/*
 * chartMap.js
 * Copyright (C) 2017 disoul <disoul@DiSouldeMacBook-Pro.local>
 *
 * Distributed under terms of the MIT license.
 */

import ClusterHistogram from '../components/Charts/ClusterHistogram';
import StackHistogram from '../components/Charts/StackHistogram';
import ClusterBar from '../components/Charts/ClusterBar';
import StackBar from '../components/Charts/StackBar';
import Line from '../components/Charts/Line';
import Pie from '../components/Charts/Pie';
import Area from '../components/Charts/Area';
import StackArea from '../components/Charts/StackArea';
import Funnel from '../components/Charts/Funnel';
import Scatter from '../components/Charts/Scatter';
import Sankey from '../components/Charts/Sankey';
import Heatmap from '../components/Charts/Heatmap';
import Calendar from '../components/Charts/Calendar';
import IndexCard from '../components/Charts/IndexCard';
import Table from '../components/Charts/Table';

const map = {
  IndexCard: {
    component: IndexCard,
    name: '指标卡',
    icon: 'kpi',
    option: IndexCard.defaultProps.option,
    binding: IndexCard.defaultProps.bindings,
    limit: 50,
  },
  // Table: {
  //   component: Table,
  //   name: '表格',
  //   icon: 'table',
  //   option: Table.defaultProps.option,
  //   binding: Table.defaultProps.bindings,
  // },
  Line: {
    component: Line,
    name: '折线图',
    icon: 'line',
    option: Line.defaultProps.option,
    binding: Line.defaultProps.bindings,
    validation: Line.defaultProps.validation,
    limit: 1000,
    transformChartType: ['折线图', '簇型柱状图', '堆积柱状图', '面积图', '堆积面积图'],
  },
  ClusterHistogram: {
    component: ClusterHistogram,
    name: '簇型柱状图',
    icon: 'bar',
    option: ClusterHistogram.defaultProps.option,
    binding: ClusterHistogram.defaultProps.bindings,
    limit: 1000,
    transformChartType: ['簇型柱状图', '折线图', '堆积柱状图', '面积图', '堆积面积图'],
  },
  StackHistogram: {
    component: StackHistogram,
    name: '堆积柱状图',
    icon: 'bar-stack',
    option: StackHistogram.defaultProps.option,
    binding: StackHistogram.defaultProps.bindings,
    limit: 1000,
    transformChartType: ['堆积柱状图', '折线图', '簇型柱状图', '面积图', '堆积面积图'],
  },
  ClusterBar: {
    component: ClusterBar,
    name: '簇型条形图',
    icon: 'bar2',
    option: ClusterBar.defaultProps.option,
    binding: ClusterBar.defaultProps.bindings,
    limit: 1000,
  },
  StackBar: {
    component: StackBar,
    name: '堆积条形图',
    icon: 'bar2-stack',
    option: StackBar.defaultProps.option,
    binding: StackBar.defaultProps.bindings,
    limit: 1000,
  },
  Pie: {
    component: Pie,
    name: '饼状图',
    icon: 'pie',
    option: Pie.defaultProps.option,
    binding: Pie.defaultProps.bindings,
    limit: 50,
    transformChartType: ['饼状图', '漏斗图'],
  },
  Area: {
    component: Area,
    name: '面积图',
    icon: 'area',
    option: Area.defaultProps.option,
    binding: Area.defaultProps.bindings,
    limit: 1000,
    transformChartType: ['面积图', '折线图', '簇型柱状图', '堆积柱状图', '堆积面积图'],
  },
  StackArea: {
    component: StackArea,
    name: '堆积面积图',
    icon: 'area-stack',
    option: StackArea.defaultProps.option,
    binding: StackArea.defaultProps.bindings,
    limit: 1000,
    transformChartType: ['堆积面积图', '折线图', '簇型柱状图', '堆积柱状图', '面积图'],
  },
  Funnel: {
    component: Funnel,
    name: '漏斗图',
    icon: 'funnel',
    option: Funnel.defaultProps.option,
    binding: Funnel.defaultProps.bindings,
    limit: 50,
    transformChartType: ['漏斗图', '饼状图'],
  },
  Scatter: {
    component: Scatter,
    name: '散点图',
    icon: 'scatter',
    option: Scatter.defaultProps.option,
    binding: Scatter.defaultProps.bindings,
    limit: 1000,
    transformChartType: [],
  },
  Sankey: {
    component: Sankey,
    name: '桑基图',
    icon: 'sankey',
    option: Sankey.defaultProps.option,
    binding: Sankey.defaultProps.bindings,
    limit: 50,
    transformChartType: [],
  },
  Heatmap: {
    component: Heatmap,
    name: '热力图',
    icon: 'heatmap',
    option: Heatmap.defaultProps.option,
    binding: Heatmap.defaultProps.bindings,
    limit: 1000,
    transformChartType: [],
  },
  Calendar: {
    component: Calendar,
    name: '日历图',
    icon: 'calendar',
    option: Calendar.defaultProps.option,
    binding: Calendar.defaultProps.bindings,
    limit: 1000,
    transformChartType: [],
  },
};

export default map;
