"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _utils = require("../lib/utils");var _default =
{
  listening() {
    return { method: 'net_listening' };
  },
  version() {
    const formatVersion = id => {
      let name = (0, _utils.netName)(id);
      return { id, name };
    };
    return { method: 'net_version', formatters: [formatVersion] };
  },
  peerCount() {
    return { method: 'net_peerCount', formatters: [value => (0, _utils.toDecimal)(value)] };
  } };exports.default = _default;