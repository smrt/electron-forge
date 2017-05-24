'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _bluebird = require('bluebird');

require('colors');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _yarnOrNpm = require('yarn-or-npm');

var _oraHandler = require('../util/ora-handler');

var _oraHandler2 = _interopRequireDefault(_oraHandler);

var _resolveDir = require('../util/resolve-dir');

var _resolveDir2 = _interopRequireDefault(_resolveDir);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var d = (0, _debug2.default)('electron-forge:lint');

/**
 * @typedef {Object} LintOptions
 * @property {string} [dir=process.cwd()] The path to the module to import
 * @property {boolean} [interactive=false] Whether to use sensible defaults or prompt the user visually
 */

/**
 * Lint a local Electron application.
 *
 * The promise will be rejected with the stdout+stderr of the linting process if linting fails or
 * will be resolved if it succeeds.
 *
 * @param {LintOptions} providedOptions - Options for the Lint method
 * @return {Promise<null, string>} Will resolve when the lint process is complete
 */

exports.default = function () {
  var _ref = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee2() {
    var providedOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _Object$assign, dir, interactive, success, result;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // eslint-disable-next-line prefer-const, no-unused-vars
            _Object$assign = (0, _assign2.default)({
              dir: process.cwd(),
              interactive: false
            }, providedOptions), dir = _Object$assign.dir, interactive = _Object$assign.interactive;

            _oraHandler2.default.interactive = interactive;

            success = true;
            result = null;
            _context2.next = 6;
            return (0, _oraHandler2.default)('Linting Application', function () {
              var _ref2 = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee(lintSpinner) {
                var child, output;
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return (0, _resolveDir2.default)(dir);

                      case 2:
                        dir = _context.sent;

                        if (dir) {
                          _context.next = 5;
                          break;
                        }

                        throw 'Failed to locate lintable Electron application';

                      case 5:

                        d('executing "run lint -- --color" in dir:', dir);
                        child = (0, _yarnOrNpm.spawn)(['run', 'lint', '--', '--color'], {
                          stdio: process.platform === 'win32' ? 'inherit' : 'pipe',
                          cwd: dir
                        });
                        output = [];

                        if (process.platform !== 'win32') {
                          child.stdout.on('data', function (data) {
                            return output.push(data.toString());
                          });
                          child.stderr.on('data', function (data) {
                            return output.push(data.toString().red);
                          });
                        }
                        _context.next = 11;
                        return new _promise2.default(function (resolve) {
                          child.on('exit', function (code) {
                            if (code !== 0) {
                              success = false;
                              lintSpinner.fail();
                              if (interactive) {
                                output.forEach(function (data) {
                                  return process.stdout.write(data);
                                });
                                process.exit(code);
                              } else {
                                result = output.join('');
                              }
                            }
                            resolve();
                          });
                        });

                      case 11:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined);
              }));

              return function (_x2) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 6:
            if (success) {
              _context2.next = 8;
              break;
            }

            throw result;

          case 8:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function () {
    return _ref.apply(this, arguments);
  };
}();