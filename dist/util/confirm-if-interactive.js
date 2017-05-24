'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _bluebird = require('bluebird');

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee(interactive, message) {
    var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!interactive) {
              _context.next = 4;
              break;
            }

            _context.next = 3;
            return _inquirer2.default.createPromptModule()({
              type: 'confirm',
              name: 'confirm',
              message: message
            });

          case 3:
            return _context.abrupt('return', _context.sent.confirm);

          case 4:
            return _context.abrupt('return', defaultValue);

          case 5:
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