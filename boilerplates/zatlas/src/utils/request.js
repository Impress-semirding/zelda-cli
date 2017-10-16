import fetch from 'dva/fetch';

const DEFAULT_OPTION = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
};

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  return fetch(url, {
    ...DEFAULT_OPTION,
    ...options
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(data => data)
    .catch(err => () => {
      throw new Error(`${err.status}: ${err.statusText}`);
    });
}
