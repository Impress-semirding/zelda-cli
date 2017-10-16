import dataFilter from './dataFilter';
import tileLayerV from './../../../components/tileLayer/validation';
import areasV     from './../../../components/areas/validation';
import validationTypes from './../../../lib/validateTypes';

// import tileLayerV from 'lmap-react/components/tileLayer/validation';
// import areasV     from 'lmap-react/components/areas/validation';
// import validationTypes from 'lmap-react/lib/validateTypes';

const selection = {
  '单价(平均)': 'avg_price',
  '总价(平均)': 'avg_price_total',
  '单价(中位)': 'median_price',
  '总价(中位)': 'median_price_total',
  '销售(总量)': 'total_count',
  '总看房(7日内)': 'view_7_days',
  '看房(总量)': 'views',
  '面积(平均)': 'avg_area',
  '面积(总量)': 'total_area',
  '七日带看 / 单房': 'view_7_days_per_house',
  '总带看  /  单房': 'views_per_house',
  '小区(总量)': 'community_count',
  '户数(总量)': 'house_count',
  '出售率': 'sell_ratio',
  '房屋密度(户数/km2)': 'house_count_per_square',
  '房龄': 'age'
};

export default {
  com: 'map',
  mainDataId: 'house_lianjia_plate_data',
  options: [],
  data: {},
  children: [
    {
      com: 'tileLayer',
      options: tileLayerV
    },
    //点图
    {
      com: 'areas',
      datas: {
        geojson: {
          id: 'house_lianjia_plate',
        },
        data: {
          id: 'house_lianjia_plate_data'
        }
      },
      options: [{
          name: 'geoid',
          value: 'plate_id',
          uiType: 'hidden',
          key: 'geoid',
          valueType: 'string',
        },

        {
          name: 'popup',
          value: {
            区域: 'district_name',
            版块: 'name',
            房龄: 'age',
            小区数: 'community_count',
            户数: 'house_count',
            均价: 'avg_price',
            中位价: 'median_price'
          },
          uiType: 'hidden',
          valueType: 'object',
          key: 'popup'
        },

        {
          name: 'id',
          value: 'plate_id',
          uiType: 'hidden',
          key: 'id',
          valueType: 'string',
        },

        {
          name: '选择字段',
          valueType: 'string',
          uiType: 'select',
          value: 'avg_price',
          key: 'value',
          validate: {
            options: selection
          }
        },

        {
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
                  min: 'rgba(0,230,250,0.1)',
                  max: 'rgba(230,150,0,0.9)'
                }
              }
            },

            {
              name: '边线颜色',
              valueType: 'color',
              uiType: 'color',
              key: 'color',
              value: 'rgba(255,255,255,0.6)'
            },

            {
              name: '边线粗细',
              valueType: 'float',
              uiType: 'slider',
              key: 'weight',
              value: 1.3,
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
              value: '5 5',
              validate: {
                options: validationTypes.dashArray
              }
            },
          ]
        }
      ]
    }
  ]
};
