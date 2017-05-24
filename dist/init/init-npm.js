'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.airbnbDeps = exports.standardDeps = exports.exactDevDeps = exports.devDeps = exports.deps = undefined;

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _bluebird = require('bluebird');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _username = require('username');

var _username2 = _interopRequireDefault(_username);

var _installDependencies = require('../util/install-dependencies');

var _installDependencies2 = _interopRequireDefault(_installDependencies);

var _readPackageJson = require('../util/read-package-json');

var _readPackageJson2 = _interopRequireDefault(_readPackageJson);

var _oraHandler = require('../util/ora-handler');

var _oraHandler2 = _interopRequireDefault(_oraHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var d = (0, _debug2.default)('electron-forge:init:npm');

var deps = exports.deps = ['electron-compile'];
var devDeps = exports.devDeps = ['babel-preset-env', 'babel-preset-react', 'babel-plugin-transform-async-to-generator'];
var exactDevDeps = exports.exactDevDeps = ['electron-prebuilt-compile'];
var standardDeps = exports.standardDeps = ['standard'];
var airbnbDeps = exports.airbnbDeps = ['eslint', 'eslint-config-airbnb', 'eslint-plugin-import', 'eslint-plugin-jsx-a11y@^3.0.0', 'eslint-plugin-react'];

exports.default = function () {
  var _ref = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee3(dir, lintStyle) {
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return (0, _oraHandler2.default)('Initializing NPM Module', (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee() {
              var packageJSON;
              return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return (0, _readPackageJson2.default)(_path2.default.resolve(__dirname, '../../tmpl'));

                    case 2:
                      packageJSON = _context.sent;

                      packageJSON.productName = packageJSON.name = _path2.default.basename(dir).toLowerCase();
                      packageJSON.config.forge.electronWinstallerConfig.name = packageJSON.name.replace(/-/g, '_');
                      packageJSON.config.forge.windowsStoreConfig.name = packageJSON.productName.replace(/-/g, '');
                      _context.next = 8;
                      return (0, _username2.default)();

                    case 8:
                      packageJSON.author = _context.sent;
                      _context.t0 = lintStyle;
                      _context.next = _context.t0 === 'standard' ? 12 : _context.t0 === 'airbnb' ? 14 : 16;
                      break;

                    case 12:
                      packageJSON.scripts.lint = 'standard';
                      return _context.abrupt('break', 18);

                    case 14:
                      packageJSON.scripts.lint = 'eslint src';
                      return _context.abrupt('break', 18);

                    case 16:
                      packageJSON.scripts.lint = 'echo "No linting configured"';
                      return _context.abrupt('break', 18);

                    case 18:
                      d('writing package.json to:', dir);
                      _context.next = 21;
                      return _fsPromise2.default.writeFile(_path2.default.resolve(dir, 'package.json'), (0, _stringify2.default)(packageJSON, null, 4));

                    case 21:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _callee, undefined);
            })));

          case 2:
            _context3.next = 4;
            return (0, _oraHandler2.default)('Installing NPM Dependencies', (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee2() {
              var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, packageName, content, electronPrebuilt, _arr, _i, profile, envTarget;

              return _regenerator2.default.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      d('installing dependencies');
                      _context2.next = 3;
                      return (0, _installDependencies2.default)(dir, deps);

                    case 3:

                      d('installing devDependencies');
                      _context2.next = 6;
                      return (0, _installDependencies2.default)(dir, devDeps, true);

                    case 6:

                      d('installing exact dependencies');
                      _iteratorNormalCompletion = true;
                      _didIteratorError = false;
                      _iteratorError = undefined;
                      _context2.prev = 10;
                      _iterator = (0, _getIterator3.default)(exactDevDeps);

                    case 12:
                      if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                        _context2.next = 19;
                        break;
                      }

                      packageName = _step.value;
                      _context2.next = 16;
                      return (0, _installDependencies2.default)(dir, [packageName], true, true);

                    case 16:
                      _iteratorNormalCompletion = true;
                      _context2.next = 12;
                      break;

                    case 19:
                      _context2.next = 25;
                      break;

                    case 21:
                      _context2.prev = 21;
                      _context2.t0 = _context2['catch'](10);
                      _didIteratorError = true;
                      _iteratorError = _context2.t0;

                    case 25:
                      _context2.prev = 25;
                      _context2.prev = 26;

                      if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                      }

                    case 28:
                      _context2.prev = 28;

                      if (!_didIteratorError) {
                        _context2.next = 31;
                        break;
                      }

                      throw _iteratorError;

                    case 31:
                      return _context2.finish(28);

                    case 32:
                      return _context2.finish(25);

                    case 33:
                      _context2.t1 = lintStyle;
                      _context2.next = _context2.t1 === 'standard' ? 36 : _context2.t1 === 'airbnb' ? 40 : 44;
                      break;

                    case 36:
                      d('installing standard linting dependencies');
                      _context2.next = 39;
                      return (0, _installDependencies2.default)(dir, standardDeps, true);

                    case 39:
                      return _context2.abrupt('break', 46);

                    case 40:
                      d('installing airbnb linting dependencies');
                      _context2.next = 43;
                      return (0, _installDependencies2.default)(dir, airbnbDeps, true);

                    case 43:
                      return _context2.abrupt('break', 46);

                    case 44:
                      d('not installing linting deps');
                      return _context2.abrupt('break', 46);

                    case 46:
                      _context2.t2 = JSON;
                      _context2.next = 49;
                      return _fsPromise2.default.readFile(_path2.default.join(dir, '.compilerc'), 'utf8');

                    case 49:
                      _context2.t3 = _context2.sent;
                      content = _context2.t2.parse.call(_context2.t2, _context2.t3);
                      electronPrebuilt = require(_path2.default.join(dir, 'node_modules', 'electron-prebuilt-compile', 'package.json'));
                      _arr = ['development', 'production'];


                      for (_i = 0; _i < _arr.length; _i++) {
                        profile = _arr[_i];
                        envTarget = content.env[profile]['application/javascript'].presets.find(function (x) {
                          return x[0] === 'env';
                        });
                        // parseFloat strips the patch version
                        // parseFloat('1.3.2') === 1.3

                        envTarget[1].targets.electron = parseFloat(electronPrebuilt.version);
                      }

                      _context2.next = 56;
                      return _fsPromise2.default.writeFile(_path2.default.join(dir, '.compilerc'), (0, _stringify2.default)(content, null, 2), 'utf8');

                    case 56:
                    case 'end':
                      return _context2.stop();
                  }
                }
              }, _callee2, undefined, [[10, 21, 25, 33], [26,, 28, 32]]);
            })));

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();