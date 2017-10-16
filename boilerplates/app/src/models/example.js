import { delay } from 'dva/saga';

import { TIMEOUT } from '@/meta';
import * as services from 'services/example';

export default {
  namespace: 'example',

  state: {
    name: 'Zelda'
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    }
  },

  effects: {
    *fetch({ payload }, { call, put, race }) {
      const { data, timeout } = yield race({
        data: call(services.fetch, payload),
        timeout: call(delay, TIMEOUT)
      });

      if (timeout) {
        throw new Error('example server timeout');
      }

      if (!data.success) {
        throw new Error(data.errorMsg || 'example server error');
      }

      yield put({
        type: 'save',
        payload: data.result
      });
    }
  },

  subscriptions: {}
};
