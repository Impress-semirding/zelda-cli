var $ = require('jquery');
var L = require('./leaflet.js');
// var Model = L.model = require('@ali/map-data');
var Utils = require('./core/utils');

require('leaflet/dist/leaflet.css');
require('./index.css');

L.Utils = Object.assign({}, L.Util, Utils);

var dmap = L.dmap = L.dmap || {};
L.dmap.Utils = Utils;
require('./layer/areas');
require('./render/canvas');
require('./layer/tilelayer');
require('./layer/scatter_canvas');
require('./layer/scatter_markers');
require('./layer/scatter_marker');
require('./layer/flyingLineGradient');
require('./layer/flyingLineDash');
require('./layer/markercluster');
require('./layer/heatmap_grid_new');
require('./layer/trails_canvas');
require('./layer/scatter_konva');
require('./plugins/geo_coding_popup');
require('./plugins/filter/tilelayer');
require('./plugins/url_hash');
require('./map/map');
var CanvasGeojsonLayer = require('./layer/geojson_canvas');

// dmap.init = function (opt) {
//   if (opt.fileBase) {
//     Model.fileBase = opt.fileBase;
//   }
//   if (opt.severBase) {
//     Model.severBase = opt.severBase;
//   }
// };

module.exports = L;
