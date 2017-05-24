'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _bluebird = require('bluebird');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _readPackageJson = require('./read-package-json');

var _readPackageJson2 = _interopRequireDefault(_readPackageJson);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var d = (0, _debug2.default)('electron-forge:project-resolver');

exports.default = function () {
  var _ref = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee(dir) {
    var mDir, prevDir, testPath, packageJSON;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            mDir = dir;
            prevDir = void 0;

          case 2:
            if (!(prevDir !== mDir)) {
              _context.next = 22;
              break;
            }

            prevDir = mDir;
            testPath = _path2.default.resolve(mDir, 'package.json');

            d('searching for project in:', mDir);
            _context.next = 8;
            return _fsPromise2.default.exists(testPath);

          case 8:
            if (!_context.sent) {
              _context.next = 19;
              break;
            }

            _context.next = 11;
            return (0, _readPackageJson2.default)(mDir);

          case 11:
            packageJSON = _context.sent;

            if (!(packageJSON.devDependencies && packageJSON.devDependencies['electron-prebuilt-compile'])) {
              _context.next = 15;
              break;
            }

            _context.next = 16;
            break;

          case 15:
            throw 'You must depend on "electron-prebuilt-compile" in your devDependencies';

          case 16:
            if (!(packageJSON.config && packageJSON.config.forge)) {
              _context.next = 19;
              break;
            }

            d('electron-forge compatible package.json found in', testPath);
            return _context.abrupt('return', mDir);

          case 19:
            mDir = _path2.default.dirname(mDir);
            _context.next = 2;
            break;

          case 22:
            return _context.abrupt('return', null);

          case 23:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();