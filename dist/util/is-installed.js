"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isInstalled;
function isInstalled(pkg) {
  try {
    require(pkg);
    return true;
  } catch (e) {
    // Package doesn't exist -- must not be installable on this platform
    return false;
  }
}