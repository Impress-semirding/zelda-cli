'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _path = require('path');

var _vinylFs = require('vinyl-fs');

var _vinylFs2 = _interopRequireDefault(_vinylFs);

var _fs = require('fs');

var _fsExtra = require('fs-extra');

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _emptyDir = require('empty-dir');

var _leftPad = require('left-pad');

var _leftPad2 = _interopRequireDefault(_leftPad);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

var _loadJsonFile = require('load-json-file');

var _loadJsonFile2 = _interopRequireDefault(_loadJsonFile);

var _generate = require('./generate');

var _generate2 = _interopRequireDefault(_generate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function info(type, message) {
  console.log(`${_chalk2.default.green.bold((0, _leftPad2.default)(type, 8))}  ${message}`);
}

function error(message) {
  console.error(_chalk2.default.red(message));
}

function success(message) {
  console.error(_chalk2.default.green(message));
}

function link(program) {
  let cfg = program.config;
  let cfgFile;

  if (cfg && typeof cfg === 'string') {
    cfgFile = cfg;
  } else if (!cfg) {
    cfgFile = program.args[0];
  }

  if (cfgFile) {
    if (!(0, _fs.existsSync)(cfgFile)) {
      error('config file missing, please check the config file!');
      process.exit(1);
    }

    try {
      cfg = _loadJsonFile2.default.sync(cfgFile);
    } catch (e) {
      error(e.message);
      process.exit(1);
    }
  }

  const cwd = (0, _path.join)(__dirname, '../boilerplates/zatlas');
  const dest = program.dest || process.cwd();
  const projectName = (0, _path.basename)(dest);

  if (program.merge) {
    console.log(`Merging a Zatlas config in ${dest}.`);
    console.log();
    processCfg();
  } else {
    if (!(0, _fs.existsSync)(dest)) {
      (0, _fsExtra.mkdirpSync)(dest);
    }

    console.log(`Creating a new Zatlas app in ${dest}.`);
    console.log();

    _del2.default.sync([`${dest}/**`, `!${dest}`, `!${dest}/${cfgFile}`, `!${dest}/node_modules`, `!${dest}/node_modules/**`]);

    _vinylFs2.default.src(['**/*', '!node_modules/**/*', '!**/.DS_Store'], { cwd: cwd, cwdbase: true, dot: true }).pipe(template(dest, cwd)).pipe(_vinylFs2.default.dest(dest)).on('end', function () {
      ['gitignore', 'editorconfig', 'eslintrc.js', 'eslintignore', 'roadhogrc.js'].forEach(f => cpDotFiles(f, dest));

      processCfg();

      if (program.install) {
        info('run', 'npm install');
        require('./install')(dest, printSuccess);
      } else {
        printSuccess();
      }
    }).resume();
  }

  function processCfg() {
    // create zatlas
    (0, _generate2.default)(_extends({}, program, {
      args: ['zatlas', cfg]
    }), {
      cwd: dest
    });
  }

  function printSuccess() {
    success(`
Success! Created ${projectName} at ${dest}.

Inside that directory, you can run several commands:

  * npm start: Starts the development server.
  * npm run build: Bundles the app into dist for production.

We suggest that you begin by typing:

  cd ${dest}
  ${program.install ? '' : 'npm install'}
  npm start

Happy hacking!`);
  }
}

function template(dest, cwd) {
  return _through2.default.obj(function (file, enc, cb) {
    if (!file.stat.isFile()) {
      return cb();
    }

    info('create', file.path.replace(cwd + '/', ''));
    this.push(file);
    cb();
  });
}

function cpDotFiles(name, dest) {
  info('rename', `${name} -> .${name}`);
  (0, _fs.renameSync)((0, _path.join)(dest, name), (0, _path.join)(dest, `.${name}`));
}

exports.default = link;
module.exports = exports['default'];