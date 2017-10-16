
import Utils from 'lmap/core/utils'
import _ from 'lodash';

// function get

const map = {
  color: function () {
  }
}

function getFeedingValue(d, key, feedings) {
  if (!feedings || !feedings[key] || !feedings[key][0]) return d[key];
  let method = feedings[key][0].method;
  let name = feedings[key][0].name;
  let keyValue = method ? `${method}(${name})` : name;

  return d[keyValue];
}

export default {
  getFeedingValue,
}
