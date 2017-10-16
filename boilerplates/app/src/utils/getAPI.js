export default function getAPI() {
  // eslint-disable-next-line
  if (ENV_PROD && !API_TEST) {
    return 'prod.api';
  } else {
    return 'test.api';
  }
}
