'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _bluebird = require('bluebird');

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _s = require('s3');

var _s2 = _interopRequireDefault(_s);

var _oraHandler = require('../util/ora-handler');

var _oraHandler2 = _interopRequireDefault(_oraHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var d = (0, _debug2.default)('electron-forge:publish:s3');

_awsSdk2.default.util.update(_awsSdk2.default.S3.prototype, {
  addExpect100Continue: function addExpect100Continue() {
    // Hack around large upload issue: https://github.com/andrewrk/node-s3-client/issues/74
  }
});

exports.default = function () {
  var _ref = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee3(artifacts, packageJSON, forgeConfig, authToken, tag) {
    var s3Config, client, folder, uploaded;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            s3Config = forgeConfig.s3;

            s3Config.secretAccessKey = s3Config.secretAccessKey || authToken;

            if (s3Config.accessKeyId && s3Config.secretAccessKey && s3Config.bucket) {
              _context3.next = 4;
              break;
            }

            throw 'In order to publish to s3 you must set the "s3.accessKeyId", "process.env.ELECTRON_FORGE_S3_SECRET_ACCESS_KEY" and "s3.bucket" properties in your forge config. See the docs for more info';

          case 4:

            d('creating s3 client with options:', s3Config);

            client = _s2.default.createClient({
              s3Client: new _awsSdk2.default.S3({
                accessKeyId: s3Config.accessKeyId || process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: s3Config.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY
              })
            });

            client.s3.addExpect100Continue = function () {};

            folder = s3Config.folder || tag || packageJSON.version;
            uploaded = 0;
            _context3.next = 11;
            return (0, _oraHandler2.default)('Uploading Artifacts ' + uploaded + '/' + artifacts.length, function () {
              var _ref2 = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee2(uploadSpinner) {
                var updateSpinner;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        updateSpinner = function updateSpinner() {
                          uploadSpinner.text = 'Uploading Artifacts ' + uploaded + '/' + artifacts.length; // eslint-disable-line
                        };

                        _context2.next = 3;
                        return _promise2.default.all(artifacts.map(function (artifactPath) {
                          return new _promise2.default(function () {
                            var _ref3 = (0, _bluebird.coroutine)(_regenerator2.default.mark(function _callee(resolve, reject) {
                              var done, uploader;
                              return _regenerator2.default.wrap(function _callee$(_context) {
                                while (1) {
                                  switch (_context.prev = _context.next) {
                                    case 0:
                                      done = function done(err) {
                                        if (err) return reject(err);
                                        uploaded += 1;
                                        updateSpinner();
                                        resolve();
                                      };

                                      uploader = client.uploadFile({
                                        localFile: artifactPath,
                                        s3Params: {
                                          Bucket: s3Config.bucket,
                                          Key: folder + '/' + _path2.default.basename(artifactPath),
                                          ACL: s3Config.public ? 'public-read' : 'private'
                                        }
                                      });

                                      d('uploading:', artifactPath);

                                      uploader.on('error', function (err) {
                                        return done(err);
                                      });
                                      uploader.on('progress', function () {
                                        d('Upload Progress (' + _path2.default.basename(artifactPath) + ') ' + Math.round(uploader.progressAmount / uploader.progressTotal * 100) + '%');
                                      });
                                      uploader.on('end', function () {
                                        return done();
                                      });

                                    case 6:
                                    case 'end':
                                      return _context.stop();
                                  }
                                }
                              }, _callee, undefined);
                            }));

                            return function (_x7, _x8) {
                              return _ref3.apply(this, arguments);
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

              return function (_x6) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 11:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x, _x2, _x3, _x4, _x5) {
    return _ref.apply(this, arguments);
  };
}();