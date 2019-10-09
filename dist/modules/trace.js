"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = {
  transaction(txHash) {
    return { method: 'trace_transaction', params: [txHash] };
  } };exports.default = _default;