"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = {
  newBlock() {
    return {
      method: 'eth_newBlockFilter',
      cb: defaultCb };

  },
  pendingTransactions() {
    return {
      method: 'eth_newPendingTransactionFilter',
      cb: defaultCb };

  } };exports.default = _default;


function defaultCb(err, data) {
  // return error to original handler
  if (err) return this.send(err);
  // emit data if not empty
  if (Array.isArray(data) && data.length > 0) {
    data.forEach(d => {
      return this.send(null, d);
    });
  }
}