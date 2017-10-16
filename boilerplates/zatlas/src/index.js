import dva from 'dva';
import injectTapEventPlugin from 'react-tap-event-plugin';

import './global.css';
import './index.css';

// 1. Initialize
const app = dva({
  onError(err) {
    console.log(err);
  }
});

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('models/page'));
app.model(require('models/databinding'));
app.model(require('models/grid'));
app.model(require('models/options'));
app.model(require('models/styles'));

// 4. Router
app.router(require('./router'));

// 5. Start
injectTapEventPlugin();

app.start('#root');
