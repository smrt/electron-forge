'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _bluebird = require('bluebird');

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _pify = require('pify');

var _pify2 = _interopRequireDefault(_pify);

var _sudoPrompt = require('sudo-prompt');

var _sudoPrompt2 = _interopRequireDefault(_sudoPrompt);

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee(appPath, targetApplicationPath, spinner) {
    var copyInstead = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    var writeAccess, _ref2, confirm, moveCommand;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            writeAccess = true;
            _context.prev = 1;
            _context.next = 4;
            return _fsPromise2.default.access('/Applications', _fsPromise2.default.W_OK);

          case 4:
            _context.next = 9;
            break;

          case 6:
            _context.prev = 6;
            _context.t0 = _context['catch'](1);

            writeAccess = false;

          case 9:
            _context.next = 11;
            return _fsPromise2.default.exists(targetApplicationPath);

          case 11:
            if (!_context.sent) {
              _context.next = 24;
              break;
            }

            spinner.stop();
            _context.next = 15;
            return _inquirer2.default.createPromptModule()({
              type: 'confirm',
              name: 'confirm',
              message: 'The application "' + _path2.default.basename(targetApplicationPath) + '" appears to already exist in /Applications. Do you want to replace it?'
            });

          case 15:
            _ref2 = _context.sent;
            confirm = _ref2.confirm;

            if (confirm) {
              _context.next = 21;
              break;
            }

            throw 'Installation stopped by user';

          case 21:
            spinner.start();
            _context.next = 24;
            return _fsPromise2.default.remove(targetApplicationPath);

          case 24:
            moveCommand = (copyInstead ? 'cp -r' : 'mv') + ' "' + appPath + '" "' + targetApplicationPath + '"';

            if (!writeAccess) {
              _context.next = 30;
              break;
            }

            _context.next = 28;
            return (0, _pify2.default)(_child_process.exec)(moveCommand);

          case 28:
            _context.next = 32;
            break;

          case 30:
            _context.next = 32;
            return (0, _pify2.default)(_sudoPrompt2.default.exec)(moveCommand, {
              name: 'Electron Forge'
            });

          case 32:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[1, 6]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();