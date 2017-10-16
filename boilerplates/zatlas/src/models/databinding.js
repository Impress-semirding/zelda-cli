import _ from 'lodash';
import * as services from 'services/databinding';

export default {
  namespace: 'databinding',
  state: {},
  reducers: {},
  effects: {
    *'query/feeding'({ payload: { callback, url } }, { call }) {
      if (url && !_.isEmpty(url)) {
        const data = yield call(services.fetchUrl, url.data);
        return callback(data);
      }
    }
  },
  subscriptions: {}
};
