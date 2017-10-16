/**
 * @Author: mark
 * @Date:   2016-12-15T13:42:35+08:00
 * @Email:  mark_z1988@icloud.com
 * @Filename: graphChart.js
 * @Last modified by:   mark
 * @Last modified time: 2017-08-31T13:47:45+08:00
 * @License: MIT
 */

import React, { PureComponent } from 'react';
import _ from 'lodash';
import window from 'global/window';
import elementResizeEvent from 'element-resize-event';

import dagre from 'dagre';
import beweennes from './algorithms/betweennesCentrality';
import closeness from './algorithms/closenessCentrality';
import pagerank from './algorithms/pagerank';
import grahamScan from './algorithms/grahamScan';
import Offset from './algorithms/offsetPolygon';
import { interpolate, hexToRgb, hitTest } from './graphUtil';

/* eslint-disable */
require('script!../../../../node_modules/linkurious/dist/sigma.min.js');
require('script!../../../../node_modules/linkurious/dist/plugins.min.js');


/* eslint-enable */

const Sigma = window.sigma;
const document = window.document;
window.dagre = dagre;
const offset = new Offset();

export default class GraphChart extends PureComponent {
  static propTypes = {
    width: React.PropTypes.string,
    height: React.PropTypes.string,
    defaultData: React.PropTypes.object,
    option: React.PropTypes.object,
    validation: React.PropTypes.any,
    zoomRatio: React.PropTypes.number,
    settings: React.PropTypes.object,
    onHoverNode: React.PropTypes.func,
    onFilter: React.PropTypes.func,
    tooltip: React.PropTypes.object,
    onClickNode: React.PropTypes.func,
  };

  static defaultProps={
    width: '100%',
    height: '100%',
    option: {},
    defaultData: [],
    validation: [],
    zoomRatio: null,
    settings: {
      drawLabels: false,
      enableHovering: false,
      nodeActiveBorderSize: 2,
      nodeActiveOuterBorderSize: 3,
      defaultNodeActiveBorderColor: '#fff',
      defaultNodeActiveOuterBorderColor: 'rgb(236, 81, 72)',
      doubleClickEnabled: false,
      maxEdgeSize: 5,
      minEdgeSize: 0.5,
    },
    onHoverNode: () => {},
    onFilter: null,
    onClickNode: null,
  };

  constructor(props: any) {
    super(props);
    this.mousemove = this.mousemove.bind(this);
    this.mousedown = this.mousedown.bind(this);
    this.mouseup = this.mouseup.bind(this);
    this.hoverEvent = this.hoverEvent.bind(this);
    this.instanceId = `graph_${new Date().getTime()}`;
    this.initGraph = this.initGraph.bind(this);
    this.onZoom = this.onZoom.bind(this);
    this.clickEvent = this.clickEvent.bind(this);
    this.clickNodeEvent = this.clickNodeEvent.bind(this);
    this.doubleClickEvent = this.doubleClickEvent.bind(this);
    this.state = {
      tooltip: '',
    };
  }

  componentDidMount() {
    // if (document.fonts) {
    //   let fontsReady = document.fonts.ready;
    //   if (typeof (fontsReady) === 'function') {
    //     fontsReady = document.fonts.ready();
    //   }
    //   fontsReady.then(this.initGraph);
    // } else {
    //   setTimeout(this.initGraph, 2000);
    // }
    this.initGraph();
    if (this.props.data) {
      this.updateData(this.props.data);
    }
    this.updateOptions();
    this.onZoom();
  }

