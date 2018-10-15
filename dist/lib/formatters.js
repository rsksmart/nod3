'use strict';Object.defineProperty(exports, "__esModule", { value: true });const formatKey = exports.formatKey = (obj, key, formatter) => {
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

const toDecimal = exports.toDecimal = value => {
  return parseInt(Number(value).toString(10));
};

const blockFormatter = exports.blockFormatter = block => {
  return format(block, {
    number: toDecimal });

};

const syncFormatter = exports.syncFormatter = value => {
  if (typeof value === 'object') {
    return format(value, {
      startingBlock: toDecimal,
      currentBlock: toDecimal,
      highestBlock: toDecimal });

  }
  return value;
};