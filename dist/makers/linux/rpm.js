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

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _pify = require('pify');

var _pify2 = _interopRequireDefault(_pify);

var _ensureOutput = require('../../util/ensure-output');

var _configFn = require('../../util/config-fn');

var _configFn2 = _interopRequireDefault(_configFn);

var _isInstalled = require('../../util/is-installed');

var _isInstalled2 = _interopRequireDefault(_isInstalled);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isSupportedOnCurrentPlatform = exports.isSupportedOnCurrentPlatform = function () {
  var _ref = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', (0, _isInstalled2.default)('electron-installer-redhat'));

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

function rpmArch(nodeArch) {
  switch (nodeArch) {
    case 'ia32':
      return 'i386';
    case 'x64':
      return 'x86_64';
    case 'armv7l':
      return 'armv7hl';
    case 'arm':
      return 'armv6hl';
    default:
      return nodeArch;
  }
}

exports.default = function () {
  var _ref2 = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee2(_ref3) {
    var dir = _ref3.dir,
        targetArch = _ref3.targetArch,
        forgeConfig = _ref3.forgeConfig,
        packageJSON = _ref3.packageJSON;
    var installer, arch, outPath, rpmDefaults, rpmConfig;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            installer = require('electron-installer-redhat');
            arch = rpmArch(targetArch);
            outPath = _path2.default.resolve(dir, '../make', packageJSON.name + '-' + packageJSON.version + '.' + arch + '.rpm');
            _context2.next = 5;
            return (0, _ensureOutput.ensureFile)(outPath);

          case 5:
            rpmDefaults = {
              arch: arch,
              dest: _path2.default.dirname(outPath),
              src: dir
            };
            rpmConfig = (0, _assign2.default)({}, (0, _configFn2.default)(forgeConfig.electronInstallerRedhat, targetArch), rpmDefaults);
            _context2.next = 9;
            return (0, _pify2.default)(installer)(rpmConfig);

          case 9:
            return _context2.abrupt('return', [outPath]);

          case 10:
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