'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _bluebird = require('bluebird');

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash.template');

var _lodash2 = _interopRequireDefault(_lodash);

var _readPackageJson = require('./read-package-json');

var _readPackageJson2 = _interopRequireDefault(_readPackageJson);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var underscoreCase = function underscoreCase(str) {
  return str.replace(/(.)([A-Z][a-z]+)/g, '$1_$2').replace(/([a-z0-9])([A-Z])/g, '$1_$2').toUpperCase();
};

var proxify = function proxify(object, envPrefix) {
  var newObject = {};

  (0, _keys2.default)(object).forEach(function (key) {
    if ((0, _typeof3.default)(object[key]) === 'object' && !Array.isArray(object[key])) {
      newObject[key] = proxify(object[key], envPrefix + '_' + underscoreCase(key));
    } else {
      newObject[key] = object[key];
    }
  });

  return new Proxy(newObject, {
    get: function get(target, name) {
      if (target.hasOwnProperty(name)) return target[name]; // eslint-disable-line no-prototype-builtins
      if (typeof name === 'string') {
        var envValue = process.env[envPrefix + '_' + underscoreCase(name)];
        if (envValue) return envValue;
      }
    }
  });
};

exports.default = function () {
  var _ref = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee(dir) {
    var packageJSON, forgeConfig, templateObj, template;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _readPackageJson2.default)(dir);

          case 2:
            packageJSON = _context.sent;
            forgeConfig = packageJSON.config.forge;
            _context.t0 = typeof forgeConfig === 'string';

            if (!_context.t0) {
              _context.next = 14;
              break;
            }

            _context.next = 8;
            return _fsPromise2.default.exists(_path2.default.resolve(dir, forgeConfig));

          case 8:
            _context.t1 = _context.sent;

            if (_context.t1) {
              _context.next = 13;
              break;
            }

            _context.next = 12;
            return _fsPromise2.default.exists(_path2.default.resolve(dir, forgeConfig + '.js'));

          case 12:
            _context.t1 = _context.sent;

          case 13:
            _context.t0 = _context.t1;

          case 14:
            if (!_context.t0) {
              _context.next = 25;
              break;
            }

            _context.prev = 15;

            forgeConfig = require(_path2.default.resolve(dir, forgeConfig));
            _context.next = 23;
            break;

          case 19:
            _context.prev = 19;
            _context.t2 = _context['catch'](15);

            console.error('Failed to load: ' + _path2.default.resolve(dir, forgeConfig));
            throw _context.t2;

          case 23:
            _context.next = 27;
            break;

          case 25:
            if (!((typeof forgeConfig === 'undefined' ? 'undefined' : (0, _typeof3.default)(forgeConfig)) !== 'object')) {
              _context.next = 27;
              break;
            }

            throw new Error('Expected packageJSON.config.forge to be an object or point to a requirable JS file');

          case 27:
            forgeConfig = (0, _assign2.default)({
              make_targets: {},
              publish_targets: {},
              electronPackagerConfig: {},
              electronWinstallerConfig: {},
              electronInstallerDebian: {},
              electronInstallerDMG: {},
              electronInstallerRedhat: {},
              s3: {},
              github_repository: {}
            }, forgeConfig);
            forgeConfig.make_targets = (0, _assign2.default)({
              win32: ['squirrel'],
              darwin: ['zip'],
              mas: ['zip'],
              linux: ['deb', 'rpm']
            }, forgeConfig.make_targets);
            forgeConfig.publish_targets = (0, _assign2.default)({
              win32: ['github'],
              darwin: ['github'],
              mas: ['github'],
              linux: ['github']
            }, forgeConfig.publish_targets);

            templateObj = (0, _assign2.default)({}, packageJSON, { year: new Date().getFullYear() });

            template = function template(obj) {
              (0, _keys2.default)(obj).forEach(function (objKey) {
                if ((0, _typeof3.default)(obj[objKey]) === 'object' && obj !== null) {
                  template(obj[objKey]);
                } else if (typeof obj[objKey] === 'string') {
                  obj[objKey] = (0, _lodash2.default)(obj[objKey])(templateObj); // eslint-disable-line
                  if (obj[objKey].startsWith('require:')) {
                    obj[objKey] = require(_path2.default.resolve(dir, obj[objKey].substr(8))); // eslint-disable-line
                  }
                }
              });
            };

            template(forgeConfig);

            return _context.abrupt('return', proxify(forgeConfig, 'ELECTRON_FORGE'));

          case 34:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[15, 19]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();