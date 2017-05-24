'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _bluebird = require('bluebird');

require('colors');

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _oraHandler = require('../util/ora-handler');

var _oraHandler2 = _interopRequireDefault(_oraHandler);

var _electronHostArch = require('../util/electron-host-arch');

var _electronHostArch2 = _interopRequireDefault(_electronHostArch);

var _forgeConfig = require('../util/forge-config');

var _forgeConfig2 = _interopRequireDefault(_forgeConfig);

var _hook = require('../util/hook');

var _hook2 = _interopRequireDefault(_hook);

var _messages = require('../util/messages');

var _readPackageJson = require('../util/read-package-json');

var _readPackageJson2 = _interopRequireDefault(_readPackageJson);

var _requireSearch = require('../util/require-search');

var _resolveDir = require('../util/resolve-dir');

var _resolveDir2 = _interopRequireDefault(_resolveDir);

var _package = require('./package');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {Object} MakeOptions
 * @property {string} [dir=process.cwd()] The path to the app from which distributables are generated
 * @property {boolean} [interactive=false] Whether to use sensible defaults or prompt the user visually
 * @property {boolean} [skipPackage=false] Whether to skip the pre-make packaging step
 * @property {Array<string>} [overrideTargets] An array of make targets to override your forge config
 * @property {string} [arch=host architecture] The target architecture
 * @property {string} [platform=process.platform] The target platform.
 * @property {string} [outDir=`${dir}/out`] The path to the directory containing generated distributables
 */

/**
 * Make distributables for an Electron application.
 *
 * @param {MakeOptions} providedOptions - Options for the make method
 * @return {Promise} Will resolve when the make process is complete
 */
