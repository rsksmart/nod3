'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.default = {
  newBlock() {
    return {
      method: 'eth_newBlockFilter',
      cb: defaultCb };

  },
  pendingTransactions() {
    return {
      method: 'eth_newPendingTransactionFilter',
      cb: defaultCb };

  } };


function defaultCb(err, data) {
  // return error to original handler
  if (err) return this.emit(err);
  // emit data if not empty
  if (Array.isArray(data) && data.length > 0) {
    data.forEach(d => {
      this.emit(null, d);
    });
  }
}