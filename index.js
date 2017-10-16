Object.defineProperty(exports, "__esModule", {
  value: true
});

const path = require('path');
const _init = require('./lib/init');
const _link = require('./lib/link');

const init = ({ dest, install }) => {
  let _dest = dest || 'Zelda';
  _dest = _dest.indexOf('/') > -1 ? path.resolve(_dest) : path.join(process.cwd(), _dest);
  _init({
    dest: _dest,
    install
  });
};

const link = ({ config, dest, install }) => {
  let _dest = dest || 'Zatlas';
  _dest = _dest.indexOf('/') > -1 ? path.resolve(_dest) : path.join(process.cwd(), _dest);
  _link({
    config,
    dest: _dest,
    install
  });
};

exports.init = init;
exports.link = link;
