"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.RoundRobin = exports.toDecimal = exports.toBase10 = exports.isNet = exports.netName = exports.toHexStr = exports.isHexStr = exports.isHashOrNumber = exports.isBlockHash = exports.checkBlockHash = void 0;var _types = require("./types");

const checkBlockHash = value => {
  value = String(value).toLowerCase();
  if (/^(0x)[0-9a-f]{64}$/.test(value)) return value;
  if (/^[0-9a-f]{64}$/.test(value)) return '0x' + value;
  return null;
};exports.checkBlockHash = checkBlockHash;

const isBlockHash = value => checkBlockHash(value) !== null;exports.isBlockHash = isBlockHash;

const isHashOrNumber = (hashOrNumber, toHex = true) => {
  let hash = isBlockHash(hashOrNumber) ? hashOrNumber : null;
  let number = !isNaN(parseInt(hashOrNumber)) && !hash ? hashOrNumber : null;
  number = number !== null && toHex ? toHexStr(hashOrNumber) : number;
  return { hash, number };
};exports.isHashOrNumber = isHashOrNumber;

const isHexStr = str => /^0x[0-9a-f]*$/.test(str);exports.isHexStr = isHexStr;

const toHexStr = (value, ox = '0x') => {
  if (isHexStr(value) || value === null) return value;
  let hex = ox + Number(value).toString(16);
  return parseInt(hex) === Number(value) ? hex : value;
};exports.toHexStr = toHexStr;

const netName = id => _types.NETWORKS[id] || '';exports.netName = netName;
const isNet = (id, name) => netName(id) === name;exports.isNet = isNet;

const toBase10 = (value, asNumber = false) => {
  const type = typeof value;
  value = Number(value).toString(10);
  return type === 'number' || asNumber ? Number(value) : value;
};exports.toBase10 = toBase10;

const toDecimal = value => undefined !== value ? parseInt(toBase10(value)) : value;exports.toDecimal = toDecimal;

const RoundRobin = (arr, index) => {
  index = index || 0;
  if (!Array.isArray(arr)) throw new Error('The first argument must be an array');
  return () => {
    if (index >= arr.length) index = 0;
    return arr[index++];
  };
};exports.RoundRobin = RoundRobin;