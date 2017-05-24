'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _bluebird = require('bluebird');

require('colors');

var _child_process = require('child_process');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _oraHandler = require('../util/ora-handler');

var _oraHandler2 = _interopRequireDefault(_oraHandler);

var _readPackageJson = require('../util/read-package-json');

var _readPackageJson2 = _interopRequireDefault(_readPackageJson);

var _rebuild = require('../util/rebuild');

var _rebuild2 = _interopRequireDefault(_rebuild);

var _resolveDir = require('../util/resolve-dir');

var _resolveDir2 = _interopRequireDefault(_resolveDir);

var _forgeConfig = require('../util/forge-config');

var _forgeConfig2 = _interopRequireDefault(_forgeConfig);

var _hook = require('../util/hook');

var _hook2 = _interopRequireDefault(_hook);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {Object} StartOptions
 * @property {string} [dir=process.cwd()] The path to the electron forge project to run
 * @property {string} [appPath='.'] The path (relative to dir) to the electron app to run relative to the project directory
 * @property {boolean} [interactive=false] Whether to use sensible defaults or prompt the user visually
 * @property {boolean} [enableLogging=false] Enables advanced internal Electron debug calls
 * @property {Array<string>} [args] Arguments to pass through to the launched Electron application
 */

/**
 * Start an Electron application.
 *
 * @param {StartOptions} providedOptions - Options for the Publish method
 * @return {Promise} Will resolve when the application is launched
 */
exports.default = function () {
  var _ref = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee3() {
    var providedOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _Object$assign, dir, interactive, enableLogging, appPath, args, runAsNode, packageJSON, spawnOpts, spawned, forgeConfig;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            // eslint-disable-next-line prefer-const, no-unused-vars
            _Object$assign = (0, _assign2.default)({
              dir: process.cwd(),
              appPath: '.',
              interactive: false,
              enableLogging: false,
              args: [],
              runAsNode: false
            }, providedOptions), dir = _Object$assign.dir, interactive = _Object$assign.interactive, enableLogging = _Object$assign.enableLogging, appPath = _Object$assign.appPath, args = _Object$assign.args, runAsNode = _Object$assign.runAsNode;

            _oraHandler2.default.interactive = interactive;

            _context3.next = 4;
            return (0, _oraHandler2.default)('Locating Application', (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee() {
              return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return (0, _resolveDir2.default)(dir);

                    case 2:
                      dir = _context.sent;

                      if (dir) {
                        _context.next = 5;
                        break;
                      }

                      throw 'Failed to locate startable Electron application';

                    case 5:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _callee, undefined);
            })));

          case 4:
            _context3.next = 6;
            return (0, _readPackageJson2.default)(dir);

          case 6:
            packageJSON = _context3.sent;
            _context3.next = 9;
            return (0, _rebuild2.default)(dir, packageJSON.devDependencies['electron-prebuilt-compile'], process.platform, process.arch);

          case 9:
            spawnOpts = {
              cwd: dir,
              stdio: 'inherit',
              env: (0, _assign2.default)({}, process.env, enableLogging ? {
                ELECTRON_ENABLE_LOGGING: true,
                ELECTRON_ENABLE_STACK_DUMPING: true
              } : {})
            };


            if (runAsNode) {
              spawnOpts.env.ELECTRON_RUN_AS_NODE = true;
            } else {
              delete spawnOpts.env.ELECTRON_RUN_AS_NODE;
            }

            spawned = void 0;
            _context3.next = 14;
            return (0, _forgeConfig2.default)(dir);

          case 14:
            forgeConfig = _context3.sent;
            _context3.next = 17;
            return (0, _hook2.default)(forgeConfig, 'generateAssets');

          case 17:
            _context3.next = 19;
            return (0, _oraHandler2.default)('Launching Application', (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee2() {
              return _regenerator2.default.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      /* istanbul ignore if  */
                      if (process.platform === 'win32') {
                        spawned = (0, _child_process.spawn)(_path2.default.resolve(dir, 'node_modules/.bin/electron.cmd'), [appPath].concat(args), spawnOpts);
                      } else {
                        spawned = (0, _child_process.spawn)(_path2.default.resolve(dir, 'node_modules/.bin/electron'), [appPath].concat(args), spawnOpts);
                      }

                    case 1:
                    case 'end':
                      return _context2.stop();
                  }
                }
              }, _callee2, undefined);
            })));

          case 19:
            return _context3.abrupt('return', spawned);

          case 20:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function () {
    return _ref.apply(this, arguments);
  };
}();