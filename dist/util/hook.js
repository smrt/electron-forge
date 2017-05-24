'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _bluebird = require('bluebird');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var d = (0, _debug2.default)('electron-forge:hook');

exports.default = function () {
  var _ref = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee(forgeConfig, hookName) {
    for (var _len = arguments.length, hookArgs = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      hookArgs[_key - 2] = arguments[_key];
    }

    var hooks;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            hooks = forgeConfig.hooks || {};

            if (!(typeof hooks[hookName] === 'function')) {
              _context.next = 7;
              break;
            }

            d('calling hook:', hookName, 'with args:', hookArgs);
            _context.next = 5;
            return hooks[hookName].apply(hooks, [forgeConfig].concat(hookArgs));

          case 5:
            _context.next = 8;
            break;

          case 7:
            d('could not find hook:', hookName);

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();