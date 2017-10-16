const validateTypes = require('./../../lib/validateTypes');
const { blending } = validateTypes;

module.exports = [
{
	uiType: 'slider',
	valueType: 'float',
	name: '点大小',
	value: 5,
	key: 'size',
	validate: {
		range: {
			min: 0.1,
			max: 20
		}
	}
},
{
  key: 'blending',
  name: '叠加模式',
  valueType: 'string',
  uiType: 'select',
  value: 'lighter',
  validate: {
    options: blending
  }
}, {
	key: 'sprite',
	uiType: 'group',
	valueType: 'group',
	name: '点形态',
	children: [
	  {
	  	uiType: 'slider',
	  	valueType: 'float',
	  	name: '环数',
	  	key: 'drawN',
	  	value: 1.3,
	  	validate: {
	  		range: {
	  			min: 0.1,
	  			max: 50
	  		}
	  	}
	  },
	  {
	  	key: 'color',
	    uiType: 'group',
	    valueType: 'group',
	    name: '颜色',
	    children: [
	      {
	      	key: 'from',
	      	value: 'rgba(245,230,0,1)',
	      	valueType: 'color',
	      	uiType: 'color',
	      	name: '内圈颜色'
	      },
	      {
	      	key: 'to',
	      	value: 'rgba(205, 0, 0, 0.6)',
	      	valueType: 'color',
	      	uiType: 'color',
	      	name: '外圈颜色'
	      }
	    ]
	  }
	]
}];

