/**
 * @Author: mark
 * @Date:   2017-08-24T10:14:08+08:00
 * @Email:  mark_z1988@icloud.com
 * @Filename: index.js
 * @Last modified by:   mark
 * @Last modified time: 2017-09-01T17:07:02+08:00
 * @License: MIT
 */

 import React, { Component } from 'react';
 import Echarts from 'echarts-for-react';
 import _ from 'lodash';
 import PaginationLegend from '../PaginationLegend';

 export default class BaseChart extends Component {
   constructor(options) {
     super(options);
     this.onChartClick = this.onChartClick.bind(this);
     this.onChartLegendselectchanged = this.onChartLegendselectchanged.bind(this);
   }

   componentWillReceiveProps(newProps) {
     let { data: oldData } = this.props;
     let { data: newData } = newProps;
     newData = newData && newData.mock ? newData.data : newData;
     oldData = oldData && oldData.mock ? oldData.data : oldData;
     if ((oldData && newData && oldData.legend !== newData.legend) || (!oldData && newData && newData.legend)) {
       const obj = {};
       _.forEach(newData.legend, (d) => {
         obj[d] = true;
       });
       this.setState({ selected: obj });
     }
   }

   shouldComponentUpdate(nextProps, nextState){
     const { onDataClick, onFinalData, ...rest1 } = nextProps;
     const { onDataClick: o1, onFinalData: o2, ...rest2 } = this.props;
     return !_.isEqual(rest1, rest2) || !_.isEqual(nextState, this.state);
   }

   onChartClick(e) { // eslint-disable-line
     if (this.props.onDataClick) {
       this.props.onDataClick(e.name);
     }
   }

   onChartLegendselectchanged(e) {
     const { selected } = e;
     this.setState({ selected });
   }

   legendItemClick(item) {
     const echartsInstance = this.echartRef.getEchartsInstance();
     echartsInstance.dispatchAction({ type: 'legendToggleSelect', name: item });
   }

   render() {
     const { option, data, getOption, path, ...otherProps } = this.props; // eslint-disable-line
     const finalOption = getOption(option, data);

     const title = finalOption.title && finalOption.title.text;
     const showTitle = finalOption.title && finalOption.title.show;
     const titleColor = (finalOption.title && finalOption.title.color) || '#000';
     const titleLeft = (finalOption.title && finalOption.title.left) || '0px';
     const titleTextAlign = (finalOption.title && finalOption.title.textAlign) || 'left';

     const s = this.state && this.state.selected || {};
     const showLegend = finalOption.legend && finalOption.legend.show;
     const mergedLegend = finalOption.legend && Object.assign(finalOption.legend, { show: false, selected: s });

     const legendTop = showLegend ? (isNaN(mergedLegend.top) ? mergedLegend.top : mergedLegend.top+'px') : '0px';
     const chartHeight = path ? `calc(100% - 70px - ${legendTop})` : `calc(100% - 50px - ${legendTop})`;
     return (
       <div style={{ width: '100%', height: '100%' }}>
         <header
           style={{ padding: '5px',
             height: '30px',
             fontSize: '18px',
             fontWeight: '600',
             color: titleColor,
             paddingLeft: titleLeft,
             textAlign: titleTextAlign }}
         >{showTitle ? title : ''}</header>
         {
          showLegend ?
           <PaginationLegend option={finalOption} boxItemClick={(item) => { this.legendItemClick(item); }} selected={s} /> : ''
         }

         <Echarts
           ref={ref => (this.echartRef = ref)}
           style={{ position: 'relative', width: '100%', height: chartHeight }}
           option={Object.assign({}, finalOption, { title: { show: false } }, mergedLegend)}
           notMerge
           lazyUpdate
           onEvents={{
             click: this.onChartClick,
             legendselectchanged: this.onChartLegendselectchanged,
           }}
         />
         {
           path ? <div style={{ height: '20px', paddingLeft: '20px', color: titleColor }}>
             <span
               style={{ paddingRight: '10px', cursor: 'pointer' }} onClick={() => {
                 this.props.onDataClick && this.props.onDataClick(path.split('/')[1]);
               }}
             >{path.split('/')[0]}</span>
             /
             <span style={{ paddingLeft: '10px' }}>{path.split('/')[1]}</span>
           </div> : ''
         }
       </div>
     );
   }
 }
