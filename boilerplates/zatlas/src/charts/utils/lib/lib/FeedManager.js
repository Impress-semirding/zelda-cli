/**
* @Author: eason
* @Date:   2017-04-20T14:13:11+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2017-06-05T14:18:19+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/
const assert = require('assert');
const isEqual = require('lodash.isequal');
const cloneDeep = require('lodash.clonedeep');

export default class FeedManager {

  constructor(props) {
    const {
      binding,
      query,
      transform,
      onError,
    } = props;

    this.actions = {
      query,
      transform,
    };

    this.onError = onError || function (err) { throw err; };

    this.state = {
      binding,

      feeds: null,

      map: {
        category: [],
        measure: [],
        legend: [],
      },
    };
  }

  setState(state, cb) {
    // @clone
    state = cloneDeep(state); // eslint-disable-line
    if (typeof state === 'function') {
      this.state = Object.assign({}, this.state, state(state));
    } else {
      this.state = Object.assign({}, this.state, state);
    }
    //
    cb && cb(); // eslint-disable-line
  }

  validate(feeds, cb = () => {}) {
    // @TODO validate
    assert(this.state.binding, 'Invalid Binding.');

    const validated = Object.keys(feeds).every((feedKey) => {
      const {
        type, accept: [min, max],
      } = this.state.binding.filter(({ key }) => key === feedKey).pop();
      const length = feeds[feedKey].length;
      if (length < min || length > max) {
        return false;
      } else if (feeds[feedKey].some(e => e.type !== type)) {
        return false;
      } else {
        return true;
      }
    });

    if (!validated) {
      cb(new Error('Invalid Feeding'));
      return false;
    } else if (isEqual(feeds, this.state.feeds)) {
      // no update
      cb();
      return true;
    } else {
      cb(null, feeds);
      return true;
    }
  }

  validateOne(key, feed) {
    const { type } = this.state.binding.filter(binding => key === binding.key).pop();
    if (feed.type !== type) {
      return false;
    } else {
      return true;
    }
  }

  filter(key, feeds) {
    return feeds.filter(feed => this.validateOne(key, feed));
  }

  setMap(cb) {
    const category = [];
    const measure = [];
    const legend = [];

    this.state.binding.forEach(({ key, bindingType }) => {
      return this.state.feeds[key] && this.state.feeds[key].forEach(({ name, type }) => {
        if (type === 'MEASURE') {
          measure.push(name);
        } else if (bindingType === 'legend') {
          legend.push(name);
        } else {
          category.push(name);
        }
      });
    });
    //
    this.setState({
      map: {
        category,
        measure,
        legend,
      },
    });

    cb();
  }

  // @TODO quer and map trigger at the same time
  onChange(cb) {
    this.actions.query(this.state.map, (data) => {
      this.setMap(() => {
        cb(this.actions.transform(data, this.state.map, this.state.feeds));
      });
    });
  }

  subscribe(feeds, cb) {
    // set binding
    this.validate(feeds, (err, validatedFeed) => {
      if (err) return this.onError(err);

      if (!validatedFeed) return false;

      console.log(validatedFeed);

      this.setState({ feeds: validatedFeed }, () => {
        this.onChange(cb);
      });
    });
  }

  // More
  // replaceQuery(query) {
  //   this.actions.query = query;
  // }
  //
  // replaceTransform(transform) {
  //   this.actions.transform = transform;
  // }
  //
  // replace(type, fn) {
  //   this.actions[type] = fn;
  // }

  // replaceState(type, object) {
  //   this.state[type] = object;
  // }
}
