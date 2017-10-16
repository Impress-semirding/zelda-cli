//有时外部调用组件 需引用ldmap所调用的leaflet 
require('leaflet/dist/leaflet.css');
require('./index.css');
module.exports = require('./polyfills/index.js');
