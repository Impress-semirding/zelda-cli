import { api } from 'zelda-ast';
import upperCamelCase from 'simple-uppercamelcase';
import { basename, dirname, join } from 'path';
import { statSync, readFileSync } from 'fs';
import pathExists from 'path-exists';
import leftPad from 'left-pad';
import nanoid from 'nanoid/generate';
import chalk from 'chalk';

function info(type, message) {
  console.log(`${chalk.green.bold(leftPad(type, 8))}  ${message}`);
}

function error(message) {
  console.error(chalk.red(message));
}

function getBabelRc(cwd) {
  const rcPath = join(cwd, '.dvarc');
  if (pathExists.sync(rcPath)) {
    return JSON.parse(readFileSync(rcPath, 'utf-8'));
  } else {
    return {};
  }
}

function clearFeed(feeding) {
  const feed = {};
  Object.keys(feeding).forEach(k => {
    feed[k] = {};
  })
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
          api('models.create', {
            namespace: name,
            sourcePath: cwd,
            filePath,
            entry,
            modelPath,
            simple: !program.tpl,
            state: {},
          });
        })();
        break;
      case 'service':
        (() => {
          const filePath = `${base}/services/${name}.js`;
          info('create', `service ${name}`);
          api('services.create', {
            namespace: name,
            sourcePath: cwd,
            filePath,
          });
        })();
        break;
      case 'route':
        (() => {
          const componentName = upperCamelCase(name);
          const componentPath = `${base}/routes/${componentName}.js`;
          const componentCSSPath = `${base}/routes/${componentName}.css`;
          const withCSS = program.css ? `, ${componentCSSPath}` : '';
          info('create', `routeComponent ${componentPath}${withCSS}`);
          api('routeComponents.create', {
            sourcePath: cwd,
            filePath: componentPath,
            componentName,
            css: program.css,
          });
          info('create', `route ${name} with ${componentPath}`);
          api('router.createRoute', {
            filePath: program.router || defaultRouter,
            sourcePath: cwd,
            path: `/${name}`,
            component: {
              componentName,
              filePath: componentPath,
            },
          });
        })();
        break;
      case 'component':
        (() => {
          const fileName = basename(name);
          const fileDir = dirname(name);
          const componentName = upperCamelCase(fileName);
          const filePath = join(`${base}/components`, fileDir, `${componentName}.js`);
          const componentCSSPath = join(`${base}/components`, fileDir, `${componentName}.css`);
          const withCSS = program.css ? `, ${componentCSSPath}` : '';
          info('create', `component ${filePath}${withCSS}`);
          api('components.create', {
            sourcePath: cwd,
            filePath,
            componentName,
            css: program.css,
            state: program.state,
          });
        })();
        break;
      case 'zatlas':
        (() => {
          const config = name.data || name;
          const uuid = nanoid('1234567890abcdefghijklmnopqresuvwxyz', 4);
          const prefix = `Zatlas_${uuid}`;

          // zatlas model
          info('update', `zatlas model page`);
          api('models.addState', {
            namespace: 'page',
            sourcePath: cwd,
            filePath: `${base}/models/page.js`,
            name: prefix,
            source: JSON.stringify(`/${prefix}`),
          });

          info('update', `zatlas model grid`);
          api('models.addState', {
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
            }),
          });

          info('update', `zatlas model styles`);
          api('models.addState', {
            namespace: 'styles',
            sourcePath: cwd,
            filePath: `${base}/models/styles.js`,
            name: prefix,
            source: JSON.stringify(config.items),
          });

          info('update', `zatlas model options`);
          api('models.addState', {
            namespace: 'options',
            sourcePath: cwd,
            filePath: `${base}/models/options.js`,
            name: prefix,
            source: JSON.stringify({
              planes: config.planes,
              activePlane: undefined,
            }),
          });

          info('update', `zatlas model databinding`);
          api('models.addState', {
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
                fieldViewOpen: -1,
              },
              filterOption: null,
              expendItem: null,
              tableLoading: {},
              previewTableLoading: false,
              fieldLoading: false,
              chartsLoading: {}
            }),
          });

          const entry = program.entry || defaultEntry;

          const planeList = config.layout.map(t => ({
            key: t.i,
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
            api('zatlas.createComponent', {
              sourcePath: cwd,
              filePath: componentPath,
              componentName,
              cssPath: componentCSSPath,
            });

            info('create', `zatlas model ${componentName}`);
            info('register', `to entry ${entry}`);
            api('zatlas.createModel', {
              namespace: `${prefix}/${componentName}`,
              sourcePath: cwd,
              filePath: componentModelPath,
              modelPath,
              entry,
            });

            info('create', `zatlas service ${componentName}`);
            api('zatlas.createService', {
              name: componentName,
              sourcePath: cwd,
              filePath: componentServicePath,
            });
          });

          // zatlas route container
          const containerName = prefix;
          const containerPath = `${base}/routes/${containerName}.js`;
          const containerCSSPath = `${base}/routes/${containerName}.css`;
          info('create', `zatlas container ${containerPath}, ${containerCSSPath}`);
          api('zatlas.createContainer', {
            sourcePath: cwd,
            filePath: containerPath,
            componentName: containerName,
            cssPath: containerCSSPath,
            planeList,
          });

          // zatlas route in index
          info('create', `route ${containerName} with ${containerPath}`);
          api('router.createRoute', {
            filePath: program.router || defaultRouter,
            sourcePath: cwd,
            path: `/${containerName}`,
            component: {
              componentName: containerName,
              filePath: containerPath,
            },
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

export default generate;
