'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.logFormatter = exports.txReceiptFormatter = exports.txFormatter = exports.syncFormatter = exports.blockFormatter = exports.format = exports.formatKey = undefined;var _utils = require('./utils');

const formatKey = exports.formatKey = (obj, key, formatter) => {
  if (!obj) return obj;
  let value = obj[key];
  if (undefined !== value) {
    obj[key] = formatter(value);
  }
  return obj;
};

const format = exports.format = (obj, formats) => {
  for (let key in formats) {
    obj = formatKey(obj, key, formats[key]);
  }
  return obj;
};

const addDefaultFields = fields => {
  let def = {
    transactionIndex: _utils.toDecimal,
    blockNumber: _utils.toDecimal,
    timestamp: _utils.toDecimal,
    gas: _utils.toDecimal,
    gasUsed: _utils.toDecimal };

  return Object.assign(def, fields);
};

const blockFormatter = exports.blockFormatter = block => {
  return format(block, {
    number: _utils.toDecimal,
    timestamp: _utils.toDecimal,
    size: _utils.toDecimal,
    gasUsed: _utils.toDecimal,
    gasLimit: _utils.toDecimal });

};

const syncFormatter = exports.syncFormatter = sync => {
  if (typeof sync === 'object') {
    return format(sync, {
      startingBlock: _utils.toDecimal,
      currentBlock: _utils.toDecimal,
      highestBlock: _utils.toDecimal });

  }
  return sync;
};

const txFormatter = exports.txFormatter = tx => {
  return format(tx, addDefaultFields({
    nonce: _utils.toDecimal }));

};

const txReceiptFormatter = exports.txReceiptFormatter = receipt => {
  if (receipt && receipt.logs) {
    receipt.logs = receipt.logs.map(log => logFormatter(log));
    return format(receipt, addDefaultFields({
      cumulativeGasUsed: _utils.toDecimal }));

  }
  return receipt;
};

const logFormatter = exports.logFormatter = log => {
  return format(log, addDefaultFields({
    logIndex: _utils.toDecimal }));

};