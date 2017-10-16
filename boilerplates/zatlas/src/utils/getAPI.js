export default function getAPI() {
  // eslint-disable-next-line
  if (ENV_PROD && !API_TEST) {
    return 'http://www.easy-mock.com';
  } else {
    return 'http://www.easy-mock.com';
  }
}
