/**
* @Author: eason
* @Date:   2017-05-12T14:17:55+08:00
* @Email:  uniquecolesmith@gmail.com
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import isEqual from 'lodash.isequal';

import createDataBinding from './dataBinding';

/**
 * Connect DataBinding with Chart
 * @param  {object} binding   chart binding
 * @param  {func} transform   chart transform
 * @return {HoC}
 */
 
const connect = (bindings, transform) => WrappedComponent => class extends PureComponent {

  static displayName = `ConnectDataBinding(${WrappedComponent.displayName || WrappedComponent.name})`;

  static propTypes = {
    /**
     * Query API: give the query right to outside
     * @type {function}
     */
    onQuery: PropTypes.func.isRequired,

    /**
     * Error catch API: catch error
     * @type {[type]}
     */
    onError: PropTypes.func,
  };

  static defaultProps = {
    bindings,
    ...WrappedComponent.defaultProps,
  };

  state = {
    data: undefined,
  };

  constructor(props) {
    super();

    // if (props.feeding !== undefined) {
    this.feedManager = createDataBinding({
      bindings,
      query: props.onQuery,
      transform: transform,
      onError: err => this.setState({ data: undefined }, () => props.onError(err)),
    });

    this.feedManager.subscribe(data => this.setState({ data }));
    // }
  }

  componentDidMount() {
    const { feedings, filters } = this.props;
    if (this.props.feedings && this.feedManager) {
      this.feedManager.dispatch(feedings, filters);
    }
  }

  componentWillReceiveProps(newProps) {
    const { feedings, filters } = this.props;
    const { feedings: nFeedings, filters: nFilters } = newProps;
    if ((feedings !== nFeedings || filters !== nFilters) && this.feedManager) {
      this.feedManager.dispatch(nFeedings, nFilters);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.feedings) {
      // return !isEqual(this.props.feeding, nextProps.feeding)
      return !isEqual(this.state.data, nextState.data)
        || !isEqual(this.props.option, nextState.option)
        || !isEqual(this.props.data, nextProps.data);
    }
  }

  componentWillUnmount() {
    if (this.feedManager) {
      this.feedManager = null;
    }
  }

  render() {
    const {
      feedings, // eslint-disable-line
      onQuery, // eslint-disable-line
      onError, // eslint-disable-line
      ...otherProps
    } = this.props;

    // const finalData = feeding ? this.state.data : this.props.data;
    const finalData = this.props.data ? this.props.data : this.state.data;

    return (
      <WrappedComponent
        {...otherProps}
        ref={ref => (this.ref = ref)}
        data={finalData}
        feedings={feedings}
      />
    );
  }
};

export default connect;
