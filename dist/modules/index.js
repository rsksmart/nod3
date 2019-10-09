"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _eth = _interopRequireDefault(require("./eth"));
var _net = _interopRequireDefault(require("./net"));
var _rsk = _interopRequireDefault(require("./rsk"));
var _txpool = _interopRequireDefault(require("./txpool"));
var _trace = _interopRequireDefault(require("./trace"));
var _debug = _interopRequireDefault(require("./debug"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var _default =

{ eth: _eth.default, net: _net.default, rsk: _rsk.default, txpool: _txpool.default, debug: _debug.default, trace: _trace.default };exports.default = _default;