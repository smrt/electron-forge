#!/usr/bin/env node
'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _bluebird = require('bluebird');

require('colors');

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _tabtab = require('tabtab');

var _tabtab2 = _interopRequireDefault(_tabtab);

require('./util/terminate');

var _oraHandler = require('./util/ora-handler');

var _oraHandler2 = _interopRequireDefault(_oraHandler);

var _checkSystem = require('./util/check-system');

var _checkSystem2 = _interopRequireDefault(_checkSystem);

var _config = require('./util/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.version(require('../package.json').version).option('--verbose', 'Enables verbose mode').command('init', 'Initialize a new Electron application').command('import', 'Attempts to navigate you through the process of importing an existing project to "electron-forge"').command('lint', 'Lints the current Electron application').command('package', 'Package the current Electron application').command('make', 'Generate distributables for the current Electron application').command('start', 'Start the current Electron application').command('publish', 'Publish the current Electron application to GitHub').command('install', 'Install an Electron application from GitHub');

var tab = (0, _tabtab2.default)({
  name: 'electron-forge'
});
tab.on('electron-forge', function (data, done) {
  if (data.line.split(' ').length <= 2) {
    done(null, _commander2.default.commands.filter(function (cmd) {
      return cmd._name.startsWith(data.lastPartial);
    }).map(function (cmd) {
      return cmd._name + ':' + cmd._description;
    }).sort());
  } else {
    done(null, []);
  }
});
tab.start();

if (process.argv[2] !== 'completion') {
  (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee2() {
    var goodSystem;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            goodSystem = void 0;
            _context2.next = 3;
            return (0, _oraHandler2.default)('Checking your system', (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee() {
              return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return (0, _checkSystem2.default)();

                    case 2:
                      goodSystem = _context.sent;

                    case 3:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _callee, undefined);
            })));

          case 3:

            if (!goodSystem) {
              console.error(('It looks like you are missing some dependencies you need to get Electron running.\n' + 'Make sure you have git installed and Node.js version 6.0.0+').red);
              process.exit(1);
            }

            _commander2.default.parse(process.argv);

            _config2.default.reset();
            _config2.default.set('verbose', !!_commander2.default.verbose);

          case 7:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }))();
}