  componentWillReceiveProps(newProps) {
    if (!_.isEqual(this.props.data, newProps.data)) {
      this.updateData(newProps.data);
      this.updateOptions();
    }
    if (this.props.zoomRatio !== newProps.zoomRatio) {
      this.onZoom();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !this.objectIsEqual(nextProps.data, this.props.data) ||
           !this.objectIsEqual(nextProps.option, this.props.option) ||
           nextState.tooltip !== this.state.tooltip;
  }


  componentDidUpdate(prevProps, prevState) {
    if (prevState.tooltip === this.state.tooltip) {
      this.updateOptions();
    } else {
      this.adjustTooltipPosition();
    }
  }

  onZoom() {
    if (this.props.zoomRatio && this.props.zoomRatio !== 0) {
      Sigma.plugins.locate(this.sigma).center(1);
      setTimeout(() => {
        Sigma.utils.zoomTo(
            this.sigma.camera,
            0,
            0,
            1 / this.props.zoomRatio,
            { duration: 200 },
          );
      }, 100);
    }
  }

  getNodesInArea(x1, y1, x2, y2) {
    const nodesInArea = [];
    const startX = x1 > x2 ? x2 : x1;
    const endX = x1 > x2 ? x1 : x2;
    const startY = y1 > y2 ? y2 : y1;
    const endY = y1 > y2 ? y1 : y2;

    this.sigma.graph.nodes().forEach((node) => {
      const nodeX = node['cam0:x'];
      const nodeY = node['cam0:y'];
      if ((nodeX > startX) && (nodeX < endX) && (nodeY > startY) && (nodeY < endY)) {
        nodesInArea.push(node);
      }
    });

    return nodesInArea;
  }

  objectIsEqual(obj1, obj2) { // eslint-disable-line
    const allkeys = _.union(_.keys(obj1), _.keys(obj2));
    const difference = _.reduce(allkeys, (result, key) => {
      if (obj1 && obj2 && !_.isEqual(obj1[key], obj2[key])) {
        result[key] = { obj1: obj1[key], obj2: obj2[key] }; // eslint-disable-line
      }
      return result;
    }, {});
    return _.isEmpty(difference);
  }

  updateData(data) {
    const { option, getOption } = this.props; // eslint-disable-line
    if (!this.sigma) return;
    if (this.sigma.isForceAtlas2Running()) {
      this.sigma.killForceAtlas2();
    }
    this.sigma.graph.clear();
    if (data && data.feed && data.data) {
      const finalOption = getOption(option, data);
      if (finalOption.data.nodes && finalOption.data.nodes.length > 0) {
        this.sigma.graph.read(finalOption.data);
      }
    } else if (data) {
      this.sigma.graph.read(data);
    }
    this.sigma.refresh();
    this.showCommunityPolygon();
    this.sigma.graph.forEachNode((node) => {
      const n = node;
      n.rawColor = node.color;
      n.rawSize = node.size;
    });
    _.forEach(this.sigma.graph.edges(), (edge) => {
      const e = edge;
      e.rawColor = e.color;
    });
  }

  updateOptions() {
    this.updateEventCanvas();
    this.adjustDirect();
    this.adjustSelectionMode();
    this.adjustEdgeColors();
    this.adjustEdgeSize();
    this.adjustNodesColors();
    this.adjustNodeSize();
    if (this.selectedNodes && this.selectedNodes.length > 0) {
      this.adjustSelectNodes();
    }
    this.adjustLabelColor();
    this.adjustLayout();
    this.sigma.refresh({ skipIndexation: true });
    this.updateFilterDate();
    this.showCommunityPolygon();
  }

  showCommunityPolygon() {
    if (this.props.option.showCommunityPolygon) {
      const tmpMap = {};
      this.sigma.graph.forEachNode((node) => {
        const n = node;
        const community = n.community;
        if (community !== '') {
          if (!tmpMap[community]) {
            tmpMap[community] = [node];
          } else {
            tmpMap[community].push(node);
          }
        }
      });

      let count = 0;
      const colorpool = this.props.option.allNodeColor.communityColor.colorPool;
      this.clearCanvas();
      const tmpPolygon = {};
      _.forIn(tmpMap, (value, key) => {
        const points = _.map(value, o => [o['cam0:x'], o['cam0:y']]);
        const hullp = grahamScan(points);
        if (hullp.length > 2) {
          const padding = offset.data(hullp).margin(10);
          tmpPolygon[key] = padding[0];
          const color = colorpool[count] ? colorpool[count] : '#cccccc';
          const rgb = hexToRgb(color);
          this.drawingCommunityPolygon(padding[0], `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`);
          count++;
        }
      });
      this.polygon = _.isEmpty(tmpPolygon) ? null : tmpPolygon;
    } else {
      this.polygon = null;
    }
  }

  updateFilterDate() {
    if (this.props.onFilter) {
      const filterdNodes = this.props.onFilter(this.sigma.graph.nodes());
      setTimeout(() => {
        this.drawingFilterStateNode(filterdNodes);
      }, 500);
    }
  }
  mousedown(e) {
    const renderer = this.sigma.renderers[0];
    const container = renderer.container;
    const gCanvas = container.children[3];
    this.startPosition = { x: e.offsetX, y: e.offsetY };
    gCanvas.addEventListener('mousemove', this.mousemove);
  }
  mousemove(e) {
    const ctx = this.eventCanvas.getContext('2d');
    this.drawingHoverStateNode(null, this.getNodesInArea(this.startPosition.x, this.startPosition.y,
                                  e.offsetX, e.offsetY), []);
    ctx.beginPath();
    ctx.lineWidth = '1';
    ctx.setLineDash([6]);
    ctx.strokeStyle = 'black';
    ctx.rect(this.startPosition.x, this.startPosition.y, e.offsetX - this.startPosition.x,
                                            e.offsetY - this.startPosition.y);
    ctx.stroke();
    ctx.closePath();
  }
  mouseup(e) {
    const renderer = this.sigma.renderers[0];
    const container = renderer.container;
    const gCanvas = container.children[3];
    gCanvas.removeEventListener('mousemove', this.mousemove);
    this.clearCanvas();
    const selectedNodes = this.getNodesInArea(this.startPosition.x, this.startPosition.y,
                                  e.offsetX, e.offsetY);
    if (selectedNodes.length > 0) {
      this.drawingHoverStateNode(null, selectedNodes, []);
    }
    this.selectedNodes = selectedNodes;
    this.startPosition = {};
  }

  adjustLabelColor() {
    this.sigma.settings('defaultLabelColor', this.props.option.labelColor);
  }

  adjustDirect() {
    _.forEach(this.sigma.graph.edges(), (edge) => {
      const e = edge;
      e.type = this.props.option.directGraph ? 'arrow' : 'curve';
    });
  }

  adjustSelectionMode() {
    const renderer = this.sigma.renderers[0];
    const container = renderer.container;
    const gCanvas = container.children[3];
    if (this.props.option.multiSelectionMode) {
      this.sigma.settings('mouseEnabled', false);
      gCanvas.addEventListener('mousedown', this.mousedown);
      gCanvas.addEventListener('mouseup', this.mouseup);
    } else {
      this.sigma.settings('mouseEnabled', true);
      this.selectedNodes = [];
      gCanvas.removeEventListener('mousedown', this.mousedown);
      gCanvas.removeEventListener('mouseup', this.mouseup);
    }
  }

  adjustSelectNodes() {
    if (this.props.option.selectedNodes) {
      const { selectedNodesColor } = this.props.option.selectedNodes;
      const redrawingNodes = [];
      _.forIn(this.selectedNodes, (n) => {
        const node = this.sigma.graph.nodes(n.id);
        node.color = selectedNodesColor;
        redrawingNodes.push(node);
      });
      this.drawingHoverStateNode(null, redrawingNodes, []);
    }
  }

  adjustLayout() {
    const layout = _.keys(this.props.option.layout)[0];

    if (layout === 'forceAtlas2') {
      if (this.props.option.layout.forceAtlas2.startAlgorithms) {
        this.sigma.startForceAtlas2(this.props.option.layout.forceAtlas2);
      } else if (this.sigma.isForceAtlas2Running()) {
        this.sigma.killForceAtlas2();
        if (this.props.onFinalData) {
          this.props.onFinalData({
            nodes: this.sigma.graph.nodes(),
            edges: this.sigma.graph.edges(),
          });
        }
      }
    } else if (layout === 'forceLink') {
      if (!Sigma.layouts.isForceLinkRunning()) {
        try {
          const fllistener = Sigma.layouts.startForceLink(this.sigma, {
            autoStop: true,
            maxIterations: 1000,
          });
          let flhandler = (event) => {
            if (event.type === 'stop') {
              this.props.onFinalData && this.props.onFinalData({
                nodes: this.sigma.graph.nodes(),
                edges: this.sigma.graph.edges(),
              });
              fllistener.unbind('start stop interpolate', flhandler);
            }
          };
          flhandler = flhandler.bind(this);
          fllistener.bind('start stop interpolate', flhandler);
        } catch (e) {
          console.log(e);
        }
      }
    } else if (layout === 'fruchtermanReingold') {
      this.sigma.killForceAtlas2();

      const listener = Sigma.layouts.fruchtermanReingold.configure(this.sigma,
        Object.assign({}, this.props.option.layout.fruchtermanReingold, {
          easing: 'quadraticIn',
          duration: 1000,
        }),
      );


      // Bind all events:
      let handler = (event) => {
        if (event.type === 'stop' && this.props.onFinalData) {
          this.props.onFinalData({
            nodes: this.sigma.graph.nodes(),
            edges: this.sigma.graph.edges(),
          });
          listener.unbind('start stop interpolate', handler);
        }
      };

      handler = handler.bind(this);

      if (!Sigma.layouts.fruchtermanReingold.isRunning(this.sigma)) {
        try {
          listener.bind('start stop interpolate', handler);
          Sigma.layouts.fruchtermanReingold.start(this.sigma);
        } catch (e) {
          console.log(e);
        }
      }
    } else if (layout === 'dagre') {
      this.sigma.killForceAtlas2();
      Sigma.layouts.dagre.configure(this.sigma, {
        rankdir: 'TB',
      });
      Sigma.layouts.dagre.start(this.sigma);
    } else if (layout === 'random') {
      this.sigma.killForceAtlas2();
      _.forIn(this.sigma.graph.nodes(), (node) => {
        const n = node;
        n.x = Math.random();
        n.y = Math.random();
      });
    }
  }

  adjustEdgeColors() {
    _.forIn(this.sigma.graph.edges(), (edge) => {
      const e = edge;
      e.color = this.props.option.allEdgesColor.customColor ?
                this.props.option.allEdgesColor.edgesColor :
                e.rawColor;
    });
  }

  adjustNodesColors() {
    if (this.props.option.allNodeColor.customColor) {
      if (this.props.option.allNodeColor.communityColor.active) {
        const tmpMap = {};
        let count = 0;
        const colorpool = this.props.option.allNodeColor.communityColor.colorPool;
        this.sigma.graph.forEachNode((node) => {
          const n = node;
          const community = n.community;
          if (community !== '') {
            if (!tmpMap[community]) {
              tmpMap[community] = colorpool[count] ? colorpool[count] : n.color;
              count += 1;
            }
            n.color = tmpMap[community];
          }
        });
      } else if (this.props.option.allNodeColor.color.globalColor) {
        this.sigma.graph.forEachNode((node) => {
          const n = node;
          n.color = this.props.option.allNodeColor.color.nodesColor;
        });
      } else {
        const { nodesHighColor,
                nodesLowColor, algorithms } = this.props.option.allNodeColor.color.gradientColor;
        const centralityValue = algorithms.value ? algorithms.value : algorithms;
        if (centralityValue === 'degree') {
          let maxDegree = 0;
          _.forIn(this.sigma.graph.nodes(), (node) => {
            const degree = this.sigma.graph.degree(node.id);
            maxDegree = degree > maxDegree ? degree : maxDegree;
          });
          _.forIn(this.sigma.graph.nodes(), (node) => {
            const n = node;
            const degree = this.sigma.graph.degree(n.id);
            const highColor = hexToRgb(nodesHighColor);
            const lowerColor = hexToRgb(nodesLowColor);
            const r = interpolate(lowerColor.r, highColor.r, maxDegree, degree);
            const g = interpolate(lowerColor.g, highColor.g, maxDegree, degree);
            const b = interpolate(lowerColor.b, highColor.b, maxDegree, degree);
            n.color = `rgb(${r},${g},${b})`;
          });
        } else if (centralityValue === 'betweennes' || centralityValue === 'closeness'
                  || centralityValue === 'pagerank') {
          let mapping;
          if (centralityValue === 'betweennes') {
            if (!this.betweennes) {
              this.betweennes = beweennes(this.sigma.graph);
            }
            mapping = this.betweennes;
          }
          if (centralityValue === 'closeness') {
            if (!this.closeness) {
              this.closeness = closeness(this.sigma.graph);
            }
            mapping = this.closeness;
          }
          if (centralityValue === 'pagerank') {
            if (!this.pagerank) {
              this.pagerank = pagerank(this.sigma.graph);
            }
            mapping = this.pagerank;
          }

          let maxCentrality = 0;
          _.forIn(this.sigma.graph.nodes(), (node) => {
            const centra = mapping[node.id];
            maxCentrality = centra > maxCentrality ? centra : maxCentrality;
          });
          _.forIn(this.sigma.graph.nodes(), (node) => {
            const n = node;
            const centra = mapping[node.id];
            const highColor = hexToRgb(nodesHighColor);
            const lowerColor = hexToRgb(nodesLowColor);
            const r = interpolate(lowerColor.r, highColor.r, maxCentrality, centra);
            const g = interpolate(lowerColor.g, highColor.g, maxCentrality, centra);
            const b = interpolate(lowerColor.b, highColor.b, maxCentrality, centra);
            n.color = `rgb(${r},${g},${b})`;
          });
        }
      }
    } else {
      this.sigma.graph.forEachNode((node) => {
        const n = node;
        n.color = n.rawColor;
      });
    }
  }
  adjustEdgeSize() {
    if (this.props.option.allEdgesSize.customSize) {
      this.sigma.settings('maxEdgeSize', this.props.option.allEdgesSize.size.edgesSize);
    } else {
      this.sigma.settings('maxEdgeSize', 5);
    }
  }
  adjustNodeSize() {
    if (this.props.option.allNodeSize.customSize) {
      const { globalSize, nodesSize, algorithms } = this.props.option.allNodeSize.size;
      const centralityValue = algorithms.value ? algorithms.value : algorithms;
      if (!globalSize) {
        if (centralityValue === 'degree') {
          this.sigma.graph.forEachNode((node) => {
            const n = node;
            const degree = this.sigma.graph.degree(node.id);
            n.size = nodesSize * Math.sqrt(degree);
          });
        } else if (centralityValue === 'betweennes' || centralityValue === 'closeness'
                  || centralityValue === 'pagerank') {
          let mapping;
          if (centralityValue === 'betweennes') {
            if (!this.betweennes) {
              this.betweennes = beweennes(this.sigma.graph);
            }
            mapping = this.betweennes;
          }
          if (centralityValue === 'closeness') {
            if (!this.closeness) {
              this.closeness = closeness(this.sigma.graph);
            }
            mapping = this.closeness;
          }
          if (centralityValue === 'pagerank') {
            if (!this.pagerank) {
              this.pagerank = pagerank(this.sigma.graph);
            }
            mapping = this.pagerank;
          }

          let maxCentrality = 0;
          this.sigma.graph.forEachNode((node) => {
            const centra = mapping[node.id];
            maxCentrality = centra > maxCentrality ? centra : maxCentrality;
          });
          this.sigma.graph.forEachNode((node) => {
            const n = node;
            const centra = mapping[node.id];
            n.size = nodesSize * Math.sqrt(centra);
          });
        }
      } else {
        this.sigma.graph.forEachNode((node) => {
          const n = node;
          n.size = nodesSize;
        });
      }
      this.sigma.settings('maxNodeSize', nodesSize);
    } else {
      const { nodesSize } = this.props.option.allNodeSize.size;
      this.sigma.graph.forEachNode((node) => {
        const n = node;
        n.size = n.rawSize;
      });
      this.sigma.settings('maxNodeSize', nodesSize);
    }
  }
  updateEventCanvas() {
    const parentConfig = this.graph.parentElement.getBoundingClientRect();
    this.eventCanvas.width = parentConfig.width;
    this.eventCanvas.height = parentConfig.height;
    this.triggerTooltip();
  }

  initGraph() {
    if (!Sigma.classes.graph.hasMethod('getNeighbors')) {
      Sigma.classes.graph.addMethod('getNeighbors', function (id) {
        return this.allNeighborsIndex.get(id).keyList();
      });
      Sigma.classes.graph.addMethod('getNeighborLink', function (id) {
        return _.map(this.allNeighborsIndex.get(id).valueList(), v => v.keyList()[0]);
      });
      Sigma.classes.graph.addMethod('getAllConnection', function () {
        return this.allNeighborsIndex;
      });
      Sigma.classes.graph.addMethod('forEachNode', function (func) {
        _.forEach(this.nodesArray, (n) => {
          func(n);
        });
      });
      Sigma.classes.graph.addMethod('getEdges', function (nId1, nId2) {
        const edgesArr = this.inNeighborsIndex.get(nId1).get(nId2);
        return edgesArr ? edgesArr.valueList()[0] : null;
      });

      Sigma.classes.graph.addMethod('getNodesCount', function () {
        return this.nodesArray.length;
      });
      Sigma.classes.graph.addMethod('getLinksCount', function () {
        return this.edgesArray.length;
      });

      Sigma.classes.graph.addMethod('forEachLinkedNode', function (v, func) {
        const neighbors = this.getNeighbors(v);
        _.forIn(neighbors, (n) => {
          const edges = _.first(this.allNeighborsIndex.get(v).get(n).valueList());
          const node = this.nodes(n);
          func(node, Object.assign({}, edges, { fromId: edges.source, toId: edges.target }));
        });
      });
    }
    this.sigma = new Sigma({
      graph: this.props.defaultData,
      renderers: [
        {
          container: document.getElementById(this.instanceId),
          type: 'webgl', // webgl can not support edge curve
        },
      ],
      settings: this.props.settings,
    });

    elementResizeEvent(document.getElementById(this.instanceId), () => {
      this.updateEventCanvas();
      this.sigma.refresh({ skipIndexation: true });
      this.updateFilterDate();
      this.showCommunityPolygon();
    });

    this.sigma.camera.bind('coordinatesUpdated', () => {
      this.updateEventCanvas();
      this.sigma.refresh({ skipIndexation: true });
      this.updateFilterDate();
      this.showCommunityPolygon();
    });

    _.forEach(document.getElementsByTagName('canvas'), (c) => {
      const canvas = c;
      canvas.style.left = 0;
    });
    this.sigma.bind('hovers', this.hoverEvent);
    this.sigma.bind('click', this.clickEvent);
    this.sigma.bind('clickNode', this.clickNodeEvent);

    this.sigma.bind('coordinatesUpdated', () => {
      this.updateEventCanvas();
    });
    this.sigma.graph.forEachNode((node) => {
      const n = node;
      n.rawColor = node.color;
      n.rawSize = node.size;
    });
    _.forEach(this.sigma.graph.edges(), (edge) => {
      const e = edge;
      e.rawColor = e.color;
    });
  }
  clickNodeEvent(e) {
    const node = e && e.data && e.data.node;
    if (node && this.props.onClickNode) {
      this.clearCanvas();
      this.props.onClickNode(node);
    }
  }
  doubleClickEvent() {
    if (this.props.onDoubleClick) {
      this.props.onDoubleClick();
    }
  }
  clickEvent(e) {
    if (this.polygon && this.props.option.showCommunityPolygon) {
      const { clientX, clientY } = e.data;
      const graphPosition = this.graph.getBoundingClientRect();
      _.mapKeys(this.polygon, (value, key) => {
        const points = value;
        if (hitTest([clientX - graphPosition.left, clientY - graphPosition.top], points)) {
          console.log(key);
        }
      });
    }
  }
  hoverEvent(e) {
    const node = _.first(e.data.current.nodes);
    if (node) {
      const connectNodes = this.sigma.graph.getNeighbors(node.id);
      const nodes = [];
      const edges = [];
      _.forIn(connectNodes, (key) => {
        nodes.push(this.sigma.graph.nodes(key));
        edges.push([this.sigma.graph.nodes(node.id),
          this.sigma.graph.nodes(key)]);
      });
      if (!this.props.onFilter) {
        this.drawingHoverStateNode(node, nodes, edges);
        this.sigma.settings('enableCamera', false);
      }
      this.props.onHoverNode && this.props.onHoverNode(node, e); //eslint-disable-line
      this.triggerTooltip(node);
    } else if (!this.props.onFilter) {
      this.clearCanvas();
      this.showCommunityPolygon();
      this.sigma.settings('enableCamera', true);
      this.triggerTooltip();
    }
  }

  adjustTooltipPosition() {
    const { tmpLeft, tmpTop } = this.state;
    const tooltipPosition = this.tooltip.getBoundingClientRect();
    const graphPosition = this.graph.getBoundingClientRect();
    let left = tmpLeft;
    let top = tmpTop;
    if (tmpLeft + tooltipPosition.width > graphPosition.right - graphPosition.left) {
      left = graphPosition.right - tooltipPosition.width - graphPosition.left;
    }
    if (tmpTop + tooltipPosition.height > graphPosition.bottom - graphPosition.top) {
      top = tmpTop - tooltipPosition.height - 10;
    }
    Object.assign(this.tooltip.style, { top: `${top}px`, left: `${left}px` });
  }

  triggerTooltip(node) {
    if (node && this.props.tooltip && this.props.tooltip.enable) {
      const x = node['cam0:x'] + 5;
      const y = node['cam0:y'] + 5;

      Object.assign(this.tooltip.style, { opacity: 1 });

      const template = this.props.tooltip.format && this.props.tooltip.format(node, this.props);
      if (template) {
        this.setState({ tooltip: template, tmpLeft: x, tmpTop: y });
      }
    } else {
      Object.assign(this.tooltip.style, { opacity: 0 });
    }
  }
  clearCanvas() {
    const ctx = this.eventCanvas.getContext('2d');
    ctx.clearRect(0, 0, this.eventCanvas.width, this.eventCanvas.height);
    this.eventCanvas.style.backgroundColor = 'transparent';
  }

  drawingFilterStateNode(nodes) {
    const ctx = this.eventCanvas.getContext('2d');
    this.clearCanvas();
    this.eventCanvas.style.backgroundColor = this.props.hoverMask.bgColor ? this.props.hoverMask.bgColor : 'rgba(255,255,255,0.5)';

    const edgeArr = [];
    _.forEach(nodes, (n) => {
      if (n) {
        _.forEach(nodes, (n2) => {
          if (n2 && n !== n2 && this.sigma.graph.getEdges(n.id, n2.id)) {
            const e = this.sigma.graph.getEdges(n.id, n2.id);
            edgeArr.push({ n, n2, e });
          }
        });
      }
    });
    _.forEach(edgeArr, (edge) => {
      const { n, n2, e } = edge;
      ctx.beginPath();
      ctx.save();
      ctx.strokeStyle = e ? e.color : n.color;
      const x1 = n['cam0:x'];
      const y1 = n['cam0:y'];
      const x2 = n2['cam0:x'];
      const y2 = n2['cam0:y'];
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.restore();
      ctx.closePath();
    });
    _.forEach(nodes, (node) => {
      if (node) {
        ctx.beginPath();
        ctx.save();
        const x = node['cam0:x'];
        const y = node['cam0:y'];
        const s = node['cam0:size'];
        ctx.fillStyle = node.color;
        ctx.arc(x, y, s, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
        ctx.closePath();
      }
    });
  }

  drawingCommunityPolygon(points, color) {
    const ctx = this.eventCanvas.getContext('2d');

    ctx.beginPath();
    ctx.save();
    ctx.fillStyle = color;
    _.forEach(points, (n, idx) => {
      const [x, y] = n;
      if (idx === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
        if (idx === points.length - 1) {
          ctx.lineTo(points[0][0], points[0][1]);
        }
      }
    });
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawingHoverStateNode(targetNode, node, edges) {
    if (this.props.hoverMask && this.props.hoverMask.enable) {
      const ctx = this.eventCanvas.getContext('2d');
      this.clearCanvas();
      this.eventCanvas.style.backgroundColor = this.props.hoverMask.bgColor ? this.props.hoverMask.bgColor : 'rgba(255,255,255,0.5)';

      // drawing edges
      _.forEach(edges, ([node1, node2]) => {
        if (node1 && node2) {
          const e = this.sigma.graph.edges(this.sigma.graph.getNeighborLink(node1.id)[0]);
          ctx.beginPath();
          ctx.save();
          ctx.strokeStyle = e ? e.color : node1.color;
          const x1 = node1['cam0:x'];
          const y1 = node1['cam0:y'];
          const x2 = node2['cam0:x'];
          const y2 = node2['cam0:y'];
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          ctx.restore();
          ctx.closePath();
        }
      });

      // drawing node
      _.forEach(_.concat(node, targetNode), (n) => {
        if (n) {
          ctx.beginPath();
          ctx.save();
          const x = n['cam0:x'];
          const y = n['cam0:y'];
          const s = n['cam0:size'];
          if (n.icon) {
            ctx.fillStyle = n.icon.color;
            const size = Math.ceil(s * n.icon.scale);
            ctx.font = `${size}px ${n.icon.font}`;
            ctx.fillText(n.icon.content, x - (size / 2), y + (size / 2));
          } else {
            ctx.arc(x, y, s, 0, 2 * Math.PI);
          }
          ctx.fill();
          ctx.restore();
          ctx.closePath();
        }
      });

      if (!(this.props.tooltip && this.props.tooltip.enable)) {
        // drawing hover label
        if (targetNode && targetNode.label) {
          ctx.beginPath();
          ctx.save();
          const x = targetNode['cam0:x'];
          const y = targetNode['cam0:y'];
          const s = targetNode['cam0:size'];
          ctx.font = '14px arial';
          ctx.fillText(targetNode.label, x + s + 3, y + (14 / 3));
          ctx.restore();
          ctx.closePath();
        }
      }
    }
  }

  render() {
    const title = this.props.option.title && this.props.option.title.text;
    const showTitle = this.props.option.title && this.props.option.title.show;
    const titleColor = (this.props.option.title && this.props.option.title.color) || '#000';
    const titleLeft = (this.props.option.title && this.props.option.title.left) || '0px';
    const titleTextAlign = (this.props.option.title && this.props.option.title.textAlign) || 'left';

    return (
      <div style={{ width: '100%', height: '100%' }} onDoubleClick={this.doubleClickEvent}>
        <header
          style={{ padding: '5px',
            height: '30px',
            fontSize: '18px',
            fontWeight: '600',
            color: titleColor,
            paddingLeft: titleLeft,
            textAlign: titleTextAlign }}
        >{showTitle ? title : ''}</header>
        <div style={{ width: '100%', height: 'calc(100% - 30px)' }}>
          <div
            style={{
              width: this.props.option.width ? `${this.props.option.width}%` : this.props.width,
              height: this.props.option.height ? `${this.props.option.height}%` : this.props.height,
              userSelect: 'none',
            }}
            ref={(g) => { this.graph = g; }}
            id={this.instanceId}
          >
            <canvas
              style={{
                position: 'absolute',
                zIndex: '99',
                pointerEvents: 'none',
              }} ref={(c) => { this.eventCanvas = c; }}
            />
            <div
              className="graph-tooltip"
              ref={(t) => { this.tooltip = t; }}
              style={{ position: 'absolute',
                zIndex: 100,
                opacity: 0,
                pointerEvents: 'none',
                transitionProperty: 'opacity, top, left',
                transitionDuration: '0.5s',
                transitionTimingFunction: 'ease-out' }}
            >
              {this.state.tooltip}
            </div>
          </div>
        </div>
      </div>

    );
  }
}
