import { join, basename } from 'path';
import vfs from 'vinyl-fs';
import { renameSync, existsSync } from 'fs';
import { mkdirpSync } from 'fs-extra';
import through from 'through2';
import { sync as emptyDir } from 'empty-dir';
import leftPad from 'left-pad';
import chalk from 'chalk';

function info(type, message) {
  console.log(`${chalk.green.bold(leftPad(type, 8))}  ${message}`);
}

function error(message) {
  console.error(chalk.red(message));
}

function success(message) {
  console.error(chalk.green(message));
}

function init(program) {
  const cwd = join(__dirname, '../boilerplates/app');
  const dest = program.dest || process.cwd();
  const projectName = basename(dest);

  if (!existsSync(dest)) {
    mkdirpSync(dest);
  }

  if (!emptyDir(dest)) {
    error('Existing files here, please run init command in an empty folder!');
    process.exit(1);
  }

  console.log(`Creating a new Zelda app in ${dest}.`);
  console.log();

  vfs.src(['**/*', '!node_modules/**/*', '!**/.DS_Store'], {cwd: cwd, cwdbase: true, dot: true})
    .pipe(template(dest, cwd))
    .pipe(vfs.dest(dest))
    .on('end', function() {
      [
        'gitignore',
        'editorconfig',
        'eslintrc.js',
        'roadhogrc.js',
        'roadhogrc.mock.js'
      ].forEach(f => cpDotFiles(f, dest));

      if (program.install) {
        info('run', 'npm install');
        require('./install')(dest, printSuccess);
      } else {
        printSuccess();
      }
    })
    .resume();

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

export default init;
