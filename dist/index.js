"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _template = _interopRequireDefault(require("./template"));
var _template2 = require("./template.schema");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = {
  component: _template.default,
  schema: _template2.schema,
  ui: _template2.ui
};
exports.default = _default;
module.exports = exports.default;