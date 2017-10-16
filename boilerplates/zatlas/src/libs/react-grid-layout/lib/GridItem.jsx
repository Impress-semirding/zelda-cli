// @flow
import React, {PropTypes} from 'react';
import {DraggableCore} from 'react-draggable';
import {Resizable} from 'react-resizable';
import {perc, setTopLeft, setTransform} from './utils';
import classNames from 'classnames';

import type {DragCallbackData, Position} from './utils';

type State = {
  resizing: ?{width: number, height: number},
  dragging: ?{top: number, left: number},
  className: string
};
type ResizeDirection = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

/**
 * An individual item within a ReactGridLayout.
 */
export default class GridItem extends React.Component {

  static propTypes = {
    // Children must be only a single element
    children: PropTypes.element,

    // General grid attributes
    cols: PropTypes.number.isRequired,
    containerWidth: PropTypes.number.isRequired,
    rowHeight: PropTypes.number.isRequired,
    margin: PropTypes.array.isRequired,
    maxRows: PropTypes.number.isRequired,
    containerPadding: PropTypes.array.isRequired,

    // These are all in grid units
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    w: PropTypes.number.isRequired,
    h: PropTypes.number.isRequired,

    // All optional
    minW: function (props, propName) {
      const value = props[propName];
      if (typeof value !== 'number') return new Error('minWidth not Number');
      if (value > props.w || value > props.maxW) return new Error('minWidth larger than item width/maxWidth');
    },

    maxW: function (props, propName) {
      const value = props[propName];
      if (typeof value !== 'number') return new Error('maxWidth not Number');
      if (value < props.w || value < props.minW) return new Error('maxWidth smaller than item width/minWidth');
    },

    minH: function (props, propName) {
      const value = props[propName];
      if (typeof value !== 'number') return new Error('minHeight not Number');
      if (value > props.h || value > props.maxH) return new Error('minHeight larger than item height/maxHeight');
    },

    maxH: function (props, propName) {
      const value = props[propName];
      if (typeof value !== 'number') return new Error('maxHeight not Number');
      if (value < props.h || value < props.minH) return new Error('maxHeight smaller than item height/minHeight');
    },

    // ID is nice to have for callbacks
    i: PropTypes.string.isRequired,

    // Functions
    onDragStop: PropTypes.func,
    onDragStart: PropTypes.func,
    onDrag: PropTypes.func,
    onResizeStop: PropTypes.func,
    onResizeStart: PropTypes.func,
    onResize: PropTypes.func,

    // Flags
    isDraggable: PropTypes.bool.isRequired,
    isResizable: PropTypes.bool.isRequired,
    static: PropTypes.bool,

    // Use CSS transforms instead of top/left
    useCSSTransforms: PropTypes.bool.isRequired,

    // Others
    className: PropTypes.string,
    // Selector for draggable handle
    handle: PropTypes.string,
    // Selector for draggable cancel (see react-draggable)
    cancel: PropTypes.string
  };

  static defaultProps = {
    className: '',
    cancel: '',
    minH: 1,
    minW: 1,
    maxH: Infinity,
    maxW: Infinity
  };

  state: State = {
    resizing: null,
    dragging: null,
    className: ''
  };

  // Helper for generating column width
  calcColWidth(): number {
    const {margin, containerPadding, containerWidth, cols} = this.props;
    return (containerWidth - (margin[0] * (cols - 1)) - (containerPadding[0] * 2)) / cols;
  }

