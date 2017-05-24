'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unmountImage = exports.mountImage = exports.getMountedImages = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _bluebird = require('bluebird');

var _spawnRx = require('spawn-rx');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var d = (0, _debug2.default)('electron-forge:hdiutil');

var getMountedImages = exports.getMountedImages = function () {
  var _ref = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee() {
    var output, mounts, mountObjects, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, mount, mountPath, imagePath;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _spawnRx.spawnPromise)('hdiutil', ['info']);

          case 2:
            output = _context.sent;
            mounts = output.split(/====\n/g);

            mounts.shift();

            mountObjects = [];
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 9;


            for (_iterator = (0, _getIterator3.default)(mounts); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              mount = _step.value;

              try {
                mountPath = /\/Volumes\/(.+)\n/g.exec(mount)[1];
                imagePath = /image-path +: +(.+)\n/g.exec(mount)[1];

                mountObjects.push({ mountPath: mountPath, imagePath: imagePath });
              } catch (err) {
                // Ignore
              }
            }

            _context.next = 17;
            break;

          case 13:
            _context.prev = 13;
            _context.t0 = _context['catch'](9);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 17:
            _context.prev = 17;
            _context.prev = 18;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 20:
            _context.prev = 20;

            if (!_didIteratorError) {
              _context.next = 23;
              break;
            }

            throw _iteratorError;

          case 23:
            return _context.finish(20);

          case 24:
            return _context.finish(17);

          case 25:
            d('identified active mounts', mountObjects);
            return _context.abrupt('return', mountObjects);

          case 27:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[9, 13, 17, 25], [18,, 20, 24]]);
  }));

  return function getMountedImages() {
    return _ref.apply(this, arguments);
  };
}();

var mountImage = exports.mountImage = function () {
  var _ref2 = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee2(filePath) {
    var output, mountPath;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            d('mounting image:', filePath);
            _context2.next = 3;
            return (0, _spawnRx.spawnPromise)('hdiutil', ['attach', '-noautoopen', '-nobrowse', '-noverify', filePath]);

          case 3:
            output = _context2.sent;
            mountPath = /\/Volumes\/(.+)\n/g.exec(output)[1];

            d('mounted at:', mountPath);

            return _context2.abrupt('return', {
              mountPath: mountPath,
              imagePath: filePath
            });

          case 7:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function mountImage(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var unmountImage = exports.unmountImage = function () {
  var _ref3 = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee3(mount) {
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            d('unmounting current mount:', mount);
            _context3.next = 3;
            return (0, _spawnRx.spawnPromise)('hdiutil', ['unmount', '-force', '/Volumes/' + mount.mountPath]);

          case 3:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function unmountImage(_x2) {
    return _ref3.apply(this, arguments);
  };
}();