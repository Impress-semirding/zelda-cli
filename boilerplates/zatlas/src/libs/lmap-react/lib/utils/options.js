
import Utils from 'lmap/core/utils'
import _ from 'lodash';

// const operators = ['/', '*'];
const parseValue = (v) => {
  if(!v) return null;
  if (v.indexOf('/') !== -1){
    v = v.split('/');
    return d => d[v[0]] / d[v[1]];
  }
  if (v.indexOf('*') !== -1){
    v = v.split('*');
    return d => d[v[0]] * d[v[1]];
  }
  return d => {
    if(d) return d[v];
    return null;
  };
}

function isFeedingObject (feeding){
  if (typeof(feeding) === 'object' && feeding && feeding.name) return true;
  return false;
}

function getCol (feeding, vf) {
  if(isFeedingObject(feeding)){
    if (vf === 'popup' && feeding) {
      const result = {};
      _.forEach(feeding, (feed) => {
        result[feed.name] = feed.name;
      });
      return result;
    } else {
      feeding = feeding[0];
      return feeding ? feeding.name : null;
    }
  }
  return feeding;
}

function getVisualF (feeding, vf){
  // if(isFeedingObject(feeding)){
  //   return null;
  // }
  return vf;
}

function getFeedFunc(bindingType, col, visualF) {
  if (bindingType === 'popup') return Utils.genPopupObject(col);
  if (bindingType === 'geoid') return feature => feature.properties[col];
  if (bindingType === 'raw')   return d => d[col];
  if (bindingType === 'kpis')  return col;
  // if (bindingType === 'geoid') return feature => feature.properties[geoid];
}

const parseOptions = (options, feedings, binding) => {
  options = _.cloneDeep(options);
  const {id, geoid, popup, value, lat, lng, size, zIndex} = options;
  if (typeof(id)     === 'string')    options.id = d => d[id];
  if (typeof(geoid)  === 'string')    options.geoid = feature => feature.properties[geoid];
  if (typeof(value)  === 'string')    options.value = parseValue(value);
  if (size  && typeof(size)   !== 'function')  options.size = d => size;
  if (popup && typeof(popup)  !== 'function')  options.popup = Utils.genPopupObject(popup);
  if (typeof(zIndex) === 'string')    options.zIndex = d => -d[zIndex];
  if (lat === 'ba') options.lat = Utils.getLatBA;
  if (lng === 'ba') options.lng = Utils.getLngBA;
  //
  
  if (binding && feedings) {
    binding = _.keyBy(binding, 'key');
    _.forEach(feedings, (feeding, vf) => {
      const col     = getCol(feeding, vf);
      if (!col)  return;
      const visualF = getVisualF (feeding, vf);
      const bind    = binding[visualF];
      if (!bind) return console.error(`key为${vf}的feeding不合法`);
      const { target=visualF, bindingType } = bind;
      const func = getFeedFunc(bindingType, col, visualF);
      if (func) _.set(options, target, func);
    });
  }
  return options;
};

export default { parseOptions };
