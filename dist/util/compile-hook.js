'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _bluebird = require('bluebird');

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _oraHandler = require('./ora-handler');

var _oraHandler2 = _interopRequireDefault(_oraHandler);

var _readPackageJson = require('./read-package-json');

var _readPackageJson2 = _interopRequireDefault(_readPackageJson);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee3(originalDir, buildPath, electronVersion, pPlatform, pArch, done) {
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return (0, _oraHandler2.default)('Compiling Application', (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee2() {
              var compileAndShim = function () {
                var _ref3 = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee(appDir) {
                  var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, entry, fullPath, log, packageJSON, index;

                  return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _iteratorNormalCompletion = true;
                          _didIteratorError = false;
                          _iteratorError = undefined;
                          _context.prev = 3;
                          _context.t0 = _getIterator3.default;
                          _context.next = 7;
                          return _fsPromise2.default.readdir(appDir);

                        case 7:
                          _context.t1 = _context.sent;
                          _iterator = (0, _context.t0)(_context.t1);

                        case 9:
                          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context.next = 24;
                            break;
                          }

                          entry = _step.value;

                          if (entry.match(/^(node_modules|bower_components)$/)) {
                            _context.next = 21;
                            break;
                          }

                          fullPath = _path2.default.join(appDir, entry);
                          _context.next = 15;
                          return _fsPromise2.default.stat(fullPath);

                        case 15:
                          if (!_context.sent.isDirectory()) {
                            _context.next = 21;
                            break;
                          }

                          log = console.log;

                          console.log = function () {};
                          _context.next = 20;
                          return compileCLI.main(appDir, [fullPath]);

                        case 20:
                          console.log = log;

                        case 21:
                          _iteratorNormalCompletion = true;
                          _context.next = 9;
                          break;

                        case 24:
                          _context.next = 30;
                          break;

                        case 26:
                          _context.prev = 26;
                          _context.t2 = _context['catch'](3);
                          _didIteratorError = true;
                          _iteratorError = _context.t2;

                        case 30:
                          _context.prev = 30;
                          _context.prev = 31;

                          if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                          }

                        case 33:
                          _context.prev = 33;

                          if (!_didIteratorError) {
                            _context.next = 36;
                            break;
                          }

                          throw _iteratorError;

                        case 36:
                          return _context.finish(33);

                        case 37:
                          return _context.finish(30);

                        case 38:
                          _context.next = 40;
                          return (0, _readPackageJson2.default)(appDir);

                        case 40:
                          packageJSON = _context.sent;
                          index = packageJSON.main || 'index.js';

                          packageJSON.originalMain = index;
                          packageJSON.main = 'es6-shim.js';

                          _context.t3 = _fsPromise2.default;
                          _context.t4 = _path2.default.join(appDir, 'es6-shim.js');
                          _context.next = 48;
                          return _fsPromise2.default.readFile(_path2.default.join(_path2.default.resolve(originalDir, 'node_modules/electron-compile/lib/es6-shim.js')), 'utf8');

                        case 48:
                          _context.t5 = _context.sent;
                          _context.next = 51;
                          return _context.t3.writeFile.call(_context.t3, _context.t4, _context.t5);

                        case 51:
                          _context.next = 53;
                          return _fsPromise2.default.writeFile(_path2.default.join(appDir, 'package.json'), (0, _stringify2.default)(packageJSON, null, 2));

                        case 53:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, this, [[3, 26, 30, 38], [31,, 33, 37]]);
                }));

                return function compileAndShim(_x7) {
                  return _ref3.apply(this, arguments);
                };
              }();

              var compileCLI;
              return _regenerator2.default.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      compileCLI = require(_path2.default.resolve(originalDir, 'node_modules/electron-compile/lib/cli.js'));
                      _context2.next = 3;
                      return compileAndShim(buildPath);

                    case 3:
                    case 'end':
                      return _context2.stop();
                  }
                }
              }, _callee2, undefined);
            })));

          case 2:
            done();

          case 3:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x, _x2, _x3, _x4, _x5, _x6) {
    return _ref.apply(this, arguments);
  };
}();