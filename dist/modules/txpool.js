'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.fixTxFields = exports.txPoolTxs = exports.txPoolApplyTxFilter = exports.txPoolTxsFormatter = exports.txPoolFormatter = undefined;var _formatters = require('../lib/formatters');exports.default =

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
const txPoolFormatter = exports.txPoolFormatter = result => typeof result === 'string' ? JSON.parse(result) : result;

const txPoolTxsFormatter = exports.txPoolTxsFormatter = result => {
  result.queued = txPoolApplyTxFilter(result.queued);
  result.pending = txPoolApplyTxFilter(result.pending);
  return result;
};

const txPoolApplyTxFilter = exports.txPoolApplyTxFilter = item => {
  return item ? txPoolTxs(item, _formatters.txFormatter) : item;
};

const txPoolTxs = exports.txPoolTxs = (item, cb) => {
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
};

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
const fixTxFields = exports.fixTxFields = tx => {
  tx = renameProp(tx, 'blockhash', 'blockHash');
  tx = renameProp(tx, 'blocknumber', 'blockNumber');
  return tx;
};