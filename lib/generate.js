'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _zeldaAst = require('zelda-ast');

var _simpleUppercamelcase = require('simple-uppercamelcase');

var _simpleUppercamelcase2 = _interopRequireDefault(_simpleUppercamelcase);

var _path = require('path');

var _fs = require('fs');

var _pathExists = require('path-exists');

var _pathExists2 = _interopRequireDefault(_pathExists);

var _leftPad = require('left-pad');

var _leftPad2 = _interopRequireDefault(_leftPad);

var _generate = require('nanoid/generate');

var _generate2 = _interopRequireDefault(_generate);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function info(type, message) {
  console.log(`${_chalk2.default.green.bold((0, _leftPad2.default)(type, 8))}  ${message}`);
}

function error(message) {
  console.error(_chalk2.default.red(message));
}

function getBabelRc(cwd) {
  const rcPath = (0, _path.join)(cwd, '.dvarc');
  if (_pathExists2.default.sync(rcPath)) {
    return JSON.parse((0, _fs.readFileSync)(rcPath, 'utf-8'));
  } else {
    return {};
  }
}

function clearFeed(feeding) {
  const feed = {};
  Object.keys(feeding).forEach(k => {
    feed[k] = {};
  });
  return feed;
}

function generate(program, { cwd }) {
  const defaultBase = 'src';
  const rc = getBabelRc(cwd);
  const base = program.base || rc.base || defaultBase;
  const defaultEntry = `${base}/index.js`;
  const defaultRouter = `${base}/router.js`;

  const [type, name] = program.args;

  try {
    switch (type) {
      case 'model':
        (() => {
          const modelPath = `./models/${name}`;
          const filePath = `${base}/models/${name}.js`;
          const entry = program.entry || defaultEntry;
          info('create', `model ${name}`);
          info('register', `to entry ${entry}`);
          (0, _zeldaAst.api)('models.create', {
            namespace: name,
            sourcePath: cwd,
            filePath,
            entry,
            modelPath,
            simple: !program.tpl,
            state: {}
          });
        })();
        break;
      case 'service':
        (() => {
          const filePath = `${base}/services/${name}.js`;
          info('create', `service ${name}`);
          (0, _zeldaAst.api)('services.create', {
            namespace: name,
            sourcePath: cwd,
            filePath
          });
        })();
        break;
      case 'route':
        (() => {
          const componentName = (0, _simpleUppercamelcase2.default)(name);
          const componentPath = `${base}/routes/${componentName}.js`;
          const componentCSSPath = `${base}/routes/${componentName}.css`;
          const withCSS = program.css ? `, ${componentCSSPath}` : '';
          info('create', `routeComponent ${componentPath}${withCSS}`);
          (0, _zeldaAst.api)('routeComponents.create', {
            sourcePath: cwd,
            filePath: componentPath,
            componentName,
            css: program.css
          });
          info('create', `route ${name} with ${componentPath}`);
          (0, _zeldaAst.api)('router.createRoute', {
            filePath: program.router || defaultRouter,
            sourcePath: cwd,
            path: `/${name}`,
            component: {
              componentName,
              filePath: componentPath
            }
          });
        })();
        break;
      case 'component':
        (() => {
          const fileName = (0, _path.basename)(name);
          const fileDir = (0, _path.dirname)(name);
          const componentName = (0, _simpleUppercamelcase2.default)(fileName);
          const filePath = (0, _path.join)(`${base}/components`, fileDir, `${componentName}.js`);
          const componentCSSPath = (0, _path.join)(`${base}/components`, fileDir, `${componentName}.css`);
          const withCSS = program.css ? `, ${componentCSSPath}` : '';
          info('create', `component ${filePath}${withCSS}`);
          (0, _zeldaAst.api)('components.create', {
            sourcePath: cwd,
            filePath,
            componentName,
            css: program.css,
            state: program.state
          });
        })();
        break;
      case 'zatlas':
        (() => {
          const config = name.data || name;
          const uuid = (0, _generate2.default)('1234567890abcdefghijklmnopqresuvwxyz', 4);
          const prefix = `Zatlas_${uuid}`;

          // zatlas model
          info('update', `zatlas model page`);
          (0, _zeldaAst.api)('models.addState', {
            namespace: 'page',
            sourcePath: cwd,
            filePath: `${base}/models/page.js`,
            name: prefix,
            source: JSON.stringify(`/${prefix}`)
          });

          info('update', `zatlas model grid`);
          (0, _zeldaAst.api)('models.addState', {
            namespace: 'grid',
            sourcePath: cwd,
            filePath: `${base}/models/grid.js`,
            name: prefix,
            source: JSON.stringify({
              layout: config.layout,
              margin: 10,
              maxHeight: 900,
              maxWidth: 1440,
              row: 40,
              column: 40,
              transform: {
                scale: 1,
                originX: 0,
                originY: 0,
                translateX: 0,
                translateY: 0
              },
              chartPreview: null
            })
          });

          info('update', `zatlas model styles`);
          (0, _zeldaAst.api)('models.addState', {
            namespace: 'styles',
            sourcePath: cwd,
            filePath: `${base}/models/styles.js`,
            name: prefix,
            source: JSON.stringify(config.items)
          });

          info('update', `zatlas model options`);
          (0, _zeldaAst.api)('models.addState', {
            namespace: 'options',
            sourcePath: cwd,
            filePath: `${base}/models/options.js`,
            name: prefix,
            source: JSON.stringify({
              planes: config.planes,
              activePlane: undefined
            })
          });

          info('update', `zatlas model databinding`);
          (0, _zeldaAst.api)('models.addState', {
            namespace: 'databinding',
            sourcePath: cwd,
            filePath: `${base}/models/databinding.js`,
            name: prefix,
            source: JSON.stringify({
              table: {},
              selectedtable: config.selectedtable,
              feeding: clearFeed(config.feeding),
              filter: config.filter,
              existData: config.existData,
              pageDataSource: config.pageDataSource,
              api: config.api,
              dbconfig: {
                username: 'zazzz',
                password: 'zazzz',
                database: 'zzz',
                host: '192.168.26.124',
                port: 5423,
                dialect: 'postgres'
              },
              preview: [],
              dbFields: [],
              viewOpen: {
                tableViewOpen: 1,
                fieldViewOpen: -1
              },
              filterOption: null,
              expendItem: null,
              tableLoading: {},
              previewTableLoading: false,
              fieldLoading: false,
              chartsLoading: {}
            })
          });

          const entry = program.entry || defaultEntry;

          const planeList = config.layout.map(t => ({
            key: t.i
          }));

          // zatlas component
          planeList.forEach(t => {
            const key = t.key;
            const plane = config.planes[key];
            const componentName = `${plane.component.type}_${key}`;
            const componentPath = `${base}/components/${prefix}/${componentName}.js`;
            const componentCSSPath = `${base}/components/${prefix}/${componentName}.css`;
            const componentModelPath = `${base}/models/${prefix}/${componentName}.js`;
            const modelPath = `models/${prefix}/${componentName}`;
            const componentServicePath = `${base}/services/${prefix}/${componentName}.js`;
            t.componentName = componentName;

            info('create', `zatlas component ${componentPath}, ${componentCSSPath}`);
            (0, _zeldaAst.api)('zatlas.createComponent', {
              sourcePath: cwd,
              filePath: componentPath,
              componentName,
              cssPath: componentCSSPath
            });

            info('create', `zatlas model ${componentName}`);
            info('register', `to entry ${entry}`);
            (0, _zeldaAst.api)('zatlas.createModel', {
              namespace: `${prefix}/${componentName}`,
              sourcePath: cwd,
              filePath: componentModelPath,
              modelPath,
              entry
            });

            info('create', `zatlas service ${componentName}`);
            (0, _zeldaAst.api)('zatlas.createService', {
              name: componentName,
              sourcePath: cwd,
              filePath: componentServicePath
            });
          });

          // zatlas route container
          const containerName = prefix;
          const containerPath = `${base}/routes/${containerName}.js`;
          const containerCSSPath = `${base}/routes/${containerName}.css`;
          info('create', `zatlas container ${containerPath}, ${containerCSSPath}`);
          (0, _zeldaAst.api)('zatlas.createContainer', {
            sourcePath: cwd,
            filePath: containerPath,
            componentName: containerName,
            cssPath: containerCSSPath,
            planeList
          });

          // zatlas route in index
          info('create', `route ${containerName} with ${containerPath}`);
          (0, _zeldaAst.api)('router.createRoute', {
            filePath: program.router || defaultRouter,
            sourcePath: cwd,
            path: `/${containerName}`,
            component: {
              componentName: containerName,
              filePath: containerPath
            }
          });
        })();
        break;
      default:
        error(`ERROR: uncaught type ${type}`);
        process.exit(1);
        break;
    }
  } catch (e) {
    error(e.stack);
    process.exit(1);
  }
}

exports.default = generate;
module.exports = exports['default'];