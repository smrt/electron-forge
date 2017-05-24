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
            return _context.abrupt('return', (0, _isInstalled2.default)('electron-winstaller'));

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

    var _require, createWindowsInstaller, outPath, winstallerConfig, artifacts, deltaPath, msiPath;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _require = require('electron-winstaller'), createWindowsInstaller = _require.createWindowsInstaller;
            outPath = _path2.default.resolve(dir, '../make/squirrel.windows/' + targetArch);
            _context2.next = 4;
            return (0, _ensureOutput.ensureDirectory)(outPath);

          case 4:
            winstallerConfig = (0, _assign2.default)({
              name: appName,
              noMsi: true,
              exe: appName + '.exe',
              setupExe: appName + '-' + packageJSON.version + ' Setup.exe'
            }, (0, _configFn2.default)(forgeConfig.electronWinstallerConfig, targetArch), {
              appDirectory: dir,
              outputDirectory: outPath
            });
            _context2.next = 7;
            return createWindowsInstaller(winstallerConfig);

          case 7:
            artifacts = [_path2.default.resolve(outPath, 'RELEASES'), _path2.default.resolve(outPath, winstallerConfig.setupExe || appName + 'Setup.exe'), _path2.default.resolve(outPath, winstallerConfig.name + '-' + packageJSON.version + '-full.nupkg')];
            deltaPath = _path2.default.resolve(outPath, winstallerConfig.name + '-' + packageJSON.version + '-delta.nupkg');
            _context2.t0 = winstallerConfig.remoteReleases;

            if (_context2.t0) {
              _context2.next = 14;
              break;
            }

            _context2.next = 13;
            return _fsPromise2.default.exists(deltaPath);

          case 13:
            _context2.t0 = _context2.sent;

          case 14:
            if (!_context2.t0) {
              _context2.next = 16;
              break;
            }

            artifacts.push(deltaPath);

          case 16:
            msiPath = _path2.default.resolve(outPath, winstallerConfig.setupMsi || appName + 'Setup.msi');
            _context2.t1 = !winstallerConfig.noMsi;

            if (!_context2.t1) {
              _context2.next = 22;
              break;
            }

            _context2.next = 21;
            return _fsPromise2.default.exists(msiPath);

          case 21:
            _context2.t1 = _context2.sent;

          case 22:
            if (!_context2.t1) {
              _context2.next = 24;
              break;
            }

            artifacts.push(msiPath);

          case 24:
            return _context2.abrupt('return', artifacts);

          case 25:
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