import which from 'which';

function runCmd(cmd, args, dest, fn) {
  args = args || [];
  var runner = require('child_process').spawn(cmd, args, {
    // keep color
    cwd: dest,
    stdio: "inherit"
  });
  runner.on('close', function (code) {
    if (fn) {
      fn(code);
    }
  });
}

function findNpm() {
  var npms = process.platform === 'win32' ? ['tnpm.cmd', 'cnpm.cmd', 'npm.cmd'] : ['tnpm', 'cnpm', 'npm'];
  for (var i = 0; i < npms.length; i++) {
    try {
      which.sync(npms[i]);
      console.log('use npm: ' + npms[i]);
      return npms[i];
    } catch (e) {
    }
  }
  throw new Error('please install npm');
}

export default function (dest, done) {
  const npm = findNpm();
  runCmd(which.sync(npm), ['install'], dest, function () {
    console.log(npm + ' install end');
    done();
  });
};
