'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _bluebird = require('bluebird');

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

require('./util/terminate');

var _api = require('./api');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee() {
  var commandArgs, appArgs, doubleDashIndex, dir, opts, spawned;
  return _regenerator2.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          commandArgs = process.argv;
          appArgs = void 0;
          doubleDashIndex = process.argv.indexOf('--');

          if (doubleDashIndex !== -1) {
            commandArgs = process.argv.slice(0, doubleDashIndex);
            appArgs = process.argv.slice(doubleDashIndex + 1);
          }

          dir = process.cwd();

          _commander2.default.version(require('../package.json').version).arguments('[cwd]').option('-p, --app-path <path>', "Override the path to the Electron app to launch (defaults to '.')").option('-l, --enable-logging', 'Enable advanced logging.  This will log internal Electron things').option('-n, --run-as-node', 'Run the Electron app as a Node.JS script').option('--vscode', 'Used to enable arg transformation for debugging Electron through VSCode.  Do not use yourself.').action(function (cwd) {
            if (!cwd) return;
            if (_path2.default.isAbsolute(cwd) && _fsPromise2.default.existsSync(cwd)) {
              dir = cwd;
            } else if (_fsPromise2.default.existsSync(_path2.default.resolve(dir, cwd))) {
              dir = _path2.default.resolve(dir, cwd);
            }
          }).parse(commandArgs);

          _commander2.default.on('--help', function () {
            console.log("  Any arguments found after '--' will be passed to the Electron app, e.g.");
            console.log('');
            console.log('    $ electron-forge /path/to/project -l -- -d -f foo.txt');
            console.log('');
            console.log("  will pass the arguments '-d -f foo.txt' to the Electron app");
          });

          opts = {
            dir: dir,
            interactive: true,
            enableLogging: !!_commander2.default.enableLogging,
            runAsNode: !!_commander2.default.runAsNode
          };


          if (_commander2.default.vscode && appArgs) {
            // Args are in the format ~arg~ so we need to strip the "~"
            appArgs = appArgs.map(function (arg) {
              return arg.substr(1, arg.length - 2);
            }).filter(function (arg) {
              return arg.length > 0;
            });
          }

          if (_commander2.default.appPath) opts.appPath = _commander2.default.appPath;
          if (appArgs) opts.args = appArgs;

          _context.next = 13;
          return (0, _api.start)(opts);

        case 13:
          spawned = _context.sent;
          _context.next = 16;
          return new _promise2.default(function (resolve) {
            spawned.on('exit', function (code) {
              if (code !== 0) {
                process.exit(code);
              }
              resolve();
            });
          });

        case 16:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined);
}))();