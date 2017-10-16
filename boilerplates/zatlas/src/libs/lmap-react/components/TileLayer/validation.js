
module.exports = [
  {
    "key": "type",
    "name": "瓦片",
    "valueType": "string",
    "uiType": "select",
    "value": "amapwhite",
    "validate": {
      "options": {
        "黑色卫星": "satellitetmapblack",
        "深蓝地图": "amapblue",
        "白色地图": "amapwhite",
        "卫星地图": "satellitetmap",
        "地铁地图": "geoqrailway",
        "水系地图": "geoqwater"
      }
    },
  },
  {
    key: 'filter',
    name: '高级编辑',
    uiType: 'group',
    valueType: 'group',
    expand: true,
    isable: false,
    children: [
      {
        key: 'opacity',
        value: 1,
        name: '透明度',
        uiType: 'slider',
        valueType: 'float',
        validate: {
          range: {
            min: 0,
            max: 1
          }
        }
      },
      {
        key: 'hueRotate',
        value: 0.001,
        name: '颜色偏移',
        uiType: 'slider',
        valueType: 'float',
        validate: {
          range: {
            min: 0,
            max: 360
          }
        }
      },
      {
        key: 'saturate',
        value: 100,
        name: '饱和度',
        uiType: 'slider',
        valueType: 'float',
        validate: {
          range: {
            min: 0,
            max: 200
          }
        }
      },
      {
        key: 'contrast',
        value: 100,
        name: '对比度',
        uiType: 'slider',
        valueType: 'float',
        validate: {
          range: {
            min: 0,
            max: 300
          }
        }
      },
      {
        key: 'brightness',
        value: 100,
        name: '明度',
        uiType: 'slider',
        valueType: 'float',
        validate: {
          range: {
            min: 0,
            max: 300
          }
        }
      },
      {
        key: 'grayscale',
        value: 0,
        name: '灰度',
        uiType: 'slider',
        valueType: 'float',
        validate: {
          range: {
            min: 0,
            max: 300
          }
        }
      },{
        key: 'sepia',
        value: 0,
        name: '着色',
        uiType: 'slider',
        valueType: 'float',
        validate: {
          range: {
            min: 0,
            max: 360
          }
        }
      },{
        key: 'invert',
        value: 0,
        name: '反色',
        uiType: 'slider',
        valueType: 'float',
        validate: {
          range: {
            min: 0,
            max: 100
          }
        }
      },{
        key: 'anim',
        value: 0,
        name: '缓动',
        uiType: 'slider',
        valueType: 'float',
        validate: {
          range: {
            min: 0,
            max: 1
          }
        }
      }
    ]
  }
];
