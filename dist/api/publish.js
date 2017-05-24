'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _bluebird = require('bluebird');

require('colors');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _oraHandler = require('../util/ora-handler');

var _oraHandler2 = _interopRequireDefault(_oraHandler);

var _deprecate = require('../util/deprecate');

var _deprecate2 = _interopRequireDefault(_deprecate);

var _forgeConfig = require('../util/forge-config');

var _forgeConfig2 = _interopRequireDefault(_forgeConfig);

var _readPackageJson = require('../util/read-package-json');

var _readPackageJson2 = _interopRequireDefault(_readPackageJson);

var _requireSearch = require('../util/require-search');

var _requireSearch2 = _interopRequireDefault(_requireSearch);

var _resolveDir = require('../util/resolve-dir');

var _resolveDir2 = _interopRequireDefault(_resolveDir);

var _make = require('./make');

var _make2 = _interopRequireDefault(_make);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {Object} PublishOptions
 * @property {string} [dir=process.cwd()] The path to the app to be published
 * @property {boolean} [interactive=false] Whether to use sensible defaults or prompt the user visually
 * @property {string} [authToken] An authentication token to use when publishing
 * @property {string} [tag=packageJSON.version] The string to tag this release with
 * @property {string} [target=github] The publish target
 * @property {MakeOptions} [makeOptions] Options object to passed through to make()
 */

/**
 * Publish an Electron application into the given target service.
 *
 * @param {PublishOptions} providedOptions - Options for the Publish method
 * @return {Promise} Will resolve when the publish process is complete
 */
exports.default = function () {
  var _ref = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee2() {
    var providedOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _Object$assign, dir, interactive, authToken, tag, target, makeOptions, publishTargets, makeResults, artifacts, packageJSON, forgeConfig, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

    return _regenerator2.default.wrap(function _callee2$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            // eslint-disable-next-line prefer-const, no-unused-vars
            _Object$assign = (0, _assign2.default)({
              dir: process.cwd(),
              interactive: false,
              tag: null,
              makeOptions: {},
              target: null
            }, providedOptions), dir = _Object$assign.dir, interactive = _Object$assign.interactive, authToken = _Object$assign.authToken, tag = _Object$assign.tag, target = _Object$assign.target, makeOptions = _Object$assign.makeOptions;

            _oraHandler2.default.interactive = interactive;
            // FIXME(MarshallOfSound): Change the method param to publishTargets in the next major bump
            publishTargets = target;
            _context3.next = 5;
            return (0, _make2.default)((0, _assign2.default)({
              dir: dir,
              interactive: interactive
            }, makeOptions));

          case 5:
            makeResults = _context3.sent;
            _context3.next = 8;
            return (0, _resolveDir2.default)(dir);

          case 8:
            dir = _context3.sent;

            if (dir) {
              _context3.next = 11;
              break;
            }

            throw 'Failed to locate publishable Electron application';

          case 11:
            artifacts = makeResults.reduce(function (accum, arr) {
              accum.push.apply(accum, (0, _toConsumableArray3.default)(arr));
              return accum;
            }, []);
            _context3.next = 14;
            return (0, _readPackageJson2.default)(dir);

          case 14:
            packageJSON = _context3.sent;
            _context3.next = 17;
            return (0, _forgeConfig2.default)(dir);

          case 17:
            forgeConfig = _context3.sent;


            if (publishTargets === null) {
              publishTargets = forgeConfig.publish_targets[makeOptions.platform || process.platform];
            } else if (typeof publishTargets === 'string') {
              // FIXME(MarshallOfSound): Remove this fallback string typeof check in the next major bump
              (0, _deprecate2.default)('publish target as a string').replaceWith('an array of publish targets');
              publishTargets = [publishTargets];
            }

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context3.prev = 22;
            _loop = _regenerator2.default.mark(function _loop() {
              var publishTarget, publisher;
              return _regenerator2.default.wrap(function _loop$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      publishTarget = _step.value;
                      publisher = void 0;
                      _context2.next = 4;
                      return (0, _oraHandler2.default)('Resolving publish target: ' + ('' + publishTarget).cyan, (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee() {
                        return _regenerator2.default.wrap(function _callee$(_context) {
                          while (1) {
                            switch (_context.prev = _context.next) {
                              case 0:
                                // eslint-disable-line no-loop-func
                                publisher = (0, _requireSearch2.default)(__dirname, ['../publishers/' + publishTarget + '.js', 'electron-forge-publisher-' + publishTarget, publishTarget, _path2.default.resolve(dir, publishTarget), _path2.default.resolve(dir, 'node_modules', publishTarget)]);

                                if (publisher) {
                                  _context.next = 3;
                                  break;
                                }

                                throw 'Could not find a publish target with the name: ' + publishTarget;

                              case 3:
                              case 'end':
                                return _context.stop();
                            }
                          }
                        }, _callee, undefined);
                      })));

                    case 4:
                      _context2.next = 6;
                      return publisher(artifacts, packageJSON, forgeConfig, authToken, tag, makeOptions.platform || process.platform, makeOptions.arch || process.arch);

                    case 6:
                    case 'end':
                      return _context2.stop();
                  }
                }
              }, _loop, undefined);
            });
            _iterator = (0, _getIterator3.default)(publishTargets);

          case 25:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context3.next = 30;
              break;
            }

            return _context3.delegateYield(_loop(), 't0', 27);

          case 27:
            _iteratorNormalCompletion = true;
            _context3.next = 25;
            break;

          case 30:
            _context3.next = 36;
            break;

          case 32:
            _context3.prev = 32;
            _context3.t1 = _context3['catch'](22);
            _didIteratorError = true;
            _iteratorError = _context3.t1;

          case 36:
            _context3.prev = 36;
            _context3.prev = 37;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 39:
            _context3.prev = 39;

            if (!_didIteratorError) {
              _context3.next = 42;
              break;
            }

            throw _iteratorError;

          case 42:
            return _context3.finish(39);

          case 43:
            return _context3.finish(36);

          case 44:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee2, undefined, [[22, 32, 36, 44], [37,, 39, 43]]);
  }));

  return function () {
    return _ref.apply(this, arguments);
  };
}();