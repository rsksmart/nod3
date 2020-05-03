"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _formatters = require("../lib/formatters");var _default =

{
  transaction(txHash) {
    return { method: 'trace_transaction', params: [txHash], formatters: [_formatters.addTraceIndex] };
  },
  block(blockHash) {
    return { method: 'trace_block', params: [blockHash], formatters: [_formatters.addTraceIndex] };
  } };exports.default = _default;