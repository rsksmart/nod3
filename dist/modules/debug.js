"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = {
  traceTransaction(txHash) {
    return { method: 'debug_traceTransaction', params: [txHash] };
  } };exports.default = _default;