'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _bluebird = require('bluebird');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _yarnOrNpm = require('yarn-or-npm');

var _initGit = require('../init/init-git');

var _initGit2 = _interopRequireDefault(_initGit);

var _initNpm = require('../init/init-npm');

var _oraHandler = require('../util/ora-handler');

var _oraHandler2 = _interopRequireDefault(_oraHandler);

var _messages = require('../util/messages');

var _installDependencies = require('../util/install-dependencies');

var _installDependencies2 = _interopRequireDefault(_installDependencies);

var _readPackageJson = require('../util/read-package-json');

var _readPackageJson2 = _interopRequireDefault(_readPackageJson);

var _confirmIfInteractive = require('../util/confirm-if-interactive');

var _confirmIfInteractive2 = _interopRequireDefault(_confirmIfInteractive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var d = (0, _debug2.default)('electron-forge:import');

/**
 * @typedef {Object} ImportOptions
 * @property {string} [dir=process.cwd()] The path to the app to be imported
 * @property {boolean} [interactive=false] Whether to use sensible defaults or prompt the user visually
 * @property {boolean} [updateScripts=true] Whether to update the modules package.json scripts to be electron-forge commands
 * @property {string} [outDir=`${dir}/out`] The path to the directory containing generated distributables
 */

/**
 * Attempt to import a given module directory to the Electron Forge standard.
 *
 * - Replaces the prebuilt electron package with the one that integrates with `electron-compile`
 * - Sets up `git` and the correct NPM dependencies
 * - Adds a template forge config to `package.json`
 *
 * @param {ImportOptions} providedOptions - Options for the import method
 * @return {Promise} Will resolve when the import process is complete
 */

exports.default = function () {
  var _ref = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee8() {
    var providedOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _Object$assign, dir, interactive, updateScripts, outDir, confirm, packageJSON, shouldContinue, shouldChangeMain, _ref2, newMain, keys, buildToolPackages, electronName, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, key, explanation, shouldRemoveDependency, updatePackageScript, writeChanges, electronVersion, electronPackageJSON, templatePackageJSON, babelConfig, babelPath;

    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _Object$assign = (0, _assign2.default)({
              dir: process.cwd(),
              interactive: false,
              updateScripts: true
            }, providedOptions), dir = _Object$assign.dir, interactive = _Object$assign.interactive, updateScripts = _Object$assign.updateScripts;
            outDir = providedOptions.outDir || 'out';

            _oraHandler2.default.interactive = interactive;

            d('Attempting to import project in: ' + dir);
            _context8.next = 6;
            return _fsPromise2.default.exists(dir);

          case 6:
            _context8.t0 = !_context8.sent;

            if (_context8.t0) {
              _context8.next = 11;
              break;
            }

            _context8.next = 10;
            return _fsPromise2.default.exists(_path2.default.resolve(dir, 'package.json'));

          case 10:
            _context8.t0 = !_context8.sent;

          case 11:
            if (!_context8.t0) {
              _context8.next = 13;
              break;
            }

            throw 'We couldn\'t find a project in: ' + dir;

          case 13:
            _context8.next = 15;
            return (0, _confirmIfInteractive2.default)(interactive, 'WARNING: We will now attempt to import: "' + dir + '".  This will involve modifying some files, are you sure you want to continue?');

          case 15:
            confirm = _context8.sent;


            if (!confirm) {
              process.exit(0);
            }

            _context8.next = 19;
            return (0, _initGit2.default)(dir);

          case 19:
            _context8.next = 21;
            return (0, _readPackageJson2.default)(dir);

          case 21:
            packageJSON = _context8.sent;

            if (!(packageJSON.config && packageJSON.config.forge)) {
              _context8.next = 28;
              break;
            }

            (0, _messages.warn)(interactive, 'It looks like this project is already configured for "electron-forge"'.green);
            _context8.next = 26;
            return (0, _confirmIfInteractive2.default)(interactive, 'Are you sure you want to continue?');

          case 26:
            shouldContinue = _context8.sent;


            if (!shouldContinue) {
              process.exit(0);
            }

          case 28:
            _context8.next = 30;
            return (0, _confirmIfInteractive2.default)(interactive, 'Do you want us to change the "main" attribute of your package.json?  If you are currently using babel and pointing to a "build" directory say yes.', false);

          case 30:
            shouldChangeMain = _context8.sent;

            if (!shouldChangeMain) {
              _context8.next = 37;
              break;
            }

            _context8.next = 34;
            return _inquirer2.default.createPromptModule()({
              type: 'input',
              name: 'newMain',
              default: packageJSON.main,
              message: 'Enter the relative path to your uncompiled main file'
            });

          case 34:
            _ref2 = _context8.sent;
            newMain = _ref2.newMain;

            packageJSON.main = newMain;

          case 37:

            packageJSON.dependencies = packageJSON.dependencies || {};
            packageJSON.devDependencies = packageJSON.devDependencies || {};

            keys = (0, _keys2.default)(packageJSON.dependencies).concat((0, _keys2.default)(packageJSON.devDependencies));
            buildToolPackages = {
              'electron-builder': 'provides mostly equivalent functionality',
              'electron-download': 'already uses this module as a transitive dependency',
              'electron-installer-debian': 'already uses this module as a transitive dependency',
              'electron-installer-dmg': 'already uses this module as a transitive dependency',
              'electron-installer-flatpak': 'already uses this module as a transitive dependency',
              'electron-installer-redhat': 'already uses this module as a transitive dependency',
              'electron-osx-sign': 'already uses this module as a transitive dependency',
              'electron-packager': 'already uses this module as a transitive dependency',
              'electron-winstaller': 'already uses this module as a transitive dependency'
            };
            electronName = void 0;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context8.prev = 45;
            _iterator = (0, _getIterator3.default)(keys);

          case 47:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context8.next = 64;
              break;
            }

            key = _step.value;

            if (!(key === 'electron' || key === 'electron-prebuilt')) {
              _context8.next = 55;
              break;
            }

            delete packageJSON.dependencies[key];
            delete packageJSON.devDependencies[key];
            electronName = key;
            _context8.next = 61;
            break;

          case 55:
            if (!buildToolPackages[key]) {
              _context8.next = 61;
              break;
            }

            explanation = buildToolPackages[key];
            // eslint-disable-next-line max-len

            _context8.next = 59;
            return (0, _confirmIfInteractive2.default)(interactive, 'Do you want us to remove the "' + key + '" dependency in package.json? Electron Forge ' + explanation + '.');

          case 59:
            shouldRemoveDependency = _context8.sent;


            if (shouldRemoveDependency) {
              delete packageJSON.dependencies[key];
              delete packageJSON.devDependencies[key];
            }

          case 61:
            _iteratorNormalCompletion = true;
            _context8.next = 47;
            break;

          case 64:
            _context8.next = 70;
            break;

          case 66:
            _context8.prev = 66;
            _context8.t1 = _context8['catch'](45);
            _didIteratorError = true;
            _iteratorError = _context8.t1;

          case 70:
            _context8.prev = 70;
            _context8.prev = 71;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 73:
            _context8.prev = 73;

            if (!_didIteratorError) {
              _context8.next = 76;
              break;
            }

            throw _iteratorError;

          case 76:
            return _context8.finish(73);

          case 77:
            return _context8.finish(70);

          case 78:

            packageJSON.scripts = packageJSON.scripts || {};
            d('reading current scripts object:', packageJSON.scripts);

            updatePackageScript = function () {
              var _ref3 = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee(scriptName, newValue) {
                var shouldUpdate;
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!(packageJSON.scripts[scriptName] !== newValue)) {
                          _context.next = 5;
                          break;
                        }

                        _context.next = 3;
                        return (0, _confirmIfInteractive2.default)(interactive, 'Do you want us to update the "' + scriptName + '" script to instead call the electron-forge task "' + newValue + '"', updateScripts);

                      case 3:
                        shouldUpdate = _context.sent;

                        if (shouldUpdate) {
                          packageJSON.scripts[scriptName] = newValue;
                        }

                      case 5:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined);
              }));

              return function updatePackageScript(_x2, _x3) {
                return _ref3.apply(this, arguments);
              };
            }();

            _context8.next = 83;
            return updatePackageScript('start', 'electron-forge start');

          case 83:
            _context8.next = 85;
            return updatePackageScript('package', 'electron-forge package');

          case 85:
            _context8.next = 87;
            return updatePackageScript('make', 'electron-forge make');

          case 87:

            d('forgified scripts object:', packageJSON.scripts);

            writeChanges = function () {
              var _ref4 = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee3() {
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return (0, _oraHandler2.default)('Writing modified package.json file', (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee2() {
                          return _regenerator2.default.wrap(function _callee2$(_context2) {
                            while (1) {
                              switch (_context2.prev = _context2.next) {
                                case 0:
                                  _context2.next = 2;
                                  return _fsPromise2.default.writeFile(_path2.default.resolve(dir, 'package.json'), (0, _stringify2.default)(packageJSON, null, 2) + '\n');

                                case 2:
                                case 'end':
                                  return _context2.stop();
                              }
                            }
                          }, _callee2, undefined);
                        })));

                      case 2:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                }, _callee3, undefined);
              }));

              return function writeChanges() {
                return _ref4.apply(this, arguments);
              };
            }();

            electronVersion = void 0;

            if (!electronName) {
              _context8.next = 96;
              break;
            }

            _context8.next = 93;
            return (0, _readPackageJson2.default)(_path2.default.resolve(dir, 'node_modules', electronName));

          case 93:
            electronPackageJSON = _context8.sent;

            electronVersion = electronPackageJSON.version;
            packageJSON.devDependencies['electron-prebuilt-compile'] = electronVersion;

          case 96:
            _context8.next = 98;
            return writeChanges();

          case 98:
            if (!electronName) {
              _context8.next = 101;
              break;
            }

            _context8.next = 101;
            return (0, _oraHandler2.default)('Pruning deleted modules', (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee4() {
              return _regenerator2.default.wrap(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      _context4.next = 2;
                      return new _promise2.default(function (resolve) {
                        d('attempting to prune node_modules in:', dir);
                        var child = (0, _yarnOrNpm.spawn)((0, _yarnOrNpm.hasYarn)() ? [] : ['prune'], {
                          cwd: dir,
                          stdio: 'ignore'
                        });
                        child.on('exit', function () {
                          return resolve();
                        });
                      });

                    case 2:
                    case 'end':
                      return _context4.stop();
                  }
                }
              }, _callee4, undefined);
            })));

          case 101:
            _context8.next = 103;
            return (0, _oraHandler2.default)('Installing dependencies', (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee5() {
              return _regenerator2.default.wrap(function _callee5$(_context5) {
                while (1) {
                  switch (_context5.prev = _context5.next) {
                    case 0:
                      d('deleting old dependencies forcefully');
                      _context5.next = 3;
                      return _fsPromise2.default.remove(_path2.default.resolve(dir, 'node_modules/.bin/electron'));

                    case 3:
                      _context5.next = 5;
                      return _fsPromise2.default.remove(_path2.default.resolve(dir, 'node_modules/.bin/electron.cmd'));

                    case 5:
                      if (!electronName) {
                        _context5.next = 8;
                        break;
                      }

                      _context5.next = 8;
                      return _fsPromise2.default.remove(_path2.default.resolve(dir, 'node_modules', electronName));

                    case 8:

                      d('installing dependencies');
                      _context5.next = 11;
                      return (0, _installDependencies2.default)(dir, _initNpm.deps);

                    case 11:

                      d('installing devDependencies');
                      _context5.next = 14;
                      return (0, _installDependencies2.default)(dir, _initNpm.devDeps, true);

                    case 14:

                      d('installing exactDevDependencies');
                      _context5.next = 17;
                      return (0, _installDependencies2.default)(dir, _initNpm.exactDevDeps.map(function (dep) {
                        if (dep === 'electron-prebuild-compile') {
                          return dep + '@' + (electronVersion || 'latest');
                        }

                        return dep;
                      }), true, true);

                    case 17:
                    case 'end':
                      return _context5.stop();
                  }
                }
              }, _callee5, undefined);
            })));

          case 103:
            _context8.next = 105;
            return (0, _readPackageJson2.default)(dir);

          case 105:
            packageJSON = _context8.sent;


            packageJSON.config = packageJSON.config || {};
            _context8.next = 109;
            return (0, _readPackageJson2.default)(_path2.default.resolve(__dirname, '../../tmpl'));

          case 109:
            templatePackageJSON = _context8.sent;

            packageJSON.config.forge = templatePackageJSON.config.forge;

            _context8.next = 113;
            return writeChanges();

          case 113:
            _context8.next = 115;
            return (0, _oraHandler2.default)('Fixing .gitignore', (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee6() {
              var gitignore;
              return _regenerator2.default.wrap(function _callee6$(_context6) {
                while (1) {
                  switch (_context6.prev = _context6.next) {
                    case 0:
                      _context6.next = 2;
                      return _fsPromise2.default.exists(_path2.default.resolve(dir, '.gitignore'));

                    case 2:
                      if (!_context6.sent) {
                        _context6.next = 9;
                        break;
                      }

                      _context6.next = 5;
                      return _fsPromise2.default.readFile(_path2.default.resolve(dir, '.gitignore'));

                    case 5:
                      gitignore = _context6.sent;

                      if (gitignore.includes(outDir)) {
                        _context6.next = 9;
                        break;
                      }

                      _context6.next = 9;
                      return _fsPromise2.default.writeFile(_path2.default.resolve(dir, '.gitignore'), gitignore + '\n' + outDir + '/');

                    case 9:
                    case 'end':
                      return _context6.stop();
                  }
                }
              }, _callee6, undefined);
            })));

          case 115:
            babelConfig = packageJSON.babel;
            babelPath = _path2.default.resolve(dir, '.babelrc');
            _context8.t2 = !babelConfig;

            if (!_context8.t2) {
              _context8.next = 122;
              break;
            }

            _context8.next = 121;
            return _fsPromise2.default.exists(babelPath);

          case 121:
            _context8.t2 = _context8.sent;

          case 122:
            if (!_context8.t2) {
              _context8.next = 128;
              break;
            }

            _context8.t3 = JSON;
            _context8.next = 126;
            return _fsPromise2.default.readFile(babelPath, 'utf8');

          case 126:
            _context8.t4 = _context8.sent;
            babelConfig = _context8.t3.parse.call(_context8.t3, _context8.t4);

          case 128:
            if (!babelConfig) {
              _context8.next = 132;
              break;
            }

            _context8.next = 131;
            return (0, _oraHandler2.default)('Porting original babel config', (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee7() {
              var compileConfig, compilePath;
              return _regenerator2.default.wrap(function _callee7$(_context7) {
                while (1) {
                  switch (_context7.prev = _context7.next) {
                    case 0:
                      compileConfig = {};
                      compilePath = _path2.default.resolve(dir, '.compilerc');
                      _context7.next = 4;
                      return _fsPromise2.default.exists(compilePath);

                    case 4:
                      if (!_context7.sent) {
                        _context7.next = 10;
                        break;
                      }

                      _context7.t0 = JSON;
                      _context7.next = 8;
                      return _fsPromise2.default.readFile(compilePath, 'utf8');

                    case 8:
                      _context7.t1 = _context7.sent;
                      compileConfig = _context7.t0.parse.call(_context7.t0, _context7.t1);

                    case 10:
                      _context7.next = 12;
                      return _fsPromise2.default.writeFile(compilePath, (0, _stringify2.default)((0, _assign2.default)(compileConfig, {
                        'application/javascript': babelConfig
                      }), null, 2));

                    case 12:
                    case 'end':
                      return _context7.stop();
                  }
                }
              }, _callee7, undefined);
            })));

          case 131:

            (0, _messages.info)(interactive, 'NOTE: You might be able to remove your `.compilerc` file completely if you are only using the `es2016` and `react` presets'.yellow);

          case 132:

            (0, _messages.info)(interactive, '\n\nWe have ATTEMPTED to convert your app to be in a format that electron-forge understands.\nNothing much will have changed but we added the ' + '"electron-prebuilt-compile"'.cyan + ' dependency.  This is the dependency you must version bump to get newer versions of Electron.\n\n\nWe also tried to import any build tooling you already had but we can\'t get everything.  You might need to convert any CLI/gulp/grunt tasks yourself.\n\nAlso please note if you are using `preload` scripts you need to follow the steps outlined at https://github.com/electron-userland/electron-forge/wiki/Using-%27preload%27-scripts\n\nThanks for using ' + '"electron-forge"'.green + '!!!');

          case 133:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined, [[45, 66, 70, 78], [71,, 73, 77]]);
  }));

  return function () {
    return _ref.apply(this, arguments);
  };
}();