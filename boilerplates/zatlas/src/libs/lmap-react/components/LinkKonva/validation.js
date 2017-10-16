const validateTypes = require('./../../lib/validateTypes');

module.exports = [
{
	name: '高度',
	valueType: 'float',
	uiType: 'slider',
	value: 0.9,
	key: 'kHeight',
	validate: {
		range: {
			min: 0, 
			max: 2
		}
	}
},

{
	name: '宽度',
	valueType: 'float',
	uiType: 'slider',
	value: 2,
	key: 'weight',
	validate: {
		range: {
			min: 0, 
			max: 8
		}
	}
},

{
	name: '颜色',
	valueType: 'color',
	uiType: 'color',
	key: 'color',
	value: '#fff'
},


{
	name: '箭头',
	valueType: 'group',
	uiType: 'group',
	key: 'head',
	children: [{
		name: '比例',
		key: 'phiWeight',
		uiType: 'slider',
		valueType: 'float',
		value: 1,
		validate: {
			range: {
				min: 0, 
				max: 5
			}
		}
	}],
},

// {
// 	name: '形状',
// 	valueType: 'group',
// 	uiType: 'group',
// 	key: 'shape',
// 	children: [{
// 		name: '形状',
// 		value: 'hex',
// 		uiType: 'select',
// 		key: 'type',
// 		valueType: 'string',
// 		validate: {
// 			options: {
// 				'六边形': 'hex',
// 				'四边形': 'rect'
// 			}
// 		}
// 	}, {
// 		name: '高度',
// 		value: 9,
// 		valueType: 'float',
// 		uiType: 'slider',
// 		key: 'ry',
// 		validate: {
// 			range: {
// 				min: 3,
// 				max: 40
// 			}
// 		}
// 	}, {
// 		name: '宽度',
// 		value: 10,
// 		valueType: 'float',
// 		uiType: 'slider',
// 		key: 'rx',
// 		validate: {
// 			range: {
// 				min: 3,
// 				max: 40
// 			}
// 		}
// 	}]
// }

];