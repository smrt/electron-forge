'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSupportedOnCurrentPlatform = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _bluebird = require('bluebird');

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _pify = require('pify');

var _pify2 = _interopRequireDefault(_pify);

var _ensureOutput = require('../../util/ensure-output');

var _configFn = require('../../util/config-fn');

var _configFn2 = _interopRequireDefault(_configFn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// electron-installer-dmg doesn't set its 'os' field even though it depends on
// appdmg, which is darwin-only
var isSupportedOnCurrentPlatform = exports.isSupportedOnCurrentPlatform = function () {
  var _ref = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', process.platform === 'darwin');

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

exports.default = function () {
  var _ref2 = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee2(_ref3) {
    var dir = _ref3.dir,
        appName = _ref3.appName,
        targetArch = _ref3.targetArch,
        forgeConfig = _ref3.forgeConfig,
        packageJSON = _ref3.packageJSON;
    var electronDMG, outPath, wantedOutPath, dmgConfig;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            electronDMG = require('electron-installer-dmg');
            outPath = _path2.default.resolve(dir, '../make', appName + '.dmg');
            wantedOutPath = _path2.default.resolve(dir, '../make', appName + '-' + packageJSON.version + '.dmg');
            _context2.next = 5;
            return (0, _ensureOutput.ensureFile)(outPath);

          case 5:
            dmgConfig = (0, _assign2.default)({
              overwrite: true,
              name: appName
            }, (0, _configFn2.default)(forgeConfig.electronInstallerDMG, targetArch), {
              appPath: _path2.default.resolve(dir, appName + '.app'),
              out: _path2.default.dirname(outPath)
            });
            _context2.next = 8;
            return (0, _pify2.default)(electronDMG)(dmgConfig);

          case 8:
            _context2.next = 10;
            return _fsPromise2.default.rename(outPath, wantedOutPath);

          case 10:
            return _context2.abrupt('return', [wantedOutPath]);

          case 11:
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