'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (configObject) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (typeof configObject === 'function') {
    return configObject.apply(undefined, args);
  }
  return configObject;
};