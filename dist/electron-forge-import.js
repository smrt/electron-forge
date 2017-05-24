'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _bluebird = require('bluebird');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

require('./util/terminate');

var _import = require('./api/import');

var _import2 = _interopRequireDefault(_import);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee() {
  var dir;
  return _regenerator2.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          dir = process.cwd();

          _commander2.default.version(require('../package.json').version).arguments('[name]').action(function (name) {
            if (!name) return;
            if (_path2.default.isAbsolute(name)) {
              dir = name;
            } else {
              dir = _path2.default.resolve(dir, name);
            }
          }).parse(process.argv);

          _context.next = 4;
          return (0, _import2.default)({
            dir: dir,
            interactive: true
          });

        case 4:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined);
}))();