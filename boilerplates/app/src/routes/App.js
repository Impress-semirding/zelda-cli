import React from 'react';
import { connect } from 'dva';

import Example from 'components/Example';

import styles from './App.css';

function App(props) {
  return (
    <div className={styles.root}>
      <h1 className={styles.title}>Yay! Welcome to Zelda!</h1>
      <div className={styles.welcome} />
      <ul className={styles.list}>
        <li>
          To get started, edit <code>src/index.js</code> and save to reload.
        </li>
        <li>
          <a href="https://github.com/dvajs/dva-docs/blob/master/v1/en-us/getting-started.md">
            Getting Started
          </a>
        </li>
      </ul>
      <Example data={props.example} />
    </div>
  );
}

function mapStateToProps({ example }) {
  return {
    example
  };
}

export default connect(mapStateToProps)(App);
