'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDefaultCertificate = exports.isSupportedOnCurrentPlatform = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _bluebird = require('bluebird');

var createDefaultCertificate = exports.createDefaultCertificate = function () {
  var _ref2 = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee2(publisherName, outPath) {
    var defaultPvk, targetCert, targetPfx;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            defaultPvk = _path2.default.resolve(__dirname, '..', '..', '..', 'res', 'default.pvk');
            targetCert = _path2.default.join(outPath, 'default.cer');
            targetPfx = _path2.default.join(outPath, 'default.pfx');
            _context2.next = 5;
            return spawnSdkTool('makecert.exe', ['-r', '-h', '0', '-n', 'CN=' + publisherName, '-eku', '1.3.6.1.5.5.7.3.3', '-pe', '-sv', defaultPvk, targetCert]);

          case 5:
            _context2.next = 7;
            return spawnSdkTool('pvk2pfx.exe', ['-pvk', defaultPvk, '-spc', targetCert, '-pfx', targetPfx]);

          case 7:
            return _context2.abrupt('return', targetPfx);

          case 8:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function createDefaultCertificate(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _spawnRx = require('spawn-rx');

var _ensureOutput = require('../../util/ensure-output');

var _configFn = require('../../util/config-fn');

var _configFn2 = _interopRequireDefault(_configFn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// electron-windows-store doesn't set its 'os' field even though it only runs on
// win32
var isSupportedOnCurrentPlatform = exports.isSupportedOnCurrentPlatform = function () {
  var _ref = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', process.platform === 'win32');

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

// NB: This is not a typo, we require AppXs to be built on 64-bit
// but if we're running in a 32-bit node.js process, we're going to
// be Wow64 redirected
var windowsSdkPath = process.arch === 'x64' ? 'C:\\Program Files (x86)\\Windows Kits\\10\\bin\\x64' : 'C:\\Program Files\\Windows Kits\\10\\bin\\x64';

function findSdkTool(exe) {
  var sdkTool = _path2.default.join(windowsSdkPath, exe);
  if (!_fs2.default.existsSync(sdkTool)) {
    sdkTool = (0, _spawnRx.findActualExecutable)(exe, []).cmd;
  }

  if (!_fs2.default.existsSync(sdkTool)) {
    throw new Error('Can\'t find ' + exe + ' in PATH, you probably need to install the Windows SDK');
  }

  return sdkTool;
}

function spawnSdkTool(exe, params) {
  return (0, _spawnRx.spawnPromise)(findSdkTool(exe), params);
}

exports.default = function () {
  var _ref3 = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee3(_ref4) {
    var dir = _ref4.dir,
        appName = _ref4.appName,
        targetArch = _ref4.targetArch,
        forgeConfig = _ref4.forgeConfig,
        packageJSON = _ref4.packageJSON;
    var windowsStore, outPath, opts, noBeta, err;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            windowsStore = require('electron-windows-store');
            outPath = _path2.default.resolve(dir, '../make/appx/' + targetArch);
            _context3.next = 4;
            return (0, _ensureOutput.ensureDirectory)(outPath);

          case 4:
            opts = (0, _assign2.default)({
              publisher: packageJSON.author,
              flatten: false,
              deploy: false,
              packageVersion: packageJSON.version + '.0',
              packageName: appName.replace(/-/g, ''),
              packageDisplayName: appName,
              packageDescription: packageJSON.description || appName,
              packageExecutable: 'app\\' + appName + '.exe',
              windowsKit: _path2.default.dirname(findSdkTool('makeappx.exe'))
            }, (0, _configFn2.default)(forgeConfig.windowsStoreConfig, targetArch), {
              inputDirectory: dir,
              outputDirectory: outPath
            });

            if (opts.devCert) {
              _context3.next = 9;
              break;
            }

            _context3.next = 8;
            return createDefaultCertificate(opts.publisher, outPath);

          case 8:
            opts.devCert = _context3.sent;

          case 9:

            if (!opts.publisher.match(/^CN=/)) {
              opts.publisher = 'CN=' + opts.publisher;
            }

            if (!opts.packageVersion.match(/-/)) {
              _context3.next = 18;
              break;
            }

            if (!opts.makeVersionWinStoreCompatible) {
              _context3.next = 16;
              break;
            }

            noBeta = opts.packageVersion.replace(/-.*/, '');

            opts.packageVersion = noBeta + '.0';
            _context3.next = 18;
            break;

          case 16:
            err = "Windows Store version numbers don't support semver beta tags. To" + 'automatically fix this, set makeVersionWinStoreCompatible to true or ' + 'explicitly set packageVersion to a version of the format X.Y.Z.A';
            throw new Error(err);

          case 18:

            delete opts.makeVersionWinStoreCompatible;

            _context3.next = 21;
            return windowsStore(opts);

          case 21:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x3) {
    return _ref3.apply(this, arguments);
  };
}();