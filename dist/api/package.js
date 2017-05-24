'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _bluebird = require('bluebird');

require('colors');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _pify = require('pify');

var _pify2 = _interopRequireDefault(_pify);

var _electronPackager = require('electron-packager');

var _electronPackager2 = _interopRequireDefault(_electronPackager);

var _electronHostArch = require('../util/electron-host-arch');

var _electronHostArch2 = _interopRequireDefault(_electronHostArch);

var _forgeConfig = require('../util/forge-config');

var _forgeConfig2 = _interopRequireDefault(_forgeConfig);

var _hook = require('../util/hook');

var _hook2 = _interopRequireDefault(_hook);

var _ora = require('../util/ora');

var _ora2 = _interopRequireDefault(_ora);

var _compileHook = require('../util/compile-hook');

var _compileHook2 = _interopRequireDefault(_compileHook);

var _readPackageJson = require('../util/read-package-json');

var _readPackageJson2 = _interopRequireDefault(_readPackageJson);

var _rebuild = require('../util/rebuild');

var _rebuild2 = _interopRequireDefault(_rebuild);

var _requireSearch = require('../util/require-search');

var _requireSearch2 = _interopRequireDefault(_requireSearch);

var _resolveDir = require('../util/resolve-dir');

var _resolveDir2 = _interopRequireDefault(_resolveDir);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var d = (0, _debug2.default)('electron-forge:packager');

/**
 * @typedef {Object} PackageOptions
 * @property {string} [dir=process.cwd()] The path to the app to package
 * @property {boolean} [interactive=false] Whether to use sensible defaults or prompt the user visually
 * @property {string} [arch=process.arch] The target arch
 * @property {string} [platform=process.platform] The target platform.
 * @property {string} [outDir=`${dir}/out`] The path to the output directory for packaged apps
 */

/**
 * Package an Electron application into an platform dependent format.
 *
 * @param {PackageOptions} providedOptions - Options for the Package method
 * @return {Promise} Will resolve when the package process is complete
 */

