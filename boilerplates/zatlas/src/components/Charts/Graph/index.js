/**
 * @Author: mark
 * @Date:   2017-04-21T15:05:06+08:00
 * @Email:  mark_z1988@icloud.com
 * @Filename: index.js
 * @Last modified by:   mark
 * @Last modified time: 2017-08-02T15:29:48+08:00
 * @License: MIT
 */

import option from './option';
import { connect } from 've-react-databinding';
import defaultData from './data';
import BaseGraphChart from './graphChart';
import binding from './binding';
import transform from './transform';
import getOption from './getOption';
import validation from './validation';

import datas from './datas';

@connect(binding, transform)
export default class GraphChart extends BaseGraphChart {
  static defaultProps = {
    datas,
    option,
    getOption,
    validation,
    settings: {
      drawLabels: true,
      labelHoverColor: 'default',
      defaultLabelHoverColor: 'transparent',
      labelHoverShadowColor: 'transparent',
      defaultHoverLabelBGColor: 'transparent',
      defaultNodeHoverColor: 'transparent',
      nodeHoverColor: 'default',
      borderSize: '5',
      nodeActiveBorderSize: 2,
      nodeActiveOuterBorderSize: 3,
      defaultNodeActiveBorderColor: '#fff',
      defaultNodeActiveOuterBorderColor: 'rgb(236, 81, 72)',
      doubleClickEnabled: false,
      maxEdgeSize: 5,
      minEdgeSize: 0.5,
      labelAlignment: 'center',
      defaultLabelColor: '#000',
      labelThreshold: 8,
    },
    tooltip: {
      enable: true,
      format: (node, props) => {
        return (<div style={{ width: '100px', height: '20px', color: props.option.hoverLabelColor}}>{node.label}</div>);
      },
    },
    hoverMask: {
      enable: false,
    },
  };
}