  /**
   * Return position on the page given an x, y, w, h.
   * left, top, width, height are all in pixels.
   * @param  {Number}  x             X coordinate in grid units.
   * @param  {Number}  y             Y coordinate in grid units.
   * @param  {Number}  w             W coordinate in grid units.
   * @param  {Number}  h             H coordinate in grid units.
   * @return {Object}                Object containing coords.
   */
  calcPosition(x: number, y: number, w: number, h: number, state: ?Object): Position {
    const {margin, containerPadding, rowHeight} = this.props;
    const colWidth = this.calcColWidth();

    const out = {
      left: Math.round((colWidth + margin[0]) * x + containerPadding[0]),
      top: Math.round((rowHeight + margin[1]) * y + containerPadding[1]),
      // 0 * Infinity === NaN, which causes problems with resize constraints;
      // Fix this if it occurs.
      // Note we do it here rather than later because Math.round(Infinity) causes deopt
      width: w === Infinity ? w : Math.round(colWidth * w + Math.max(0, w - 1) * margin[0]),
      height: h === Infinity ? h : Math.round(rowHeight * h + Math.max(0, h - 1) * margin[1])
    };

    if (state && state.resizing) {
      out.width = Math.round(state.resizing.width);
      out.height = Math.round(state.resizing.height);
    }

    if (state && state.dragging) {
      out.top = Math.round(state.dragging.top);
      out.left = Math.round(state.dragging.left);
    }

    return out;
  }

  /**
   * Translate x and y coordinates from pixels to grid units.
   * @param  {Number} top  Top position (relative to parent) in pixels.
   * @param  {Number} left Left position (relative to parent) in pixels.
   * @return {Object} x and y in grid units.
   */
  calcXY(top: number, left: number): {x: number, y: number} {
    const {margin, cols, rowHeight, w, h, maxRows} = this.props;
    const colWidth = this.calcColWidth();

    // left = colWidth * x + margin * (x + 1)
    // l = cx + m(x+1)
    // l = cx + mx + m
    // l - m = cx + mx
    // l - m = x(c + m)
    // (l - m) / (c + m) = x
    // x = (left - margin) / (coldWidth + margin)
    let x = Math.round((left - margin[0]) / (colWidth + margin[0]));
    let y = Math.round((top - margin[1]) / (rowHeight + margin[1]));

    // Capping
    x = Math.max(Math.min(x, cols - w), 0);
    y = Math.max(Math.min(y, maxRows - h), 0);

    return {x, y};
  }

  /**
   * Given a height and width in pixel values, calculate grid units.
   * @param  {Number} height Height in pixels.
   * @param  {Number} width  Width in pixels.
   * @return {Object} w, h as grid units.
   */
  calcWH({height, width}: {height: number, width: number}): {w: number, h: number} {
    const {margin, maxRows, cols, rowHeight, x, y} = this.props;
    const colWidth = this.calcColWidth();

    // width = colWidth * w - (margin * (w - 1))
    // ...
    // w = (width + margin) / (colWidth + margin)
    let w = Math.round((width + margin[0]) / (colWidth + margin[0]));
    let h = Math.round((height + margin[1]) / (rowHeight + margin[1]));

    // Capping
    w = Math.max(Math.min(w, cols - x), 0);
    h = Math.max(Math.min(h, maxRows - y), 0);
    return {w, h};
  }

  /**
   * This is where we set the grid item's absolute placement. It gets a little tricky because we want to do it
   * well when server rendering, and the only way to do that properly is to use percentage width/left because
   * we don't know exactly what the browser viewport is.
   * Unfortunately, CSS Transforms, which are great for performance, break in this instance because a percentage
   * left is relative to the item itself, not its container! So we cannot use them on the server rendering pass.
   *
   * @param  {Object} pos Position object with width, height, left, top.
   * @return {Object}     Style object.
   */
  createStyle(pos: Position): {[key: string]: ?string} {
    const {usePercentages, containerWidth, useCSSTransforms} = this.props;

    let style;
    // CSS Transforms support (default)
    if (useCSSTransforms) {
      style = setTransform(pos);
    }
    // top,left (slow)
    else {
      style = setTopLeft(pos);

      // This is used for server rendering.
      if (usePercentages) {
        style.left = perc(pos.left / containerWidth);
        style.width = perc(pos.width / containerWidth);
      }
    }

    return style;
  }

