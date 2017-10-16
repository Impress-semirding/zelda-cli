import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';

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
      {
        Object.entries(props.page).map(t => (
          <Link className={styles.link} key={t[0]} to={t[1]}>{t[0]}</Link>
        ))
      }
    </div>
  );
}

function mapStateToProps(state) {
  return {
    page: state.page
  };
}

export default connect(mapStateToProps)(App);
