import getAPI from 'utils/getAPI';

export default {
  prefix: getAPI(),

  TIMEOUT: 10000,

  example: {
    path: '/example',
    method: 'GET'
  }
};
