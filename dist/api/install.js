'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _bluebird = require('bluebird');

require('colors');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _nugget = require('nugget');

var _nugget2 = _interopRequireDefault(_nugget);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _pify = require('pify');

var _pify2 = _interopRequireDefault(_pify);

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _oraHandler = require('../util/ora-handler');

var _oraHandler2 = _interopRequireDefault(_oraHandler);

var _messages = require('../util/messages');

var _dmg = require('../installers/darwin/dmg');

var _dmg2 = _interopRequireDefault(_dmg);

var _zip = require('../installers/darwin/zip');

var _zip2 = _interopRequireDefault(_zip);

var _deb = require('../installers/linux/deb');

var _deb2 = _interopRequireDefault(_deb);

var _rpm = require('../installers/linux/rpm');

var _rpm2 = _interopRequireDefault(_rpm);

var _exe = require('../installers/win32/exe');

var _exe2 = _interopRequireDefault(_exe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var d = (0, _debug2.default)('electron-forge:install');

var GITHUB_API = 'https://api.github.com';

/**
 * @typedef {Object} InstallOptions
 * @property {boolean} [interactive=false] Whether to use sensible defaults or prompt the user visually
 * @property {boolean} [prerelease=false] Whether to install prerelease versions
 * @property {string} repo The GitHub repository to install from, in the format owner/name
 * @property {function} chooseAsset A function that must return the asset to use/install from a provided array of compatible GitHub assets
 */

/**
 * Install an Electron application from GitHub. If you leave interactive as `false`, you MUST provide a `chooseAsset` function.
 *
 * @param {InstallOptions} providedOptions - Options for the install method
 * @return {Promise} Will resolve when the install process is complete
 */

exports.default = function () {
  var _ref = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee3() {
    var providedOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _Object$assign, interactive, prerelease, repo, chooseAsset, latestRelease, possibleAssets, targetAsset, choices, _ref3, assetID, tmpdir, pathSafeRepo, filename, fullFilePath, nuggetOpts;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            // eslint-disable-next-line prefer-const, no-unused-vars
            _Object$assign = (0, _assign2.default)({
              interactive: false,
              prerelease: false
            }, providedOptions), interactive = _Object$assign.interactive, prerelease = _Object$assign.prerelease, repo = _Object$assign.repo, chooseAsset = _Object$assign.chooseAsset;

            _oraHandler2.default.interactive = interactive;

            latestRelease = void 0;
            possibleAssets = [];
            _context3.next = 6;
            return (0, _oraHandler2.default)('Searching for Application', function () {
              var _ref2 = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee(searchSpinner) {
                var releases, sortedReleases, assets, installTargets;
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!(!repo || repo.indexOf('/') === -1)) {
                          _context.next = 2;
                          break;
                        }

                        throw 'Invalid repository name, must be in the format owner/name';

                      case 2:

                        d('searching for repo:', repo);
                        releases = void 0;
                        _context.prev = 4;
                        _context.next = 7;
                        return (0, _nodeFetch2.default)(GITHUB_API + '/repos/' + repo + '/releases');

                      case 7:
                        _context.next = 9;
                        return _context.sent.json();

                      case 9:
                        releases = _context.sent;
                        _context.next = 14;
                        break;

                      case 12:
                        _context.prev = 12;
                        _context.t0 = _context['catch'](4);

                      case 14:
                        if (!(!releases || releases.message === 'Not Found' || !Array.isArray(releases))) {
                          _context.next = 16;
                          break;
                        }

                        throw 'Failed to find releases for repository "' + repo + '".  Please check the name and try again.';

                      case 16:

                        releases = releases.filter(function (release) {
                          return !release.prerelease || prerelease;
                        });

                        sortedReleases = releases.sort(function (releaseA, releaseB) {
                          var tagA = releaseA.tag_name;
                          if (tagA.substr(0, 1) === 'v') tagA = tagA.substr(1);
                          var tagB = releaseB.tag_name;
                          if (tagB.substr(0, 1) === 'v') tagB = tagB.substr(1);
                          return _semver2.default.gt(tagB, tagA) ? 1 : -1;
                        });

                        latestRelease = sortedReleases[0];

                        searchSpinner.text = 'Searching for Releases'; // eslint-disable-line

                        assets = latestRelease.assets;

                        if (!(!assets || !Array.isArray(assets))) {
                          _context.next = 23;
                          break;
                        }

                        throw 'Could not find any assets for the latest release';

                      case 23:
                        installTargets = {
                          win32: [/\.exe$/],
                          darwin: [/OSX.*\.zip$/, /darwin.*\.zip$/, /macOS.*\.zip$/, /mac.*\.zip$/, /\.dmg$/],
                          linux: [/\.rpm$/, /\.deb$/]
                        };


                        possibleAssets = assets.filter(function (asset) {
                          var targetSuffixes = installTargets[process.platform];
                          var _iteratorNormalCompletion = true;
                          var _didIteratorError = false;
                          var _iteratorError = undefined;

                          try {
                            for (var _iterator = (0, _getIterator3.default)(targetSuffixes), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                              var suffix = _step.value;

                              if (suffix.test(asset.name)) return true;
                            }
                          } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                          } finally {
                            try {
                              if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                              }
                            } finally {
                              if (_didIteratorError) {
                                throw _iteratorError;
                              }
                            }
                          }

                          return false;
                        });

                        if (!(possibleAssets.length === 0)) {
                          _context.next = 27;
                          break;
                        }

                        throw 'Failed to find any installable assets for target platform: ' + ('' + process.platform).cyan;

                      case 27:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined, [[4, 12]]);
              }));

              return function (_x2) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 6:

            (0, _messages.info)(interactive, 'Found latest release' + (prerelease ? ' (including prereleases)' : '') + ': ' + latestRelease.tag_name.cyan);

            targetAsset = possibleAssets[0];

            if (!(possibleAssets.length > 1)) {
              _context3.next = 26;
              break;
            }

            if (!chooseAsset) {
              _context3.next = 15;
              break;
            }

            _context3.next = 12;
            return _promise2.default.resolve(chooseAsset(possibleAssets));

          case 12:
            targetAsset = _context3.sent;
            _context3.next = 26;
            break;

          case 15:
            if (!interactive) {
              _context3.next = 25;
              break;
            }

            choices = [];

            possibleAssets.forEach(function (asset) {
              choices.push({ name: asset.name, value: asset.id });
            });
            _context3.next = 20;
            return _inquirer2.default.createPromptModule()({
              type: 'list',
              name: 'assetID',
              message: 'Multiple potential assets found, please choose one from the list below:'.cyan,
              choices: choices
            });

          case 20:
            _ref3 = _context3.sent;
            assetID = _ref3.assetID;


            targetAsset = possibleAssets.find(function (asset) {
              return asset.id === assetID;
            });
            _context3.next = 26;
            break;

          case 25:
            throw 'expected a chooseAsset function to be provided but it was not';

          case 26:
            tmpdir = _path2.default.resolve(_os2.default.tmpdir(), 'forge-install');
            pathSafeRepo = repo.replace(/[/\\]/g, '-');
            filename = pathSafeRepo + '-' + latestRelease.tag_name + '-' + targetAsset.name;
            fullFilePath = _path2.default.resolve(tmpdir, filename);
            _context3.next = 32;
            return _fsPromise2.default.exists(fullFilePath);

          case 32:
            _context3.t0 = !_context3.sent;

            if (_context3.t0) {
              _context3.next = 39;
              break;
            }

            _context3.next = 36;
            return _fsPromise2.default.stat(fullFilePath);

          case 36:
            _context3.t1 = _context3.sent.size;
            _context3.t2 = targetAsset.size;
            _context3.t0 = _context3.t1 !== _context3.t2;

          case 39:
            if (!_context3.t0) {
              _context3.next = 45;
              break;
            }

            _context3.next = 42;
            return _fsPromise2.default.mkdirs(tmpdir);

          case 42:
            nuggetOpts = {
              target: filename,
              dir: tmpdir,
              resume: true,
              strictSSL: true
            };
            _context3.next = 45;
            return (0, _pify2.default)(_nugget2.default)(targetAsset.browser_download_url, nuggetOpts);

          case 45:
            _context3.next = 47;
            return (0, _oraHandler2.default)('Installing Application', function () {
              var _ref4 = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee2(installSpinner) {
                var installActions, suffixFnIdent;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        installActions = {
                          win32: {
                            '.exe': _exe2.default
                          },
                          darwin: {
                            '.zip': _zip2.default,
                            '.dmg': _dmg2.default
                          },
                          linux: {
                            '.deb': _deb2.default,
                            '.rpm': _rpm2.default
                          }
                        };
                        suffixFnIdent = (0, _keys2.default)(installActions[process.platform]).find(function (suffix) {
                          return targetAsset.name.endsWith(suffix);
                        });
                        _context2.next = 4;
                        return installActions[process.platform][suffixFnIdent](fullFilePath, installSpinner);

                      case 4:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, undefined);
              }));

              return function (_x3) {
                return _ref4.apply(this, arguments);
              };
            }());

          case 47:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function () {
    return _ref.apply(this, arguments);
  };
}();