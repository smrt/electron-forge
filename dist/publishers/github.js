'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _bluebird = require('bluebird');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _oraHandler = require('../util/ora-handler');

var _oraHandler2 = _interopRequireDefault(_oraHandler);

var _github = require('../util/github');

var _github2 = _interopRequireDefault(_github);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee4(artifacts, packageJSON, forgeConfig, authToken, tag) {
    var github, release, uploaded;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (forgeConfig.github_repository && (0, _typeof3.default)(forgeConfig.github_repository) === 'object' && forgeConfig.github_repository.owner && forgeConfig.github_repository.name) {
              _context4.next = 2;
              break;
            }

            throw 'In order to publish to github you must set the "github_repository.owner" and "github_repository.name" properties in your forge config. See the docs for more info';

          case 2:
            github = new _github2.default(authToken, true);
            release = void 0;
            _context4.next = 6;
            return (0, _oraHandler2.default)('Searching for target Release', (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee() {
              return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.prev = 0;
                      _context.next = 3;
                      return github.getGitHub().repos.getReleases({
                        owner: forgeConfig.github_repository.owner,
                        repo: forgeConfig.github_repository.name,
                        per_page: 100
                      });

                    case 3:
                      _context.t0 = function (testRelease) {
                        return testRelease.tag_name === (tag || 'v' + packageJSON.version);
                      };

                      release = _context.sent.data.find(_context.t0);

                      if (release) {
                        _context.next = 7;
                        break;
                      }

                      throw { code: 404 };

                    case 7:
                      _context.next = 18;
                      break;

                    case 9:
                      _context.prev = 9;
                      _context.t1 = _context['catch'](0);

                      if (!(_context.t1.code === 404)) {
                        _context.next = 17;
                        break;
                      }

                      _context.next = 14;
                      return github.getGitHub().repos.createRelease({
                        owner: forgeConfig.github_repository.owner,
                        repo: forgeConfig.github_repository.name,
                        tag_name: tag || 'v' + packageJSON.version,
                        name: tag || 'v' + packageJSON.version,
                        draft: forgeConfig.github_repository.draft !== false,
                        prerelease: forgeConfig.github_repository.prerelease === true
                      });

                    case 14:
                      release = _context.sent.data;
                      _context.next = 18;
                      break;

                    case 17:
                      throw _context.t1;

                    case 18:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _callee, undefined, [[0, 9]]);
            })));

          case 6:
            uploaded = 0;
            _context4.next = 9;
            return (0, _oraHandler2.default)('Uploading Artifacts ' + uploaded + '/' + artifacts.length, function () {
              var _ref3 = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee3(uploadSpinner) {
                var updateSpinner;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        updateSpinner = function updateSpinner() {
                          uploadSpinner.text = 'Uploading Artifacts ' + uploaded + '/' + artifacts.length; // eslint-disable-line
                        };

                        _context3.next = 3;
                        return _promise2.default.all(artifacts.map(function (artifactPath) {
                          return new _promise2.default(function () {
                            var _ref4 = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee2(resolve) {
                              var done;
                              return _regenerator2.default.wrap(function _callee2$(_context2) {
                                while (1) {
                                  switch (_context2.prev = _context2.next) {
                                    case 0:
                                      done = function done() {
                                        uploaded += 1;
                                        updateSpinner();
                                        resolve();
                                      };

                                      if (!release.assets.find(function (asset) {
                                        return asset.name === _path2.default.basename(artifactPath);
                                      })) {
                                        _context2.next = 3;
                                        break;
                                      }

                                      return _context2.abrupt('return', done());

                                    case 3:
                                      _context2.next = 5;
                                      return github.getGitHub().repos.uploadAsset({
                                        owner: forgeConfig.github_repository.owner,
                                        repo: forgeConfig.github_repository.name,
                                        id: release.id,
                                        filePath: artifactPath,
                                        name: _path2.default.basename(artifactPath)
                                      });

                                    case 5:
                                      return _context2.abrupt('return', done());

                                    case 6:
                                    case 'end':
                                      return _context2.stop();
                                  }
                                }
                              }, _callee2, undefined);
                            }));

                            return function (_x7) {
                              return _ref4.apply(this, arguments);
                            };
                          }());
                        }));

                      case 3:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                }, _callee3, undefined);
              }));

              return function (_x6) {
                return _ref3.apply(this, arguments);
              };
            }());

          case 9:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function (_x, _x2, _x3, _x4, _x5) {
    return _ref.apply(this, arguments);
  };
}();