'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _utils = require('../lib/utils');exports.default =
{
  listening() {
    return { method: 'net_listening' };
  },
  version() {
    let formatter = id => {
      let name = (0, _utils.netName)(id);
      return { id, name };
    };
    return { method: 'net_version', formatter };
  },
  peerCount() {
    return { method: 'net_peerCount', formatter: value => (0, _utils.toDecimal)(value) };
  } };