exports.default = function () {
  var _ref = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee5() {
    var providedOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _Object$assign, dir, interactive, arch, platform, outDir, prepareSpinner, prepareCounter, packageJSON, forgeConfig, packagerSpinner, packageOpts;

    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            // eslint-disable-next-line prefer-const, no-unused-vars
            _Object$assign = (0, _assign2.default)({
              dir: process.cwd(),
              interactive: false,
              arch: (0, _electronHostArch2.default)(),
              platform: process.platform
            }, providedOptions), dir = _Object$assign.dir, interactive = _Object$assign.interactive, arch = _Object$assign.arch, platform = _Object$assign.platform;
            outDir = providedOptions.outDir || _path2.default.resolve(dir, 'out');
            prepareSpinner = (0, _ora2.default)('Preparing to Package Application for arch: ' + (arch === 'all' ? 'ia32' : arch).cyan).start();
            prepareCounter = 0;
            _context5.next = 6;
            return (0, _resolveDir2.default)(dir);

          case 6:
            dir = _context5.sent;

            if (dir) {
              _context5.next = 9;
              break;
            }

            throw 'Failed to locate compilable Electron application';

          case 9:
            _context5.next = 11;
            return (0, _readPackageJson2.default)(dir);

          case 11:
            packageJSON = _context5.sent;

            if (!(_path2.default.dirname(require.resolve(_path2.default.resolve(dir, packageJSON.main))) === dir)) {
              _context5.next = 15;
              break;
            }

            console.error(('Entry point: ' + packageJSON.main).red);
            throw 'The entry point to your application ("packageJSON.main") must be in a subfolder not in the top level directory';

          case 15:
            _context5.next = 17;
            return (0, _forgeConfig2.default)(dir);

          case 17:
            forgeConfig = _context5.sent;
            packagerSpinner = void 0;
            packageOpts = (0, _assign2.default)({
              asar: false,
              overwrite: true
            }, forgeConfig.electronPackagerConfig, {
              afterCopy: [function () {
                var _ref2 = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee(buildPath, electronVersion, pPlatform, pArch, done) {
                  var bins, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, bin;

                  return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          if (packagerSpinner) {
                            packagerSpinner.succeed();
                            prepareCounter += 1;
                            prepareSpinner = (0, _ora2.default)('Preparing to Package Application for arch: ' + (prepareCounter === 2 ? 'armv7l' : 'x64').cyan).start();
                          }
                          _context.next = 3;
                          return _fsPromise2.default.remove(_path2.default.resolve(buildPath, 'node_modules/electron-compile/test'));

                        case 3:
                          _context.next = 5;
                          return (0, _pify2.default)(_glob2.default)(_path2.default.join(buildPath, '**/.bin/**/*'));

                        case 5:
                          bins = _context.sent;
                          _iteratorNormalCompletion = true;
                          _didIteratorError = false;
                          _iteratorError = undefined;
                          _context.prev = 9;
                          _iterator = (0, _getIterator3.default)(bins);

                        case 11:
                          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context.next = 18;
                            break;
                          }

                          bin = _step.value;
                          _context.next = 15;
                          return _fsPromise2.default.remove(bin);

                        case 15:
                          _iteratorNormalCompletion = true;
                          _context.next = 11;
                          break;

                        case 18:
                          _context.next = 24;
                          break;

                        case 20:
                          _context.prev = 20;
                          _context.t0 = _context['catch'](9);
                          _didIteratorError = true;
                          _iteratorError = _context.t0;

                        case 24:
                          _context.prev = 24;
                          _context.prev = 25;

                          if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                          }

                        case 27:
                          _context.prev = 27;

                          if (!_didIteratorError) {
                            _context.next = 30;
                            break;
                          }

                          throw _iteratorError;

                        case 30:
                          return _context.finish(27);

                        case 31:
                          return _context.finish(24);

                        case 32:
                          done();

                        case 33:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, undefined, [[9, 20, 24, 32], [25,, 27, 31]]);
                }));

                return function (_x2, _x3, _x4, _x5, _x6) {
                  return _ref2.apply(this, arguments);
                };
              }(), function () {
                var _ref3 = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee2() {
                  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                  }

                  return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          prepareSpinner.succeed();
                          _context2.next = 3;
                          return _compileHook2.default.apply(undefined, [dir].concat(args));

                        case 3:
                        case 'end':
                          return _context2.stop();
                      }
                    }
                  }, _callee2, undefined);
                }));

                return function () {
                  return _ref3.apply(this, arguments);
                };
              }(), function () {
                var _ref4 = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee3(buildPath, electronVersion, pPlatform, pArch, done) {
                  return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          _context3.next = 2;
                          return (0, _rebuild2.default)(buildPath, electronVersion, pPlatform, pArch);

                        case 2:
                          packagerSpinner = (0, _ora2.default)('Packaging Application').start();
                          done();

                        case 4:
                        case 'end':
                          return _context3.stop();
                      }
                    }
                  }, _callee3, undefined);
                }));

                return function (_x7, _x8, _x9, _x10, _x11) {
                  return _ref4.apply(this, arguments);
                };
              }(), function () {
                var _ref5 = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee4(buildPath, electronVersion, pPlatform, pArch, done) {
                  var copiedPackageJSON;
                  return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                      switch (_context4.prev = _context4.next) {
                        case 0:
                          _context4.next = 2;
                          return (0, _readPackageJson2.default)(buildPath);

                        case 2:
                          copiedPackageJSON = _context4.sent;

                          if (copiedPackageJSON.config && copiedPackageJSON.config.forge) {
                            delete copiedPackageJSON.config.forge;
                          }
                          _context4.next = 6;
                          return _fsPromise2.default.writeFile(_path2.default.resolve(buildPath, 'package.json'), (0, _stringify2.default)(copiedPackageJSON, null, 2));

                        case 6:
                          done();

                        case 7:
                        case 'end':
                          return _context4.stop();
                      }
                    }
                  }, _callee4, undefined);
                }));

                return function (_x12, _x13, _x14, _x15, _x16) {
                  return _ref5.apply(this, arguments);
                };
              }()].concat(forgeConfig.electronPackagerConfig.afterCopy ? forgeConfig.electronPackagerConfig.afterCopy.map(function (item) {
                return typeof item === 'string' ? (0, _requireSearch2.default)(dir, [item]) : item;
              }) : []),
              afterExtract: forgeConfig.electronPackagerConfig.afterExtract ? forgeConfig.electronPackagerConfig.afterExtract.map(function (item) {
                return typeof item === 'string' ? (0, _requireSearch2.default)(dir, [item]) : item;
              }) : [],
              dir: dir,
              arch: arch,
              platform: platform,
              out: outDir,
              electronVersion: packageJSON.devDependencies['electron-prebuilt-compile']
            });

            packageOpts.quiet = true;

            if (!((0, _typeof3.default)(packageOpts.asar) === 'object' && packageOpts.asar.unpack)) {
              _context5.next = 24;
              break;
            }

            packagerSpinner.fail();
            throw new Error('electron-compile does not support asar.unpack yet.  Please use asar.unpackDir');

          case 24:
            _context5.next = 26;
            return (0, _hook2.default)(forgeConfig, 'generateAssets');

          case 26:
            _context5.next = 28;
            return (0, _hook2.default)(forgeConfig, 'prePackage');

          case 28:

            d('packaging with options', packageOpts);

            _context5.next = 31;
            return (0, _pify2.default)(_electronPackager2.default)(packageOpts);

          case 31:
            _context5.next = 33;
            return (0, _hook2.default)(forgeConfig, 'postPackage');

          case 33:

            packagerSpinner.succeed();

          case 34:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function () {
    return _ref.apply(this, arguments);
  };
}();