exports.default = function () {
  var _ref = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee3() {
    var providedOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _Object$assign, dir, interactive, skipPackage, overrideTargets, arch, platform, outDir, forgeConfig, makers, targets, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, target, maker, declaredArch, targetArchs, packageJSON, appName, outputs, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _loop, _iterator2, _step2, result;

    return _regenerator2.default.wrap(function _callee3$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            // eslint-disable-next-line prefer-const, no-unused-vars
            _Object$assign = (0, _assign2.default)({
              dir: process.cwd(),
              interactive: false,
              skipPackage: false,
              arch: (0, _electronHostArch2.default)(),
              platform: process.platform
            }, providedOptions), dir = _Object$assign.dir, interactive = _Object$assign.interactive, skipPackage = _Object$assign.skipPackage, overrideTargets = _Object$assign.overrideTargets, arch = _Object$assign.arch, platform = _Object$assign.platform;
            outDir = providedOptions.outDir || _path2.default.resolve(dir, 'out');

            _oraHandler2.default.interactive = interactive;

            forgeConfig = void 0;
            _context5.next = 6;
            return (0, _oraHandler2.default)('Resolving Forge Config', (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee() {
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

                      throw 'Failed to locate makeable Electron application';

                    case 5:
                      _context.next = 7;
                      return (0, _forgeConfig2.default)(dir);

                    case 7:
                      forgeConfig = _context.sent;

                    case 8:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _callee, undefined);
            })));

          case 6:
            if (['darwin', 'win32', 'linux'].includes(platform)) {
              _context5.next = 8;
              break;
            }

            throw new Error('\'' + platform + '\' is an invalid platform. Choices are \'darwin\', \'win32\' or \'linux\'');

          case 8:
            makers = {};
            targets = overrideTargets || forgeConfig.make_targets[platform];
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context5.prev = 13;
            _iterator = (0, _getIterator3.default)(targets);

          case 15:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context5.next = 30;
              break;
            }

            target = _step.value;
            maker = (0, _requireSearch.requireSearchRaw)(__dirname, ['../makers/' + platform + '/' + target + '.js', '../makers/generic/' + target + '.js', 'electron-forge-maker-' + target, target, _path2.default.resolve(dir, target), _path2.default.resolve(dir, 'node_modules', target)]);

            if (maker) {
              _context5.next = 20;
              break;
            }

            throw new Error(['Could not find a build target with the name: ', target + ' for the platform: ' + platform].join(''));

          case 20:
            if (maker.isSupportedOnCurrentPlatform) {
              _context5.next = 22;
              break;
            }

            throw new Error(['Maker for target ' + target + ' is incompatible with this version of ', 'electron-forge, please upgrade or contact the maintainer ', '(needs to implement \'isSupportedOnCurrentPlatform)\')'].join(''));

          case 22:
            _context5.next = 24;
            return maker.isSupportedOnCurrentPlatform();

          case 24:
            if (_context5.sent) {
              _context5.next = 26;
              break;
            }

            throw new Error(['Cannot build for ' + platform + ' target ' + target + ': the maker declared ', 'that it cannot run on ' + process.platform].join(''));

          case 26:

            makers[target] = maker.default || maker;

          case 27:
            _iteratorNormalCompletion = true;
            _context5.next = 15;
            break;

          case 30:
            _context5.next = 36;
            break;

          case 32:
            _context5.prev = 32;
            _context5.t0 = _context5['catch'](13);
            _didIteratorError = true;
            _iteratorError = _context5.t0;

          case 36:
            _context5.prev = 36;
            _context5.prev = 37;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 39:
            _context5.prev = 39;

            if (!_didIteratorError) {
              _context5.next = 42;
              break;
            }

            throw _iteratorError;

          case 42:
            return _context5.finish(39);

          case 43:
            return _context5.finish(36);

          case 44:
            if (skipPackage) {
              _context5.next = 50;
              break;
            }

            (0, _messages.info)(interactive, 'We need to package your application before we can make it'.green);
            _context5.next = 48;
            return (0, _package2.default)({
              dir: dir,
              interactive: interactive,
              arch: arch,
              platform: platform,
              outDir: outDir
            });

          case 48:
            _context5.next = 51;
            break;

          case 50:
            (0, _messages.warn)(interactive, 'WARNING: Skipping the packaging step, this could result in an out of date build'.red);

          case 51:
            declaredArch = arch;


            (0, _messages.info)(interactive, 'Making for the following targets:', ('' + targets.join(', ')).cyan);

            targetArchs = [declaredArch];

            if (!(declaredArch === 'all')) {
              _context5.next = 64;
              break;
            }

            _context5.t1 = platform;
            _context5.next = _context5.t1 === 'darwin' ? 58 : _context5.t1 === 'linux' ? 60 : _context5.t1 === 'win32' ? 62 : 62;
            break;

          case 58:
            targetArchs = ['x64'];
            return _context5.abrupt('break', 64);

          case 60:
            targetArchs = ['ia32', 'x64', 'armv7l'];
            return _context5.abrupt('break', 64);

          case 62:
            targetArchs = ['ia32', 'x64'];
            return _context5.abrupt('break', 64);

          case 64:
            _context5.next = 66;
            return (0, _readPackageJson2.default)(dir);

          case 66:
            packageJSON = _context5.sent;
            appName = forgeConfig.electronPackagerConfig.name || packageJSON.productName || packageJSON.name;
            outputs = [];
            _context5.next = 71;
            return (0, _hook2.default)(forgeConfig, 'preMake');

          case 71:
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context5.prev = 74;
            _loop = _regenerator2.default.mark(function _loop() {
              var targetArch, packageDir, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _loop2, _iterator3, _step3;

              return _regenerator2.default.wrap(function _loop$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      targetArch = _step2.value;
                      packageDir = _path2.default.resolve(outDir, appName + '-' + platform + '-' + targetArch);
                      _context4.next = 4;
                      return _fsPromise2.default.exists(packageDir);

                    case 4:
                      if (_context4.sent) {
                        _context4.next = 6;
                        break;
                      }

                      throw new Error('Couldn\'t find packaged app at: ' + packageDir);

                    case 6:
                      _iteratorNormalCompletion3 = true;
                      _didIteratorError3 = false;
                      _iteratorError3 = undefined;
                      _context4.prev = 9;
                      _loop2 = _regenerator2.default.mark(function _loop2() {
                        var target, maker;
                        return _regenerator2.default.wrap(function _loop2$(_context3) {
                          while (1) {
                            switch (_context3.prev = _context3.next) {
                              case 0:
                                target = _step3.value;
                                maker = makers[target];

                                // eslint-disable-next-line no-loop-func

                                _context3.next = 4;
                                return (0, _oraHandler2.default)('Making for target: ' + target.cyan + ' - On platform: ' + platform.cyan + ' - For arch: ' + targetArch.cyan, (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee2() {
                                  return _regenerator2.default.wrap(function _callee2$(_context2) {
                                    while (1) {
                                      switch (_context2.prev = _context2.next) {
                                        case 0:
                                          _context2.prev = 0;
                                          _context2.t0 = outputs;
                                          _context2.next = 4;
                                          return maker({
                                            dir: packageDir,
                                            appName: appName,
                                            targetPlatform: platform,
                                            targetArch: targetArch,
                                            forgeConfig: forgeConfig,
                                            packageJSON: packageJSON
                                          });

                                        case 4:
                                          _context2.t1 = _context2.sent;

                                          _context2.t0.push.call(_context2.t0, _context2.t1);

                                          _context2.next = 15;
                                          break;

                                        case 8:
                                          _context2.prev = 8;
                                          _context2.t2 = _context2['catch'](0);

                                          if (!_context2.t2) {
                                            _context2.next = 14;
                                            break;
                                          }

                                          throw {
                                            message: 'An error occured while making for target: ' + target,
                                            stack: _context2.t2.message + '\n' + _context2.t2.stack
                                          };

                                        case 14:
                                          throw new Error('An unknown error occured while making for target: ' + target);

                                        case 15:
                                        case 'end':
                                          return _context2.stop();
                                      }
                                    }
                                  }, _callee2, undefined, [[0, 8]]);
                                })));

                              case 4:
                              case 'end':
                                return _context3.stop();
                            }
                          }
                        }, _loop2, undefined);
                      });
                      _iterator3 = (0, _getIterator3.default)(targets);

                    case 12:
                      if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                        _context4.next = 17;
                        break;
                      }

                      return _context4.delegateYield(_loop2(), 't0', 14);

                    case 14:
                      _iteratorNormalCompletion3 = true;
                      _context4.next = 12;
                      break;

                    case 17:
                      _context4.next = 23;
                      break;

                    case 19:
                      _context4.prev = 19;
                      _context4.t1 = _context4['catch'](9);
                      _didIteratorError3 = true;
                      _iteratorError3 = _context4.t1;

                    case 23:
                      _context4.prev = 23;
                      _context4.prev = 24;

                      if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                      }

                    case 26:
                      _context4.prev = 26;

                      if (!_didIteratorError3) {
                        _context4.next = 29;
                        break;
                      }

                      throw _iteratorError3;

                    case 29:
                      return _context4.finish(26);

                    case 30:
                      return _context4.finish(23);

                    case 31:
                    case 'end':
                      return _context4.stop();
                  }
                }
              }, _loop, undefined, [[9, 19, 23, 31], [24,, 26, 30]]);
            });
            _iterator2 = (0, _getIterator3.default)(targetArchs);

          case 77:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context5.next = 82;
              break;
            }

            return _context5.delegateYield(_loop(), 't2', 79);

          case 79:
            _iteratorNormalCompletion2 = true;
            _context5.next = 77;
            break;

          case 82:
            _context5.next = 88;
            break;

          case 84:
            _context5.prev = 84;
            _context5.t3 = _context5['catch'](74);
            _didIteratorError2 = true;
            _iteratorError2 = _context5.t3;

          case 88:
            _context5.prev = 88;
            _context5.prev = 89;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 91:
            _context5.prev = 91;

            if (!_didIteratorError2) {
              _context5.next = 94;
              break;
            }

            throw _iteratorError2;

          case 94:
            return _context5.finish(91);

          case 95:
            return _context5.finish(88);

          case 96:
            _context5.next = 98;
            return (0, _hook2.default)(forgeConfig, 'postMake', outputs);

          case 98:
            result = _context5.sent;

            // If the postMake hooks modifies the locations / names of the outputs it must return
            // the new locations so that the publish step knows where to look
            if (Array.isArray(result)) {
              outputs = result;
            }

            return _context5.abrupt('return', outputs);

          case 101:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee3, undefined, [[13, 32, 36, 44], [37,, 39, 43], [74, 84, 88, 96], [89,, 91, 95]]);
  }));

  return function () {
    return _ref.apply(this, arguments);
  };
}();