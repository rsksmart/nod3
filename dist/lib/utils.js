'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.toDecimal = exports.toBase10 = exports.isNet = exports.netName = exports.toHexStr = exports.isHexStr = exports.isHashOrNuber = exports.isBlockHash = exports.checkBlockHash = undefined;var _types = require('./types');

const checkBlockHash = exports.checkBlockHash = value => {
  value = String(value).toLowerCase();
  if (/^(0x)[0-9a-f]{64}$/.test(value)) return value;
  if (/^[0-9a-f]{64}$/.test(value)) return '0x' + value;
  return null;
};

const isBlockHash = exports.isBlockHash = value => checkBlockHash(value) !== null;

const isHashOrNuber = exports.isHashOrNuber = (hashOrNumber, toHex = true) => {
  let hash = isBlockHash(hashOrNumber) ? hashOrNumber : null;
  let number = !isNaN(parseInt(hashOrNumber)) && !hash ? hashOrNumber : null;
  number = number !== null && toHex ? toHexStr(hashOrNumber) : number;
  return { hash, number };
};

const isHexStr = exports.isHexStr = str => /^0x[0-9a-f]*$/.test(str);

const toHexStr = exports.toHexStr = (value, ox = '0x') => {
  if (isHexStr(value) || value === null) return value;
  let hex = ox + Number(value).toString(16);
  return parseInt(hex) === Number(value) ? hex : value;
};

const netName = exports.netName = id => _types.NETWORKS[id];
const isNet = exports.isNet = (id, name) => netName(id) === name;

const toBase10 = exports.toBase10 = (value, asNumber = false) => {
  const type = typeof value;
  value = Number(value).toString(10);
  return type === 'number' || asNumber ? Number(value) : value;
};

const toDecimal = exports.toDecimal = value => undefined !== value ? parseInt(toBase10(value)) : value;