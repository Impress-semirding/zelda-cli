/**
* @Author: eason
* @Date:   2017-04-20T14:13:11+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2017-06-12T15:09:36+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

const invariant = require('invariant');
const isPlainObject = require('lodash.isplainobject');
const isEqual = require('lodash.isequal');
const cloneDeep = require('lodash.clonedeep');

const DEFAULT_VALUE_TYPES = {
  'CATEGORY': ['string'], // eslint-disable-line
  'MEASURE': ['number', 'string'], // eslint-disable-line
};

const noop = () => {};
const toop = d => d;

module.exports = function createDataBinding({
  bindings,
  query,
  transform = toop,
  onError = noop,
} = {}) {
  const app = {
    // attributes
    bindings,
    valueTypes: null,
    types: null,
    // methods
    validateBindings,
    validateFeedings,
    validateQuery,
    extractFeedings,
    subscribe,
    //
    subscribers: [],
    state: {
      feedings: null,
      filters: null,
      data: [],
    },
  };

  function init() {
    // 1 bindings
    //   1.1 validate
    validateBindings(bindings);
    //   1.2 extract
    extractBindings(bindings);
    // 2 transform validate
    validateTransform();
    // 1.3 query validate
    validateQuery();
  }

  function validateBindings(bindings) { // eslint-disable-line
    invariant(bindings !== undefined, 'createDataBinding: bindings should be defined!');

    invariant(bindings !== null, 'createDataBinding: bindings should not be null!');

    invariant(Array.isArray(bindings), 'validateBinding: binding need be a array!');

    for (const b of bindings) {
      invariant(isPlainObject(b), `validateBinding: one of bindings: ${b.toString()} should be a plain object.`);
    }

    invariant(
      bindings.every(
        binding => ['key', 'type', 'accept'].every(e => Object.keys(binding).indexOf(e) !== -1) // eslint-disable-line
      ),
      'validateBinding: bindings item should have {key, type, accept} at least!' // eslint-disable-line
    );
  }

  function validateTransform(next) { // eslint-disable-line
    invariant(typeof transform === 'function', 'validateTransform: transform should be a function!');

    return next && next();
  }

  function validateQuery() {
    invariant(typeof query === 'function', 'createDataBinding: query should be a function!');

    invariant(query.length === 4, 'createDataBinding: query should be a function with 4 arguments!');
  }

  function extractBindings(bindings) { // eslint-disable-line
    const types = {}; // { 'X': 'CATEGORY', 'Y': 'MEASURE' }
    const valueTypes = {}; // { 'X': ['string'], 'Y': ['number'] }
    for (const binding of bindings) { // eslint-disable-line
      types[binding.key] = binding.type;
      valueTypes[binding.key] = binding.valueType || DEFAULT_VALUE_TYPES[binding.type];
    }

    app.types = types;
    app.valueTypes = valueTypes;

    return {
      types,
      valueTypes,
    };
  }

  function validateFeedings(feedings, bindings, next) { // eslint-disable-line
    invariant(isPlainObject(feedings), 'validateFeedings: feedings should be a plain object!');
    const bindingsObject = {};
    const bindingsKeys = [];
    for (const index in bindings) { // eslint-disable-line
      const key = bindings[index].key;
      const object = bindings[index];
      bindingsObject[key] = object;
      bindingsKeys.push(key);
    }

    for (const key in feedings) {
      if (bindingsKeys.indexOf(key) === -1) {
        return next(`validateFeedings: key(${key}) should be one of [${bindingsKeys.toString()}]!`);
      }

      const keyFeedings = feedings[key];
      const keyBinding = bindingsObject[key];
      const [min, max] = keyBinding.accept;
      if (!(keyFeedings.length >= min && keyFeedings.length <= max)) {
        return next(`validateFeedings: key(${key}) length should be acceptable in [${min}, ${max}]!`);
      }

      for (const one of keyFeedings) {
        const { name, type } = one;
        if (type !== keyBinding.type) {
          return next(`validateFeedings: ${name} type(${type}) should be ${keyBinding.type}!`);
        }
      }
    }

    return next(null, feedings);
  }

  function extractFeedings(feedings) {
    const typeFeedings = {}; // { 'CATEGORY': [], 'MEASURE': [] }
    const keyNames = {}; // { 'location': 'X', 'type': 'X', 'price': 'Y' }
    for (const key in feedings) { // eslint-disable-line
      const oneKeyFeedings = feedings[key];

      for (const feeding of oneKeyFeedings) {
        if (!Object.prototype.hasOwnProperty.call(typeFeedings, feeding.type)) {
          typeFeedings[feeding.type] = [feeding];
        } else {
          typeFeedings[feeding.type].push(feeding);
        }
        keyNames[feeding.name] = key;
      }
    }

    return {
      typeFeedings,
      keyNames,
    };
  }

  function validateQueriedData(data, valueTypes, keyNames, next) {
    if (isEqual(data, app.state.data)) {
      return next(true);
    }

    for (const d of data) {
      for (const name in d) { // eslint-disable-line
        const value = d[name];
        const valueType = typeof value;
        if (keyNames[name] && valueTypes[keyNames[name]].indexOf(valueType) === -1) {
          // return next(`validateQueriedData: data.name(${name}) should be one of types[${valueTypes[keyNames[name]].toString()}]!`);
        }
      }
    }

    return next(null, data);
  }

  function getState() {
    return app.state;
  }

  function subscribe(fn) {
    invariant(typeof fn === 'function', 'subscribe: fn should be a function.');
    app.subscribers.push(fn);
  }

  function setState(state, cb) {
    // @clone
    state = cloneDeep(state); // eslint-disable-line
    if (typeof state === 'function') {
      app.state = Object.assign({}, app.state, state(state));
    } else {
      app.state = Object.assign({}, app.state, state);
    }
    //
    cb && cb(); // eslint-disable-line
  }

  function notify(data, names, filters) {
    for (const subscriber of app.subscribers) {
      subscriber(data, names, filters);
    }
  }

  function dispatch(feedings, filters) {
    if (isEqual(app.state.feedings, feedings) && isEqual(app.state.filters, filters)) return false;

    setState({ feedings, filters }, () => {
      validateFeedings(feedings, bindings, (err) => {
        if (err) return onError(new Error(err));

        const { typeFeedings, keyNames } = extractFeedings(feedings);
        query(typeFeedings, keyNames, app.state.filters, (data) => {
          validateQueriedData(data, app.valueTypes, keyNames, (err, validatedData) => { // eslint-disable-line
            // Data not change, err === true
            if (err === true) return false;

            if (err) return onError(new Error(err));

            // validateTransform(transform, () => {
            const transformedData = transform(validatedData, typeFeedings, feedings, bindings);

            setState({ data: transformedData }, () => {
              notify(app.state.data, keyNames, app.state.filters);
            });
            // });
          });
        });
      });
      // new Promise(
      //   (resolve, reject) =>
      //   validateFeedings(feedings, bindings, resolve, reject) // eslint-disable-line
      // ).then(() => extractFeedings(feedings))
      //   .then(() => {
      //     // const data = await query(typeFeedings, keyNames);
      //     // const validateData = await validateQueriedData(data, app.valueTypes, keyNames);
      //     query(typeFeedings, keyNames, (data) => {
      //       const validatedData = transform(data, feedings, bindings);
      //       if (isEqual(validatedData, app.state.data)) return false;
      //
      //       setState({ data: validatedData }, () => {
      //         for (const subscriber of app.subscribers) {
      //           subscriber(app.state.data);
      //         }
      //       });
      //     });
      //   })
      //   .catch(err => onError(err));
    });
  }

  init();

  return {
    app,
    getState,
    dispatch,
    subscribe,
  };
};
