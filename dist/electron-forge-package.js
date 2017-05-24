'use strict';

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

var _package = require('./api/package');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee() {
  var dir, packageOpts;
  return _regenerator2.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          dir = process.cwd();


          _commander2.default.version(require('../package.json').version).arguments('[cwd]').option('-a, --arch [arch]', 'Target architecture').option('-p, --platform [platform]', 'Target build platform').action(function (cwd) {
            if (!cwd) return;
            if (_path2.default.isAbsolute(cwd) && _fsPromise2.default.existsSync(cwd)) {
              dir = cwd;
            } else if (_fsPromise2.default.existsSync(_path2.default.resolve(dir, cwd))) {
              dir = _path2.default.resolve(dir, cwd);
            }
          }).parse(process.argv);

          packageOpts = {
            dir: dir,
            interactive: true
          };

          if (_commander2.default.arch) packageOpts.arch = _commander2.default.arch;
          if (_commander2.default.platform) packageOpts.platform = _commander2.default.platform;

          _context.next = 7;
          return (0, _package2.default)(packageOpts);

        case 7:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined);
}))();