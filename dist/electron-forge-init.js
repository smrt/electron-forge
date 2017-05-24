'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _bluebird = require('bluebird');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

require('./util/terminate');

var _api = require('./api');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee() {
  var dir, initOpts;
  return _regenerator2.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          dir = process.cwd();

          _commander2.default.version(require('../package.json').version).arguments('[name]').option('-t, --template [name]', 'Name of the forge template to use').option('-l, --lintstyle [style]', 'Linting standard to follow.  For the default template it can be "airbnb" or "standard"', 'airbnb').action(function (name) {
            if (!name) return;
            if (_path2.default.isAbsolute(name)) {
              dir = name;
            } else {
              dir = _path2.default.resolve(dir, name);
            }
          }).parse(process.argv);

          initOpts = {
            dir: dir,
            interactive: true,
            lintstyle: _commander2.default.lintstyle
          };

          if (_commander2.default.template) initOpts.template = _commander2.default.template;

          _context.next = 6;
          return (0, _api.init)(initOpts);

        case 6:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined);
}))();