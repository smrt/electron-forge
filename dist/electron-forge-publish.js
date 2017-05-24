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

var _api = require('./api');

var _electronForgeMake = require('./electron-forge-make');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee() {
  var dir, publishOpts;
  return _regenerator2.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          dir = process.cwd();

          _commander2.default.version(require('../package.json').version).arguments('[cwd]').option('--auth-token', 'Authorization token for your publisher target (if required)').option('--tag', 'The tag to publish to on GitHub').option('--target [target]', 'The deployment target, defaults to "github"').allowUnknownOption(true).action(function (cwd) {
            if (!cwd) return;
            if (_path2.default.isAbsolute(cwd) && _fsPromise2.default.existsSync(cwd)) {
              dir = cwd;
            } else if (_fsPromise2.default.existsSync(_path2.default.resolve(dir, cwd))) {
              dir = _path2.default.resolve(dir, cwd);
            }
          }).parse(process.argv);

          publishOpts = {
            dir: dir,
            interactive: true,
            authToken: _commander2.default.authToken,
            tag: _commander2.default.tag
          };

          if (_commander2.default.target) publishOpts.target = _commander2.default.target.split(',');

          publishOpts.makeOptions = (0, _electronForgeMake.getMakeOptions)();

          _context.next = 7;
          return (0, _api.publish)(publishOpts);

        case 7:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined);
}))();