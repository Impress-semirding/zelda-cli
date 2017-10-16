import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import styles from './Example.css';

class Example extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      name: PropTypes.string
    })
  };

  static defaultProps = {
    data: {
      name: ''
    }
  };

  state = {};

  render() {
    const { name } = this.props.data;

    return <div className={styles.root}>{name}</div>;
  }
}

export default Example;
