
import React, { Component, PropTypes } from 'react';
import L     from 'lmap';
import BaseLayer from './../BaseLayer';
import _ from 'lodash';

export default (name, fns) => {
	let LLayer;
	if(typeof(name) === 'string'){
		LLayer = L.dmap[name];
	} else {
		LLayer = name;
	}
  class Layer extends BaseLayer {
    constructor(props){
      super(props, LLayer, LLayer.options);
    }
    static getOptions = () => {
      return LLayer.options;
    }
  };
  //
  if(fns){
    _.forEach(fns, (fn, k) => {
      Layer.prototype[k] = fn;
      console.log(k, fn);
    });
  }
  return Layer;
};


