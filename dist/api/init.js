'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _bluebird = require('bluebird');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _initCustom = require('../init/init-custom');

var _initCustom2 = _interopRequireDefault(_initCustom);

var _initDirectory = require('../init/init-directory');

var _initDirectory2 = _interopRequireDefault(_initDirectory);

var _initGit = require('../init/init-git');

var _initGit2 = _interopRequireDefault(_initGit);

var _initNpm = require('../init/init-npm');

var _initNpm2 = _interopRequireDefault(_initNpm);

var _initStandardFix = require('../init/init-standard-fix');

var _initStandardFix2 = _interopRequireDefault(_initStandardFix);

var _initStarterFiles = require('../init/init-starter-files');

var _initStarterFiles2 = _interopRequireDefault(_initStarterFiles);

var _oraHandler = require('../util/ora-handler');

var _oraHandler2 = _interopRequireDefault(_oraHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var d = (0, _debug2.default)('electron-forge:init');

/**
 * @typedef {Object} InitOptions
 * @property {string} [dir=process.cwd()] The path to the app to be initialized
 * @property {boolean} [interactive=false] Whether to use sensible defaults or prompt the user visually
 * @property {string} [lintstyle=airbnb] The lintstyle to pass through to the template creator
 * @property {string} [template] The custom template to use. If left empty, the default template is used
 */

/**
 * Initialize a new Electron Forge template project in the given directory.
 *
 * @param {InitOptions} providedOptions - Options for the init method
 * @return {Promise} Will resolve when the initialization process is complete
 */

exports.default = function () {
  var _ref = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee() {
    var providedOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _Object$assign, dir, interactive, lintstyle, template;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // eslint-disable-next-line prefer-const, no-unused-vars
            _Object$assign = (0, _assign2.default)({
              dir: process.cwd(),
              interactive: false,
              lintstyle: 'airbnb',
              template: null
            }, providedOptions), dir = _Object$assign.dir, interactive = _Object$assign.interactive, lintstyle = _Object$assign.lintstyle, template = _Object$assign.template;

            _oraHandler2.default.interactive = interactive;

            d('Initializing in: ' + dir);

            if (!template) {
              lintstyle = lintstyle.toLowerCase();
              if (!['airbnb', 'standard'].includes(lintstyle)) {
                d('Unrecognized lintstyle argument: \'' + lintstyle + '\' -- defaulting to \'airbnb\'');
                lintstyle = 'airbnb';
              }
            }

            _context.next = 6;
            return (0, _initDirectory2.default)(dir, interactive);

          case 6:
            _context.next = 8;
            return (0, _initGit2.default)(dir);

          case 8:
            _context.next = 10;
            return (0, _initStarterFiles2.default)(dir, template ? undefined : lintstyle);

          case 10:
            _context.next = 12;
            return (0, _initNpm2.default)(dir, template ? undefined : lintstyle);

          case 12:
            if (template) {
              _context.next = 18;
              break;
            }

            if (!(lintstyle === 'standard')) {
              _context.next = 16;
              break;
            }

            _context.next = 16;
            return (0, _initStandardFix2.default)(dir);

          case 16:
            _context.next = 20;
            break;

          case 18:
            _context.next = 20;
            return (0, _initCustom2.default)(dir, template, lintstyle);

          case 20:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function () {
    return _ref.apply(this, arguments);
  };
}();