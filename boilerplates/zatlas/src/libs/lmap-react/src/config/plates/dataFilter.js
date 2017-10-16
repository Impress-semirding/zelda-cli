
import {createSliderRange} from './../../utils/validate';

export default [{
  "key": "house_lianjia_plate_data",
  "name": "链家版块二手房数据",
  "uiType": "group",
  "valueType": "group",
  "children": [
    createSliderRange({
      key: 'avg_price',
      name: '平均单价',
      min: [1000,   0, 200000],
      max: [140000, 0, 200000]
    }),
    createSliderRange({
      key: 'avg_price_total',
      name: '平均总价',
      min: [10000 * 0,    0, 10000 * 6000],
      max: [10000 * 3000, 0, 10000 * 6000]
    }),
    createSliderRange({
      key: 'age',
      name: '平均房龄',
      min: [0,  0, 100],
      max: [99, 0, 100]
    })
   ]
  }];
