import { join, basename } from 'path';
import vfs from 'vinyl-fs';
import { renameSync, existsSync } from 'fs';
import { mkdirpSync } from 'fs-extra';
import through from 'through2';
import { sync as emptyDir } from 'empty-dir';
import leftPad from 'left-pad';
import chalk from 'chalk';
import del from 'del';
import loadJsonFile from 'load-json-file';
import generate from './generate';

function info(type, message) {
  console.log(`${chalk.green.bold(leftPad(type, 8))}  ${message}`);
}

function error(message) {
  console.error(chalk.red(message));
}

function success(message) {
  console.error(chalk.green(message));
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
    if (!existsSync(cfgFile)) {
      error('config file missing, please check the config file!');
      process.exit(1);
    }

    try {
      cfg = loadJsonFile.sync(cfgFile);
    } catch (e) {
      error(e.message);
      process.exit(1);
    }
  }

  const cwd = join(__dirname, '../boilerplates/zatlas');
  const dest = program.dest || process.cwd();
  const projectName = basename(dest);

  if (program.merge) {
    console.log(`Merging a Zatlas config in ${dest}.`);
    console.log();
    processCfg();
  } else {
    if (!existsSync(dest)) {
      mkdirpSync(dest);
    }

    console.log(`Creating a new Zatlas app in ${dest}.`);
    console.log();

    del.sync([`${dest}/**`, `!${dest}`, `!${dest}/${cfgFile}`, `!${dest}/node_modules`, `!${dest}/node_modules/**`]);

    vfs.src(['**/*', '!node_modules/**/*', '!**/.DS_Store'], {cwd: cwd, cwdbase: true, dot: true})
      .pipe(template(dest, cwd))
      .pipe(vfs.dest(dest))
      .on('end', function() {
        [
          'gitignore',
          'editorconfig',
          'eslintrc.js',
          'eslintignore',
          'roadhogrc.js'
        ].forEach(f => cpDotFiles(f, dest));

        processCfg();

        if (program.install) {
          info('run', 'npm install');
          require('./install')(dest, printSuccess);
        } else {
          printSuccess();
        }
      })
      .resume();
  }

  function processCfg() {
    // create zatlas
    generate({
      ...program,
      args: ['zatlas', cfg]
    }, {
      cwd: dest,
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
  return through.obj(function (file, enc, cb) {
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
  renameSync(join(dest, name), join(dest, `.${name}`));
}

export default link;
