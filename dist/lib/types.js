'use strict';Object.defineProperty(exports, "__esModule", { value: true });
const ETH_MAINNET = exports.ETH_MAINNET = 'Ethereum Mainnet';
const RSK_MAINNET = exports.RSK_MAINNET = 'RSK Mainnet';
const RSK_TESTNET = exports.RSK_TESTNET = 'RSK Testnet';

const NET_NAMES = exports.NET_NAMES = {
  ETH_MAINNET,
  RSK_MAINNET,
  RSK_TESTNET };


const NETWORKS = exports.NETWORKS = {
  1: ETH_MAINNET,
  2: 'Morden Testnet (deprecated)',
  3: 'Ropsten Testnet',
  4: 'Rinkeby Testnet',
  30: RSK_MAINNET,
  31: RSK_TESTNET,
  42: 'Kovan Testnet' };


const SUBSCRIPTIONS = exports.SUBSCRIPTIONS = {
  METHOD: 'method',
  FILTER: 'filter' };


const NOD3_MODULE = exports.NOD3_MODULE = 'nod3Module';