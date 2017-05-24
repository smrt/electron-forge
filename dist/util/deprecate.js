'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('colors');

var _logSymbols = require('log-symbols');

var _logSymbols2 = _interopRequireDefault(_logSymbols);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (what) {
  return {
    replaceWith: function replaceWith(replacement) {
      console.warn(_logSymbols2.default.warning, ('WARNING: ' + what + ' is deprecated, please use ' + replacement + ' instead').yellow);
    }
  };
};