import _ from 'lodash';
const Utils = require('bcore/utils');
import Map from '../components/public/Map';
import { layers, TileLayer, ScatterKonvaPlain } from 'lmap-react';
import { wrapper } from './utils';


const result =  _.mapValues({ Map: Map, TileLayer, ScatterKonvaPlain }, wrapper);
export default result;

// _.mapValues(mapMap, (Item, key) => {
//   let {defaultProps={}, name} = Item;
//   const comType = Item.name === 'Connect' ? 'component' : 'childComponent';
//   const displayName = Item.name === 'Connect' ? '地图' : defaultProps.name_cn || name;
//   const {validation, options, binding} = defaultProps;
//   return {
//     component: Item,
//     name: displayName,
//     icon: 'barchart',
//     options, option: options,
//     validation,
//     binding,
//     comType,
//     type: Item.name
//   };
// });
