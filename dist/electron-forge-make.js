'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMakeOptions = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _bluebird = require('bluebird');

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

require('./util/terminate');

var _api = require('./api');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line import/prefer-default-export
var getMakeOptions = exports.getMakeOptions = function getMakeOptions() {
  var dir = process.cwd();
  _commander2.default.version(require('../package.json').version).arguments('[cwd]').option('--skip-package', 'Assume the app is already packaged').option('-a, --arch [arch]', 'Target architecture').option('-p, --platform [platform]', 'Target build platform').option('--targets [targets]', 'Override your make targets for this run').allowUnknownOption(true).action(function (cwd) {
    if (!cwd) return;
    if (_path2.default.isAbsolute(cwd) && _fsPromise2.default.existsSync(cwd)) {
      dir = cwd;
    } else if (_fsPromise2.default.existsSync(_path2.default.resolve(dir, cwd))) {
      dir = _path2.default.resolve(dir, cwd);
    }
  }).parse(process.argv);

  var makeOpts = {
    dir: dir,
    interactive: true,
    skipPackage: _commander2.default.skipPackage
  };
  if (_commander2.default.targets) makeOpts.overrideTargets = _commander2.default.targets.split(',');
  if (_commander2.default.arch) makeOpts.arch = _commander2.default.arch;
  if (_commander2.default.platform) makeOpts.platform = _commander2.default.platform;

  return makeOpts;
};

if (process.mainModule === module || global.__LINKED_FORGE__) {
  (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee() {
    var makeOpts;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            makeOpts = getMakeOptions();
            _context.next = 3;
            return (0, _api.make)(makeOpts);

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }))();
}