import Maps  from './../../';
import _     from 'lodash';
import React, { Component } from 'react';
import zUtils from 'zcontrol/lib/utils';

const upperFirst = (str) => str.substring(0,1).toUpperCase() + str.substring(1)

//地图解析的功能
const getCom      = (conf) => conf.com;
const getDatas    = (conf) => {
  const {datas} = conf;
  const result = {};
  _.forEach(datas, (d, k) => {
    result[k] = d.id || d;
  });
  return result;
};
const getFeed     = (conf) => conf.feed;
const getOptions  = (conf) => Array.isArray(conf.options) ? zUtils.toObject(conf.options) : conf.options;
const getVisual   = (conf) =>  Maps[upperFirst(conf.com)];
const getChildren = (conf) =>  conf.children;
const getKey      = (conf) =>  getCom(conf) + (conf.key || '');
const getHooks    = (conf) =>  conf.hooks || {};

const comParserChildren = (children, hooks) => {
  const result = [];
  _.forEach(children, (conf) => {
    result.push(comParser(conf, hooks));
  });
  return result;
};

const comParser = (conf, hooks={}) => {
  const com      = getCom(conf);
  const datas    = getDatas   (conf);
  console.log(datas, 'datas...');
  const options  = getOptions (conf);
  const children = getChildren(conf);
  const key      = getKey     (conf);
  const hks      = getHooks   (conf);
  const feed     = getFeed    (conf);
  //是的
  const Visual   = getVisual  (conf);
  if (!Visual) {
    console.log(`名为${com}的组件不存在`);
    return null;
  };

  const events = {};
  _.forEach(hks, (fn, k) => {
    events[k] = (a, b) => fn(a, b, hooks.onGlobalChange);
  });

//onBoundChange
// onChange
  return (
    <Visual
      {...datas}
      options={options}
      events={events}
      key={key}
      hooks={hooks}
      feed={feed}
      {...hooks}
    >
      {
        comParserChildren(children, hooks)
      }
    </Visual>
  );
};

export default {
  comParser
};
