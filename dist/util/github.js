'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _github = require('github');

var _github2 = _interopRequireDefault(_github);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GitHub = function () {
  function GitHub(authToken, requireAuth) {
    (0, _classCallCheck3.default)(this, GitHub);

    if (authToken) {
      this.token = authToken;
    } else if (process.env.GITHUB_TOKEN) {
      this.token = process.env.GITHUB_TOKEN;
    } else if (requireAuth) {
      throw 'Please set GITHUB_TOKEN in your environment to access these features';
    }
  }

  (0, _createClass3.default)(GitHub, [{
    key: 'getGitHub',
    value: function getGitHub() {
      var github = new _github2.default({
        protocol: 'https',
        headers: {
          'user-agent': 'Electron Forge'
        }
      });
      if (this.token) {
        github.authenticate({
          type: 'token',
          token: this.token
        });
      }
      return github;
    }
  }]);
  return GitHub;
}();

exports.default = GitHub;