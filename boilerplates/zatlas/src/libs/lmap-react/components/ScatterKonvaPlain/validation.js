const validateTypes = require('./../../lib/validateTypes');
const { blending } = validateTypes;

module.exports = [{
  key: 'blending',
  name: '叠加模式',
  valueType: 'string',
  uiType: 'select',
  value: 'source-over',
  validate: {
    options: blending
  }
}, {
	key: 'size',
	value: 10,
	name: '半径',
	uiType: 'slider',
	valueType: 'float',
	validate: {
		range: {
			min: 1, 
			max: 20
		}
	}
}, {
	key: 'color',
	value: 'rgba(0, 200, 200, 0.3)',
	name: '颜色',
	uiType: 'color',
	valueType: 'color',
	validate: {
	}
}];