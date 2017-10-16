/*
 * @Author: zhouningyi
 * @Date: 2016-10-29 20:01:17
 */
import Filter  from 'lmap/plugins/filter/tilelayer';
import _       from 'lodash';
const defaultFilterOptions = Filter.options;

const config = {
	geoqwater: {
		name:  '水系地图',
		layer: 'GeoQWater',
		filter: {
			hueRotate: 0,
			saturate: 100,
			contrast: 100,
			brightness: 100,
			grayscale: 0,
			sepia: 0,
			invert: 0,
			anim: 1
		}
	},
	geoqrailway: {
		name:  '地铁地图',
		layer: 'GeoQRailway',
		filter: {
			hueRotate: 0,
			saturate: 100,
			contrast: 130,
			brightness: 80,
			grayscale: 60,
			sepia: 0,
			invert: 0,
			anim: 1,
			opacity: 0.8
		}
	},
	amapblue: {
		name:  '蓝色高德地图',
		layer: 'NormalAMap',
		filter: {
			hueRotate: 347,
			saturate: 144,
			contrast: 102,
			brightness: 96,
			grayscale: 0,
			sepia: 100,
			invert: 100,
			anim: 1
		}
	},
	amapwhite: {
		name:  '白色高德地图',
		layer: 'NormalAMap',
		filter: {
			hueRotate: 0,
			saturate: 100,
			contrast: 100,
			brightness: 100,
			grayscale: 100,
			sepia: 0,
			invert: 0,
			anim: 1
		}
	},
	//
	satellitetmap: {
		name:  '腾讯卫星地图',
		layer: 'SatelliteTMap',
		background: '#222',
		filter: {
			brightness: 50,
			saturate: 100,
			contrast: 120,
			invert: 0,
			anim: 1
		}
	},
	//
	satellitetmapblack: {
		name:  '腾讯卫星地图黑白',
		layer: 'SatelliteTMap',
		filter: {
			brightness: 50,
			saturate: 10,
			contrast: 120,
			invert: 0,
			anim: 1
		}
	}
};

//和默认配置做合并
_.forEach(config, cfg => {
	cfg.filter = Object.assign({}, defaultFilterOptions, cfg.filter);
});

export default config;
