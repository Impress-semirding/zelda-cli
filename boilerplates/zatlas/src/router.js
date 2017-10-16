import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import theme from './Muitheme.js';

import App from 'routes/App';

function RouterConfig({ history }) {
  return (
    <MuiThemeProvider muiTheme={theme}>
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={App} />
        </Switch>
      </Router>
    </MuiThemeProvider>
  );
}

export default RouterConfig;
