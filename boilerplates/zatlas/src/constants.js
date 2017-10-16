import chartMap from './charts/chartMap';
import graphMap from './charts/graphMap';
import mapMap from './charts/mapMap';
import textMap from './charts/textMap';

export const JAVA_SERVER = '/za-resource';

function getHost() {
  switch (process.env.ZATLAS_ENV) {
    case 'electron':
    case 'dev':
      return 'http://localhost:8000';
    case 'online':
      return JAVA_SERVER;
    case 'online_dev':
      return 'http://11569-labs-zatlas-eul.test.za-tech.net';
    default:
      return 'http://11569-labs-zatlas-eul.test.za-tech.net';
  }
}

export const datahost = process.env.ZATLAS_ENV !== 'online' && process.env.ZATLAS_ENV !== 'online_dev' ? 'http://localhost:8000' : 'http://11569-labs-zatlas-eul.test.za-tech.net';
export const host = getHost();
export const host2 = 'http://192.168.26.124:8099'; // hive host
export const prefix = '/api';
export const prefix2 = '/postgres';
export const prefix3 = '/mysql';
export const prefix4 = '/mordor';
export const hive = process.env.ZATLAS_ENV === 'dev' ? 'http://localhost:8001/roshan' : 'http://11569-labs-zatlas-eul.test.za-tech.net/roshan';

export const TIMEOUT = 30000;

export const ONLINE_URL = 'http://11561-labs-zatlas-zazatlasweb.test.za-tech.net';

export const POLLINGTIME = [
  { name: '无', ts: 0, value: 'none' },
  { name: '30秒', ts: 30000, value: '30s' },
  { name: '1分钟', ts: 60000, value: '1m' },
  { name: '5分钟', ts: 300000, value: '5m' },
  { name: '10分钟', ts: 600000, value: '10m' },
  { name: '30分钟', ts: 1800000, value: '30m' },
  { name: '1小时', ts: 3600000, value: '1h' },
  { name: '1天', ts: 86400000, value: '1d' },
];

export const chartComponents = {
  chart: chartMap,
  map: mapMap,
  text: textMap,
  graph: graphMap,
  com: {},
};

export const sampleDatasource = {
  MySQL: {
    dbname: 'mockSql',
    username: 'root',
    password: 'xingqisan',
    database: 'iyb_roshan',
    host: '192.168.26.123',
    port: '3306',
    dialect: 'mysql',
  },
  PostgreSQL: {
    dbname: 'mockPostgres',
    username: 'zazzz',
    password: 'zazzz',
    database: 'zzz',
    host: '192.168.26.124',
    port: '5423',
    dialect: 'postgres',
  },
  Hive: {
    dbname: 'mockHive',
    database: 'default',
    host: '192.168.26.124',
    port: '8099',
  },
};

export const datasource = [{
  type: '数据库',
  children: ['PostgreSQL', 'Hive', 'MySQL', 'ES'], // ['Excel', 'CSV', 'PostgreSQL'],
}];

export const GRID_UPDATE_LAYOUT = 'grid/layout/update';
export const GRID_UPDATE_WIDTH = 'grid/layout/width';
export const GRID_UPDATE_HEIGHT = 'grid/layout/height';
export const GRID_UPDATE_SCALE = 'grid/layout/scale';
export const GRID_APPEND_CHART_WITHKEY = 'grid/plane/addpendchart';

export const PLANE_SET_ACTIVE = 'plane/setactive';
export const PLANE_UPDATE_PROPS = 'plane/updateprops';
export const PLANE_APPEND_CHART_WITHKEY = 'plane/chart/append';

export const STYLE_UPDATE_ITEM = 'style/item/update';
export const STYLE_APPEND_ITEM_WITHKEY = 'style/item/append';

export const APPEND_CHART = 'chart/append';

export const SAVE_TABLE_DATA = 'databinding/saveTableData';
export const SET_SELECTED_TABLE = 'databinding/setSelectedTable';
export const FETCH_DB_FEILDS = 'databinding/query/fields';
export const CHANGE_FEEDING = 'databinding/feeding/change';
export const CHANGE_FILTER = 'databinding/filter/change';
export const SET_VIEW_STATE = 'databinding/setViewOpenState';
export const ADD_PAGE_DATA_SOURCE = 'databinding/add/pageDataSource';
export const CONNECT_DB = 'databinding/query/db';

export const ADD_PROJECT = 'project/addproject';
export const ADD_PAGE = 'project/addpage';
export const EDIT_PROJECT = 'project/edit_project';
export const REMOVE_PROJECT = 'project/remove_project';
export const EDIT_PAGE = 'project/edit_page';
export const REMOVE_PAGE = 'project/remove_page';

export const ADD_DATA_SOURCE = 'datasource/add/source';
export const SEARCH_DATA_SOURCE = 'datasource/searchSource';
export const SAVE_DATA_SOURCE = 'datasource/save/datasource';
