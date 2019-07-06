"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.fixTxFields = exports.txPoolTxs = exports.txPoolApplyTxFilter = exports.txPoolTxsFormatter = exports.txPoolFormatter = exports.default = void 0;var _formatters = require("../lib/formatters");var _default =

{

  content() {
    return { method: 'txpool_content', formatters: [txPoolFormatter, txPoolTxsFormatter] };
  },

  inspect() {
    return { method: 'txpool_inspect', formatters: [txPoolFormatter] };
  },

  status() {
    return { method: 'txpool_status', formatters: [txPoolFormatter] };
  } };


// fix bad rskj response
// see: https://github.com/rsksmart/rskj/issues/689
exports.default = _default;const txPoolFormatter = result => typeof result === 'string' ? JSON.parse(result) : result;exports.txPoolFormatter = txPoolFormatter;

const txPoolTxsFormatter = result => {
  result.queued = txPoolApplyTxFilter(result.queued);
  result.pending = txPoolApplyTxFilter(result.pending);
  return result;
};exports.txPoolTxsFormatter = txPoolTxsFormatter;

const txPoolApplyTxFilter = item => {
  return item ? txPoolTxs(item, _formatters.txFormatter) : item;
};exports.txPoolApplyTxFilter = txPoolApplyTxFilter;

const txPoolTxs = (item, cb) => {
  const result = Object.assign({}, item);
  const addresses = Object.keys(result);
  addresses.forEach(address => {
    const value = item[address];
    const nonces = Object.keys(value);
    nonces.forEach(nonce => {
      const txs = value[nonce];
      value[nonce] = txs.map(tx => {
        tx = fixTxFields(tx);
        return typeof cb === 'function' ? cb(tx) : tx;
      });
    });
    result[address] = value;
  });
  return result;
};exports.txPoolTxs = txPoolTxs;

const renameProp = (obj, prop, newProp) => {
  if (obj.hasOwnProperty(prop)) {
    const value = obj[prop];
    obj[newProp] = value;
    delete obj[prop];
  }
  return obj;
};

// fix bad rskj response
// see: https://github.com/rsksmart/rskj/issues/689
const fixTxFields = tx => {
  tx = renameProp(tx, 'blockhash', 'blockHash');
  tx = renameProp(tx, 'blocknumber', 'blockNumber');
  return tx;
};exports.fixTxFields = fixTxFields;