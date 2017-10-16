const validateTypes = require('./../../lib/validateTypes');
const { dashArray } = validateTypes;

module.exports = [{
    name: 'geoid',
    value: 'adcode',
    uiType: 'hidden',
    key: 'geoid',
    valueType: 'string',
  }, {
    name: 'id',
    value: 'adcode',
    uiType: 'hidden',
    key: 'id',
    valueType: 'string',
  }, {
    name: 'count',
    value: 'count',
    uiType: 'hidden',
    key: 'value',
    valueType: 'string',
  }, {
    name: '样式',
    valueType: 'group',
    uiType: 'group',
    key: 'style',
    children: [
      {
        name: '填充颜色',
        valueType: 'gradient',
        uiType: 'gradient',
        key: 'fillColor',
        value: {
          domain: {
            min: 0,
            max: 1
          },
          range: {
            min: 'rgba(136,0,0,0.77)',
            max: 'rgba(255,233,0,0.99)'
          }
        }
      },

      {
        name: '边线颜色',
        valueType: 'color',
        uiType: 'color',
        key: 'color',
        value: 'rgba(0,0,0,1)'
      },

      {
        name: '边线粗细',
        valueType: 'float',
        uiType: 'slider',
        key: 'weight',
        value: 1.5,
        validate: {
          range: {
            min: 0,
            max: 10
          }
        }
      },

      {
        name: '线条样式',
        valueType: 'string',
        uiType: 'select',
        key: 'dashArray',
        value: '',
        validate: {
          options: dashArray
        }
      },
    ]
  }
];
