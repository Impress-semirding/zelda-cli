const validateTypes = require('./../../lib/validateTypes');

module.exports = [{
	name: '形状',
	valueType: 'group',
	uiType: 'group',
	key: 'shape',
	children: [{
		name: '形状',
		value: 'hex',
		uiType: 'select',
		key: 'type',
		valueType: 'string',
		validate: {
			options: {
				'六边形': 'hex',
				'四边形': 'rect'
			}
		}
	}, {
		name: '高度',
		value: 9,
		valueType: 'float',
		uiType: 'slider',
		key: 'ry',
		validate: {
			range: {
				min: 3,
				max: 40
			}
		}
	}, {
		name: '宽度',
		value: 10,
		valueType: 'float',
		uiType: 'slider',
		key: 'rx',
		validate: {
			range: {
				min: 3,
				max: 40
			}
		}
	}]
}];