  /**
   * Mix a Draggable instance into a child.
   * @param  {Element} child    Child element.
   * @return {Element}          Child wrapped in Draggable.
   */
  mixinDraggable(child: React.Element<any>, disabled: Boolean): React.Element<any> {
    const empty = () => {};

    return (
      <DraggableCore
        onStart={disabled ? empty : this.onDragHandler('onDragStart')}
        onDrag={disabled ? empty : this.onDragHandler('onDrag')}
        onStop={disabled ? empty : this.onDragHandler('onDragStop')}
        handle={disabled ? '' : this.props.handle}
        cancel={".react-resizable-handle" + (this.props.cancel ? "," + this.props.cancel : "")}>
        {child}
      </DraggableCore>
    );
  }

  /**
   * Mix a Resizable instance into a child.
   * @param  {Element} child    Child element.
   * @param  {Object} position  Position object (pixel values)
   * @return {Element}          Child wrapped in Resizable.
   */
  mixinResizable(child: React.Element<any>, position: Position, disabled: Boolean): React.Element<any> {
    const {cols, x, minW, minH, maxW, maxH} = this.props;

    // This is the max possible width - doesn't go to infinity because of the width of the window
    const maxWidth = this.calcPosition(0, 0, cols - x, 0).width;

    // Calculate min/max constraints using our min & maxes
    const mins = this.calcPosition(0, 0, minW, minH);
    const maxes = this.calcPosition(0, 0, maxW, maxH);
    const minConstraints = [mins.width, mins.height];
    const maxConstraints = [Math.min(maxes.width, maxWidth), Math.min(maxes.height, Infinity)];

    const empty = () => {};
    return (
      <Resizable
        width={position.width}
        height={position.height}
        minConstraints={minConstraints}
        maxConstraints={maxConstraints}
        onResizeStop={disabled ? empty : this.onResizeHandler('onResizeStop')}
        onResizeStart={disabled ? empty : this.onResizeHandler('onResizeStart')}
        onResize={disabled ? empty : this.onResizeHandler('onResize')}>
        {child}
      </Resizable>
    );
  }

  /**
   * Wrapper around drag events to provide more useful data.
   * All drag events call the function with the given handler name,
   * with the signature (index, x, y).
   *
   * @param  {String} handlerName Handler name to wrap.
   * @return {Function}           Handler function.
   */
  onDragHandler(handlerName:string) {
    return (e:Event, {node, deltaX, deltaY}: DragCallbackData) => {
      if (!this.props[handlerName]) return;

      const newPosition: {top: number, left: number} = {top: 0, left: 0};

      // Get new XY
      switch (handlerName) {
        case 'onDragStart': {
          // ToDo this wont work on nested parents
          const {x, y, w, h} = this.props;
          const pos = this.calcPosition(x, y, w, h, this.state);
          this.setState({dragging: {
            left: pos.left,
            top: pos.top,
          }});
          break;
        }
        case 'onDrag':
          if (!this.state.dragging) throw new Error('onDrag called before onDragStart.');
          newPosition.left = this.state.dragging.left + deltaX / this.props.scale;
          newPosition.top = this.state.dragging.top + deltaY / this.props.scale;
          this.setState({dragging: newPosition});
          break;
        case 'onDragStop':
          if (!this.state.dragging) throw new Error('onDragEnd called before onDragStart.');
          newPosition.left = this.state.dragging.left;
          newPosition.top = this.state.dragging.top;
          this.setState({dragging: null});
          break;
        default:
          throw new Error('onDragHandler called with unrecognized handlerName: ' + handlerName);
      }

      const {x, y} = this.calcXY(newPosition.top, newPosition.left);

      this.props[handlerName](this.props.i, x, y, {e, node, newPosition});
    };
  }

