'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _utils = require('../lib/utils');exports.default =
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
  } };