/**
 * @Author: eason
 * @Date:   2017-04-05T14:42:22+08:00
 * @Email:  uniquecolesmith@gmail.com
 * @Last modified by:   eason
 * @Last modified time: 2017-05-17T16:30:33+08:00
 * @License: MIT
 * @Copyright: Eason(uniquecolesmith@gmail.com)
 */

export default [{
  "key": "title",
  "valueType": "group",
  "name": "标题",
  "uiType": "group",
  "children": [{
    "key": "show",
    "value": true,
    "name": "是否显示",
    "uiType": "toggle",
    "valueType": "boolean",
    "validate": {}
  }, {
    "key": "text",
    "value": "地图",
    "valueType": "string",
    "name": "文字",
    "uiType": "input",
    "validate": {}
  }, {
    "key": "color",
    "value": "#4a4a4a",
    "valueType": "color",
    "name": "文字色",
    "uiType": "color",
    "validate": {}
  }, {
    "key": "background",
    "value": "rgba(255,255,255,0.8)",
    "valueType": "color",
    "name": "背景色",
    "uiType": "color",
    "validate": {}
  }, {
    "key": "left",
    "value": "20px",
    "valueType": "string",
    "name": "左边距",
    "uiType": "input",
    "validate": {}
  }, {
    "key": "top",
    "value": "10px",
    "valueType": "string",
    "name": "上边距",
    "uiType": "input",
    "validate": {}
  }, {
    "key": "textAlign",
    "value": "left",
    "valueType": "string",
    "name": "textAlign",
    "uiType": "input",
    "validate": {}
  }]
}, {
  "key": "zoomControl",
  "value": false,
  "name": "滚动缩放",
  "uiType": "toggle",
  "valueType": "boolean",
  "validate": {}
}, {
  "key": "attributionControl",
  "value": false,
  "name": "显示版权",
  "uiType": "toggle",
  "valueType": "boolean",
  "validate": {}
}, {
  "key": "doubleClickZoom",
  "value": false,
  "name": "双击放大",
  "uiType": "toggle",
  "valueType": "boolean",
  "validate": {}
}, {
  "key": "doubleClickGeoCoding",
  "value": true,
  "name": "双击geocoding",
  "uiType": "toggle",
  "valueType": "boolean",
  "validate": {}
}, {
    "key": "background",
    "value": "#000",
    "valueType": "color",
    "name": "背景色",
    "uiType": "color",
    "validate": {}
  },
];