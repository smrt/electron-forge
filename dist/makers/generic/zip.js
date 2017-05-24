'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSupportedOnCurrentPlatform = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _bluebird = require('bluebird');

var _child_process = require('child_process');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _pify = require('pify');

var _pify2 = _interopRequireDefault(_pify);

var _ensureOutput = require('../../util/ensure-output');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isSupportedOnCurrentPlatform = exports.isSupportedOnCurrentPlatform = function () {
  var _ref = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', true);

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function isSupportedOnCurrentPlatform() {
    return _ref.apply(this, arguments);
  };
}();

var zipPromise = function zipPromise(from, to) {
  return new _promise2.default(function (resolve, reject) {
    var child = (0, _child_process.spawn)('zip', ['-r', '-y', to, _path2.default.basename(from)], {
      cwd: _path2.default.dirname(from)
    });

    child.stdout.on('data', function () {});
    child.stderr.on('data', function () {});

    child.on('close', function (code) {
      if (code === 0) return resolve();
      reject(new Error('Failed to zip, exitted with code: ' + code));
    });
  });
};

exports.default = function () {
  var _ref2 = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee2(_ref3) {
    var dir = _ref3.dir,
        appName = _ref3.appName,
        targetPlatform = _ref3.targetPlatform,
        packageJSON = _ref3.packageJSON;
    var zipFolder, zipPath;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            zipFolder = require('zip-folder');
            zipPath = _path2.default.resolve(dir, '../make', _path2.default.basename(dir) + '-' + packageJSON.version + '.zip');
            _context2.next = 4;
            return (0, _ensureOutput.ensureFile)(zipPath);

          case 4:
            _context2.t0 = targetPlatform;
            _context2.next = _context2.t0 === 'win32' ? 7 : _context2.t0 === 'darwin' ? 10 : _context2.t0 === 'linux' ? 13 : 16;
            break;

          case 7:
            _context2.next = 9;
            return (0, _pify2.default)(zipFolder)(dir, zipPath);

          case 9:
            return _context2.abrupt('break', 17);

          case 10:
            _context2.next = 12;
            return zipPromise(_path2.default.resolve(dir, appName + '.app'), zipPath);

          case 12:
            return _context2.abrupt('break', 17);

          case 13:
            _context2.next = 15;
            return zipPromise(dir, zipPath);

          case 15:
            return _context2.abrupt('break', 17);

          case 16:
            throw new Error('Unrecognized platform');

          case 17:
            return _context2.abrupt('return', [zipPath]);

          case 18:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();