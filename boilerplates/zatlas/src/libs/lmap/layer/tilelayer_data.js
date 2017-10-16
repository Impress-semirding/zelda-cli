/**
 * amapAttribution 地图的版权表识
 */
var amapAttribution = '&copy; <a href="//www.amap.com/">高德地图</a>';

var tmapAttribution = '&copy; <a href="//map.qq.com/">腾讯地图</a>';

var stamenAttribution = 'Map tiles by <a href="//stamen.com">Stamen Design</a>, ' +
  '<a href="//creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; ' +
  'Map data {attribution.OpenStreetMap}';

/**
 * atlasVariants atlas地图的一些取值意义
 */


var atlasVariants = {
  road: {
    name: '道路',
    ename: 'road',
    value: 4
  },
  roadLabel: {
    name: '道路标注',
    ename: 'roadLabel',
    value: 2
  },
  region: {
    name: '区域',
    ename: 'region',
    value: 8
  },
  poi: {
    name: '道路',
    ename: 'poi',
    value: 2
  }
};

// var statmen

/**
 * 各类地图及参数
 */
module.exports = {
  // 'AtlasLight': {
  //   'url': '//42.120.180.211:8080/mapservice?t=1&c={variant}&x={x}&y={y}&z={z}&size=1&v=light',
  //   'options': {
  //     'attribution': amapAttribution,
  //     'minZoom': 2,
  //     'maxZoom': 15,
  //     'variant': 'road',
  //     'name': 'Atlas白(高德)'
  //   },
  //   'variants': atlasVariants
  // },
  // 'AtlasDark': {
  //   'url': '//42.120.180.211:8080/mapservice?t=1&c={variant}&x={x}&y={y}&z={z}&size=1&v=dark',
  //   'options': {
  //     'attribution': amapAttribution,
  //     'minZoom': 2,
  //     'maxZoom': 15,
  //     'variant': 'road',
  //     'name': 'Atlas深灰(高德)'
  //   },
  //   'variants': atlasVariants
  // },
  // 'AtlasBlue': {
  //   'url': '//42.120.180.211:8080/mapservice?t=1&c={variant}&x={x}&y={y}&z={z}&size=1&v=blue',
  //   'options': {
  //     'attribution': amapAttribution,
  //     'minZoom': 2,
  //     'maxZoom': 15,
  //     'variant': 'road',
  //     'name': 'Atlas蓝(高德)'
  //   },
  //   'variants': atlasVariants
  // },
  'SatelliteAMap': {
    'url': '//webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
    'options': {
      'attribution': amapAttribution,
      'minZoom': 2,
      'maxZoom': 18,
      'name': '卫星(高德)'
    }
  },
  'SatelliteTMap':{
    'url': function(x, y, z) {
      y = Math.pow(2, z) - y - 1;
      return 'http://p' + Math.floor(Math.random() * 4) + '.map.gtimg.com/sateTiles/' + 
      z + '/' + 
      Math.floor(x / 16) + '/' + 
      Math.floor(y / 16) + '/' + 
      x + '_' + y + 
      '.jpg';
    },
    'options': {
      'attribution': tmapAttribution,
      'minZoom': 2,
      'maxZoom': 18,
      'name': '卫星(腾讯)'
    }
  },
  'SatelliteGoogle': {
    'url': '//mt3.google.cn/vt/lyrs=s&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}',
    'options': {
      'attribution': amapAttribution,
      'minZoom': 2,
      'maxZoom': 18,
      'name': '卫星(谷歌)'
    }
  },
  'TMapTerrain': {
    'url': function(x, y, z) {
      y = Math.pow(2, z) - y - 1;
      return '//p' + Math.floor(Math.random() * 4) + '.map.gtimg.com/demTiles/' + 
      z + '/' + 
      Math.floor(x / 16) + '/' + 
      Math.floor(y / 16) + '/' + 
      x + '_' + y + 
      '.jpg';
    },
    'options': {
      'attribution': tmapAttribution,
      'minZoom': 2,
      'maxZoom': 18,
      'name': '地形(腾讯)'
    }
  },
  'TianDiMap': {
    'url': '//t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}',
    'options': {
      'minZoom': 2,
      'maxZoom': 18,
      'name': '天地图'
    }
  },
  'SatelliteEsri': {
    'url': '//server.arcgisonline.com/arcgis/rest/services/world_imagery/mapserver/tile/{z}/{y}/{x}',
    'options': {
      'attribution': '&copy; <a href="//maps.esri.com/">esri</a>',
      'minZoom': 0,
      'maxZoom': 20,
      'name': '卫星(esri)'
    }
  },
  'TMapRoad': {
    'url': function(x, y, z){
      x = x.toString(), y = y.toString(), z = z.toString();
      return '//rtt2.map.qq.com/live/' + 
      z + '/' + 
      x.substring(0, x.length - 1) + '/' + 
      y.substring(0, y.length - 1) + '/' + 
      x + '_' + y + 
      '.png?timeKey=' + Date.now().toString().substring(0, Date.now().toString().length - 4);
    },
    'options': {
      'attribution': tmapAttribution,
      'minZoom': 2,
      'maxZoom': 18,
      'name': '路网(腾讯)'
    }
  },

  'NormalAMap1': {
    'url': '//webrd03.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}',
    'options': {
      'attribution': amapAttribution,
      'minZoom': 2,
      'maxZoom': 18,
      'name': '简单(高德)'
    }
  },

  'NormalAMap': {
    'url': '//webrd03.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
    'options': {
      'attribution': amapAttribution,
      'minZoom': 2,
      'maxZoom': 18,
      'name': '普通(高德)'
    }
  },
  'GeoQBlue': {
    'url': '//map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
    'options': {
      'attribution': '&copy; <a href="./">geoq</a>',
      'minZoom': 0,
      'maxZoom': 20,
      'name': '蓝色(geoQ)'
    }
  },
  'GeoQGray': {
    'url': '//map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}',
    'options': {
      'attribution': '&copy; <a href="./">geoq</a>',
      'minZoom': 0,
      'maxZoom': 20,
      'name': '灰色(geoQ)'
    }
  },
  'GeoQBound': {
    'url': '//thematic.geoq.cn/arcgis/rest/services/ThematicMaps/administrative_division_boundaryandlabel/MapServer/tile/{z}/{y}/{x}',
    'options': {
      'attribution': '&copy; <a href="./">geoq</a>',
      'minZoom': 0,
      'maxZoom': 20,
      'name': '边界(geoQ)'
    }
  },
  'GeoQBoundOnly': {
    'url': 'http://30.9.160.123:8887/v2/tiles/{z}/{x}/{y}.pbf',
    // '//thematic.geoq.cn/arcgis/rest/services/ThematicMaps/administrative_division_boundary/MapServer/tile/{z}/{y}/{x}',
    'options': {
      'attribution': '&copy; <a href="./">geoq</a>',
      'minZoom': 0,
      'maxZoom': 20,
      'name': '仅边界(geoQ)'
    }
  },
  'GeoQWater': {
    'url': '//thematic.geoq.cn/arcgis/rest/services/ThematicMaps/WorldHydroMap/MapServer/tile/{z}/{y}/{x}',
    'options': {
      'attribution': '&copy; <a href="./">geoq</a>',
      'minZoom': 0,
      'maxZoom': 20,
      'name': '水系(geoQ)'
    }
  },
  'GeoQRailway': {
    'url': '//thematic.geoq.cn/arcgis/rest/services/ThematicMaps/subway/MapServer/tile/{z}/{y}/{x}',
    'options': {
      'attribution': '&copy; <a href="./">geoq</a>',
      'minZoom': 0,
      'maxZoom': 20,
      'name': '地铁(geoQ)'
    }
  },
  'OpenStreetMap': {
    'disable': true,//太丑了 不显示
    'url': '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    'options': {
      'attribution': '&copy; <a href="//www.openstreetmap.org/copyright">OpenStreetMap</a>',
      'name': 'OSM'
    },
    'variants': {
      'Mapnik': {},
      'BlackAndWhite': {
        'url': '//{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
      },
      'DE': {
        'url': '//{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
      },
      'HOT': {
        'url': '//{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        'options': {
          'attribution': '{attribution.OpenStreetMap}, Tiles courtesy of <a href="//hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
        }
      }
    }
  },
  'StamenToner': {
    'url': '//{s}.tile.stamen.com/toner/{z}/{x}/{y}.png',
    'options': {
      'attribution': stamenAttribution,
      'subdomains': 'abcd',
      'minZoom': 0,
      'maxZoom': 20,
      'name': '木刻(stamen)'
    }
  },
  'StamenWaterColor': {
    'url': '//{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png',
    'options': {
      'attribution': stamenAttribution,
      'subdomains': 'abcd',
      'minZoom': 1,
      'maxZoom': 16,
      'name': '水彩(stamen)'
    }
  },
  'OpenTopoMap': {
    'url': '//{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    'options': {
      'attribution': '&copy; <a href="//opentopomap.org/">opentopomap</a>',
      'subdomains': 'abcd',
      'minZoom': 0,
      'maxZoom': 20,
      'name': '高程(OTM)',
      'desc': '免费地图，数据来自OpenStreetMap和SRTM高程数据'
    }
  },
};