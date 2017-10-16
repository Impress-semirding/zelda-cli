/**
* @Author: eason
* @Date:   2017-05-23T17:39:38+08:00,
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2017-05-27T14:58:25+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

module.exports = [
  {
    key: 'backgroundColor',
    value: 'transparent',
    valueType: 'string',
    name: 'backgroundColor',
    uiType: 'input',
    validate: {},
  }, {
    key: 'color',
    valueType: 'group',
    name: 'color',
    uiType: 'group',
    children: [
      {
        key: 0,
        value: 'red',
        valueType: 'color',
        name: 0,
        uiType: 'color',
        validate: {},
      }, {
        key: 1,
        value: '#A13FC3',
        valueType: 'color',
        name: 1,
        uiType: 'color',
        validate: {},
      }, {
        key: 2,
        value: '#98C2CF',
        valueType: 'color',
        name: 2,
        uiType: 'color',
        validate: {},
      }, {
        key: 3,
        value: '#6FB3F1',
        valueType: 'color',
        name: 3,
        uiType: 'color',
        validate: {},
      }, {
        key: 4,
        value: '#4CBFCF',
        valueType: 'color',
        name: 4,
        uiType: 'color',
        validate: {},
      }, {
        key: 5,
        value: '#61D6B1',
        valueType: 'color',
        name: 5,
        uiType: 'color',
        validate: {},
      }, {
        key: 6,
        value: '#A0E896',
        valueType: 'color',
        name: 6,
        uiType: 'color',
        validate: {},
      }, {
        key: 7,
        value: '#E7F59B',
        valueType: 'color',
        name: 7,
        uiType: 'color',
        validate: {},
      }, {
        key: 8,
        value: '#D3C24B',
        valueType: 'color',
        name: 8,
        uiType: 'color',
        validate: {},
      }, {
        key: 9,
        value: '#536572',
        valueType: 'color',
        name: 9,
        uiType: 'color',
        validate: {},
      },
    ],
  }, {
    key: 'title',
    valueType: 'group',
    name: 'title',
    uiType: 'group',
    children: [
      {
        key: 'show',
        value: false,
        name: 'show',
        uiType: 'toggle',
        valueType: 'boolean',
        validate: {},
      },
    ],
  }, {
    key: 'tooltip',
    valueType: 'group',
    name: 'tooltip',
    uiType: 'group',
    children: [
      {
        key: 'trigger',
        value: 'axis',
        valueType: 'string',
        name: 'trigger',
        uiType: 'input',
        validate: {},
      }, {
        key: 'backgroundColor',
        value: '#fff',
        valueType: 'color',
        name: 'backgroundColor',
        uiType: 'color',
        validate: {},
      }, {
        key: 'textStyle',
        valueType: 'group',
        name: 'textStyle',
        uiType: 'group',
        children: [
          {
            key: 'fontSize',
            value: 10,
            valueType: 'integer',
            name: 'fontSize',
            uiType: 'slider',
            validate: {
              range: {
                min: 0.5,
                max: 42,
              },
              step: 1,
            },
          }, {
            key: 'color',
            value: '#4A4A4A',
            valueType: 'color',
            name: 'color',
            uiType: 'color',
            validate: {},
          },
        ],
      }, {
        key: 'axisPointer',
        valueType: 'group',
        name: 'axisPointer',
        uiType: 'group',
        children: [
          {
            key: 'lineStyle',
            valueType: 'group',
            name: 'lineStyle',
            uiType: 'group',
            children: [
              {
                key: 'color',
                value: '#C9C9C9',
                valueType: 'color',
                name: 'color',
                uiType: 'color',
                validate: {},
              },
            ],
          },
        ],
      }, {
        key: 'extraCssText',
        value: 'box-shadow: 0 2px 4px rgba(0,0,0,.5);',
        valueType: 'string',
        name: 'extraCssText',
        uiType: 'input',
        validate: {},
      },
    ],
  }, {
    key: 'grid',
    valueType: 'group',
    name: 'grid',
    uiType: 'group',
    children: [
      {
        key: 'top',
        value: '20px',
        valueType: 'string',
        name: 'top',
        uiType: 'input',
        validate: {},
      }, {
        key: 'left',
        value: '3%',
        valueType: 'string',
        name: 'left',
        uiType: 'input',
        validate: {},
      }, {
        key: 'right',
        value: '4%',
        valueType: 'string',
        name: 'right',
        uiType: 'input',
        validate: {},
      }, {
        key: 'bottom',
        value: '20px',
        valueType: 'string',
        name: 'bottom',
        uiType: 'input',
        validate: {},
      }, {
        key: 'containLabel',
        value: true,
        name: 'containLabel',
        uiType: 'toggle',
        valueType: 'boolean',
        validate: {},
      },
    ],
  }, {
    key: 'xAxis',
    valueType: 'group',
    name: 'xAxis',
    uiType: 'group',
    children: [
      {
        key: 'axisLine',
        valueType: 'group',
        name: 'axisLine',
        uiType: 'group',
        children: [
          {
            key: 'lineStyle',
            valueType: 'group',
            name: 'lineStyle',
            uiType: 'group',
            children: [
              {
                key: 'color',
                value: '#E2E2E2',
                valueType: 'color',
                name: 'color',
                uiType: 'color',
                validate: {},
              },
            ],
          },
        ],
      }, {
        key: 'axisTick',
        valueType: 'group',
        name: 'axisTick',
        uiType: 'group',
        children: [
          {
            key: 'show',
            value: false,
            name: 'show',
            uiType: 'toggle',
            valueType: 'boolean',
            validate: {},
          },
        ],
      }, {
        key: 'axisLabel',
        valueType: 'group',
        name: 'axisLabel',
        uiType: 'group',
        children: [
          {
            key: 'textStyle',
            valueType: 'group',
            name: 'textStyle',
            uiType: 'group',
            children: [
              {
                key: 'fontSize',
                value: 10,
                valueType: 'integer',
                name: 'fontSize',
                uiType: 'slider',
                validate: {
                  range: {
                    min: 0.5,
                    max: 42,
                  },
                  step: 1,
                },
              }, {
                key: 'color',
                value: '#666666',
                valueType: 'color',
                name: 'color',
                uiType: 'color',
                validate: {},
              },
            ],
          },
        ],
      }, {
        key: 'type',
        value: 'category',
        valueType: 'string',
        name: 'type',
        uiType: 'input',
        validate: {},
      }, {
        key: 'boundaryGap',
        value: false,
        name: 'boundaryGap',
        uiType: 'toggle',
        valueType: 'boolean',
        validate: {},
      },
    ],
  }, {
    key: 'yAxis',
    valueType: 'group',
    name: 'yAxis',
    uiType: 'group',
    children: [
      {
        key: 'axisLine',
        valueType: 'group',
        name: 'axisLine',
        uiType: 'group',
        children: [
          {
            key: 'show',
            value: false,
            name: 'show',
            uiType: 'toggle',
            valueType: 'boolean',
            validate: {},
          },
        ],
      }, {
        key: 'axisTick',
        valueType: 'group',
        name: 'axisTick',
        uiType: 'group',
        children: [
          {
            key: 'lineStyle',
            valueType: 'group',
            name: 'lineStyle',
            uiType: 'group',
            children: [
              {
                key: 'color',
                value: '#B0B0B0',
                valueType: 'color',
                name: 'color',
                uiType: 'color',
                validate: {},
              }, {
                key: 'width',
                value: 3,
                valueType: 'integer',
                name: 'width',
                uiType: 'slider',
                validate: {
                  range: {
                    min: -1.25,
                    max: 14,
                  },
                  step: 1,
                },
              },
            ],
          },
        ],
      }, {
        key: 'axisLabel',
        valueType: 'group',
        name: 'axisLabel',
        uiType: 'group',
        children: [
          {
            key: 'textStyle',
            valueType: 'group',
            name: 'textStyle',
            uiType: 'group',
            children: [
              {
                key: 'fontSize',
                value: 10,
                valueType: 'integer',
                name: 'fontSize',
                uiType: 'slider',
                validate: {
                  range: {
                    min: 0.5,
                    max: 42,
                  },
                  step: 1,
                },
              }, {
                key: 'color',
                value: '#666666',
                valueType: 'color',
                name: 'color',
                uiType: 'color',
                validate: {},
              },
            ],
          },
        ],
      }, {
        key: 'splitLine',
        valueType: 'group',
        name: 'splitLine',
        uiType: 'group',
        children: [
          {
            key: 'lineStyle',
            valueType: 'group',
            name: 'lineStyle',
            uiType: 'group',
            children: [
              {
                key: 'color',
                value: '#B0B0B0',
                valueType: 'color',
                name: 'color',
                uiType: 'color',
                validate: {},
              }, {
                key: 'type',
                value: 'dotted',
                valueType: 'string',
                name: 'type',
                uiType: 'input',
                validate: {},
              },
            ],
          },
        ],
      }, {
        key: 'type',
        value: 'value',
        valueType: 'string',
        name: 'type',
        uiType: 'input',
        validate: {},
      },
    ],
  },
];