  /**
   * Wrapper around drag events to provide more useful data.
   * All drag events call the function with the given handler name,
   * with the signature (index, x, y).
   *
   * @param  {String} handlerName Handler name to wrap.
   * @return {Function}           Handler function.
   */
  onResizeHandler(handlerName: string) {
    return (e:Event, {node, size}: {node: HTMLElement, size: Position}, direction?: ResizeDirection) => {
      const {cols, x, y, w, h, i, maxW, minW, maxH, minH} = this.props;
      if (!this.props[handlerName]) return;
      if (handlerName === 'onResizeStart') {
        this.lastResizeX = e.clientX;
        this.lastResizeY = e.clientY;
        this.lastResizeSize = size;
        this.lastResizePos = this.calcPosition(x, y, w, h, this.state);
      }
      let XScaleFlag = 1, YScaleFlag = 1;
      let XMoveFlag = 0, YMoveFlag = 0;
      console.log('direction', direction, handlerName);
      switch (direction) {
        case 'top-right':
          YScaleFlag = -1;
          YMoveFlag = -1;
          break;
        case 'bottom-left':
          XScaleFlag = -1;
          XMoveFlag = -1;
          break;
        case 'top-left':
          XScaleFlag = -1;
          YScaleFlag = -1;
          XMoveFlag = -1;
          YMoveFlag = -1;
          break;
        case 'bottom-right':
        default:
          break;
      }
      // Get new XY
      let newSize = {
        width: this.lastResizeSize.width + (e.clientX - this.lastResizeX) / this.props.scale * XScaleFlag,
        height: this.lastResizeSize.height + (e.clientY - this.lastResizeY) / this.props.scale * YScaleFlag,
      };
      let newPos = {
        left: this.lastResizePos.left - (e.clientX - this.lastResizeX) / this.props.scale * XMoveFlag,
        top: this.lastResizePos.top - (e.clientY - this.lastResizeY) / this.props.scale * YMoveFlag,
      };
      console.log(this.lastResizePos, newPos);

      let sizeWH = this.calcWH(newSize);
      let new_w = sizeWH.w;
      let new_h = sizeWH.h;

      // Cap w at numCols
      new_w = Math.min(new_w, cols - x);
      // Ensure w is at least 1
      new_w = Math.max(new_w, 1);

      // Min/max capping
      new_w = Math.max(Math.min(new_w, maxW), minW);
      new_h = Math.max(Math.min(new_h, maxH), minH);

      let new_x = (new_w - w) * XMoveFlag + x;
      let new_y = (new_h - h) * YMoveFlag + y;

      this.setState({
        resizing: handlerName === 'onResizeStop' ? null : newSize,
        dragging: handlerName === 'onResizeStop' ? null : newPos,
      });
      this.lastResizeX = e.clientX;
      this.lastResizeY = e.clientY;
      this.lastResizeSize = newSize;
      this.lastResizePos = newPos;
      this.props[handlerName](i, new_w, new_h, new_x, new_y, {e, node, newSize});
    };
  }

  render(): React.Element<any> {
    const {x, y, w, h, isDraggable, isResizable, useCSSTransforms} = this.props;

    const pos = this.calcPosition(x, y, w, h, this.state);
    const child = React.Children.only(this.props.children);

    // Create the child element. We clone the existing element but modify its className and style.
    let newChild = React.cloneElement(child, {
      className: classNames('react-grid-item', child.props.className, this.props.className, {
        static: this.props.static,
        resizing: Boolean(this.state.resizing),
        'react-draggable': isDraggable,
        'react-draggable-dragging': Boolean(this.state.dragging || this.state.resizing),
        cssTransforms: useCSSTransforms
      }),
      // We can set the width and height on the child, but unfortunately we can't set the position.
      style: {...this.createStyle(pos), ...this.props.style, ...child.props.style}
    });

    // Resizable support. This is usually on but the user can toggle it off.
    newChild = this.mixinResizable(newChild, pos, !isResizable);

    // Draggable suppor on, except for with placeholders.
    newChild = this.mixinDraggable(newChild, !isDraggable);

    return newChild;
  }
}
