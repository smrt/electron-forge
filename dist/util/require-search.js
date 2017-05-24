'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.requireSearchRaw = requireSearchRaw;

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var d = (0, _debug2.default)('electron-forge:require-search');

function requireSearchRaw(relativeTo, paths) {
  var testPaths = paths.concat(paths.map(function (mapPath) {
    return _path2.default.resolve(relativeTo, mapPath);
  })).concat(paths.map(function (mapPath) {
    return _path2.default.resolve(relativeTo, 'node_modules', mapPath);
  }));
  d('searching', testPaths, 'relative to', relativeTo);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)(testPaths), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var testPath = _step.value;

      try {
        d('testing', testPath);
        return require(testPath);
      } catch (err) {
        // Ignore the error
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  d('failed to find a module in', testPaths);
}

exports.default = function (relativeTo, paths) {
  var result = requireSearchRaw(relativeTo, paths);
  return (typeof result === 'undefined' ? 'undefined' : (0, _typeof3.default)(result)) === 'object' && result && result.default ? result.default : result;
};