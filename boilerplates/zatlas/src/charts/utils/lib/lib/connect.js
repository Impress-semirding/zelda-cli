/**
* @Author: eason
* @Date:   2017-05-12T14:17:55+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2017-05-27T10:30:40+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import isEqual from 'lodash.isequal';

import { FeedManager, QueryEngine, DataTransformer } from './lib';

/**
 * Connect DataBinding with Chart
 * @param  {object} binding   chart binding
 * @param  {func} transform   chart transform
 * @return {HoC}
 */
const connect = (binding, transform) => WrappedComponent => class extends PureComponent {

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
    binding,
    ...WrappedComponent.defaultProps,
  };

  state = {
    data: undefined,
  };

  constructor(props) {
    super();

    if (props.feeding !== undefined) {
      this.queryEngine = new QueryEngine(props.onQuery);
      this.dataTransformer = new DataTransformer(transform);

      this.feedManager = new FeedManager({
        binding,
        query: this.queryEngine.query,
        transform: this.dataTransformer.transform,
        onError: () => this.setState({ data: undefined }, props.onError),
      });
    }
  }

  componentDidMount() {
    const { feeding } = this.props;
    if (this.props.feeding && this.feedManager) {
      this.feedManager.subscribe(feeding, (data) => {
        if (!isEqual(this.state.data, data)) {
          this.setState({ data });
        }
      });
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.feeding && this.props.feeding !== newProps.feeding && this.feedManager) {
      this.feedManager.subscribe(newProps.feeding, data => this.setState({ data }));
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.feeding) {
      return !isEqual(this.props.feeding, nextProps.feeding)
        || !isEqual(this.state.data, nextState.data)
        || !isEqual(this.props.option, nextState.option)
        || !isEqual(this.props.data, nextProps.data);
    } else {
      return super.shouldComponentUpdate();
    }
  }

  render() {
    const {
      feeding, // eslint-disable-line
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
      />
    );
  }
};

export default connect;
