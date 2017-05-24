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

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _bluebird = require('bluebird');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _formData = require('form-data');

var _formData2 = _interopRequireDefault(_formData);

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _oraHandler = require('../util/ora-handler');

var _oraHandler2 = _interopRequireDefault(_oraHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var d = (0, _debug2.default)('electron-forge:publish:ers');

var ersPlatform = function ersPlatform(platform, arch) {
  switch (platform) {
    case 'darwin':
      return 'osx_64';
    case 'linux':
      return arch === 'ia32' ? 'linux_32' : 'linux_64';
    case 'win32':
      return arch === 'ia32' ? 'windows_32' : 'windows_64';
    default:
      return platform;
  }
};

exports.default = function () {
  var _ref = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee3(artifacts, packageJSON, forgeConfig, authToken, tag, platform, arch) {
    var ersConfig, api, _ref2, token, authFetch, versions, existingVersion, channel, uploaded;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            ersConfig = forgeConfig.electronReleaseServer;

            if (ersConfig.baseUrl && ersConfig.username && ersConfig.password) {
              _context3.next = 3;
              break;
            }

            throw 'In order to publish to ERS you must set the "electronReleaseServer.baseUrl", "electronReleaseServer.username" and "electronReleaseServer.password" properties in your forge config. See the docs for more info';

          case 3:

            d('attempting to authenticate to ERS');

            api = function api(apiPath) {
              return ersConfig.baseUrl + '/' + apiPath;
            };

            _context3.next = 7;
            return (0, _nodeFetch2.default)(api('api/auth/login'), {
              method: 'POST',
              body: (0, _stringify2.default)({
                username: ersConfig.username,
                password: ersConfig.password
              }),
              headers: {
                'Content-Type': 'application/json'
              }
            });

          case 7:
            _context3.next = 9;
            return _context3.sent.json();

          case 9:
            _ref2 = _context3.sent;
            token = _ref2.token;

            authFetch = function authFetch(apiPath, options) {
              return (0, _nodeFetch2.default)(api(apiPath), (0, _assign2.default)({}, options || {}, {
                headers: (0, _assign2.default)({}, (options || {}).headers, { Authorization: 'Bearer ' + token })
              }));
            };

            _context3.next = 14;
            return authFetch('api/version');

          case 14:
            _context3.next = 16;
            return _context3.sent.json();

          case 16:
            versions = _context3.sent;
            existingVersion = versions.find(function (version) {
              return version.name === packageJSON.version;
            });
            channel = 'stable';

            if (packageJSON.version.indexOf('beta') !== -1) {
              channel = 'beta';
            }
            if (packageJSON.version.indexOf('alpha') !== -1) {
              channel = 'alpha';
            }

            if (existingVersion) {
              _context3.next = 24;
              break;
            }

            _context3.next = 24;
            return authFetch('api/version', {
              method: 'POST',
              body: (0, _stringify2.default)({
                channel: {
                  name: channel
                },
                name: packageJSON.version,
                notes: ''
              }),
              headers: {
                'Content-Type': 'application/json'
              }
            });

          case 24:
            uploaded = 0;
            _context3.next = 27;
            return (0, _oraHandler2.default)('Uploading Artifacts ' + uploaded + '/' + artifacts.length, function () {
              var _ref3 = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee2(uploadSpinner) {
                var updateSpinner;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        updateSpinner = function updateSpinner() {
                          uploadSpinner.text = 'Uploading Artifacts ' + uploaded + '/' + artifacts.length; // eslint-disable-line no-param-reassign
                        };

                        _context2.next = 3;
                        return _promise2.default.all(artifacts.map(function (artifactPath) {
                          return new _promise2.default(function () {
                            var _ref4 = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee(resolve, reject) {
                              var existingAsset, artifactForm;
                              return _regenerator2.default.wrap(function _callee$(_context) {
                                while (1) {
                                  switch (_context.prev = _context.next) {
                                    case 0:
                                      if (!existingVersion) {
                                        _context.next = 7;
                                        break;
                                      }

                                      existingAsset = existingVersion.assets.find(function (asset) {
                                        return asset.name === _path2.default.basename(artifactPath);
                                      });

                                      if (!existingAsset) {
                                        _context.next = 7;
                                        break;
                                      }

                                      d('asset at path:', artifactPath, 'already exists on server');
                                      uploaded += 1;
                                      updateSpinner();
                                      return _context.abrupt('return');

                                    case 7:
                                      _context.prev = 7;

                                      d('attempting to upload asset:', artifactPath);
                                      artifactForm = new _formData2.default();

                                      artifactForm.append('token', token);
                                      artifactForm.append('version', packageJSON.version);
                                      artifactForm.append('platform', ersPlatform(platform, arch));
                                      artifactForm.append('file', _fsPromise2.default.createReadStream(artifactPath));
                                      _context.next = 16;
                                      return authFetch('api/asset', {
                                        method: 'POST',
                                        body: artifactForm,
                                        headers: artifactForm.getHeaders()
                                      });

                                    case 16:
                                      d('upload successful for asset:', artifactPath);
                                      uploaded += 1;
                                      updateSpinner();
                                      _context.next = 24;
                                      break;

                                    case 21:
                                      _context.prev = 21;
                                      _context.t0 = _context['catch'](7);

                                      reject(_context.t0);

                                    case 24:
                                    case 'end':
                                      return _context.stop();
                                  }
                                }
                              }, _callee, undefined, [[7, 21]]);
                            }));

                            return function (_x9, _x10) {
                              return _ref4.apply(this, arguments);
                            };
                          }());
                        }));

                      case 3:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, undefined);
              }));

              return function (_x8) {
                return _ref3.apply(this, arguments);
              };
            }());

          case 27:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x, _x2, _x3, _x4, _x5, _x6, _x7) {
    return _ref.apply(this, arguments);
  };
}();