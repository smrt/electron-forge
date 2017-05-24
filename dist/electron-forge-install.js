'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _bluebird = require('bluebird');

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

require('./util/terminate');

var _api = require('./api');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee() {
  var repo;
  return _regenerator2.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          repo = void 0;


          _commander2.default.version(require('../package.json').version).arguments('[repository]').option('--prerelease', 'Fetch prerelease versions').action(function (repository) {
            repo = repository;
          }).parse(process.argv);

          _context.next = 4;
          return (0, _api.install)({
            repo: repo,
            interactive: true,
            prerelease: _commander2.default.prerelease
          });

        case 4:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined);
}))();