"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.NOD3_MODULE = exports.SUBSCRIPTIONS = exports.NETWORKS = exports.NET_NAMES = exports.RSK_TESTNET = exports.RSK_MAINNET = exports.ETH_MAINNET = void 0;
const ETH_MAINNET = 'Ethereum Mainnet';exports.ETH_MAINNET = ETH_MAINNET;
const RSK_MAINNET = 'RSK Mainnet';exports.RSK_MAINNET = RSK_MAINNET;
const RSK_TESTNET = 'RSK Testnet';exports.RSK_TESTNET = RSK_TESTNET;

const NET_NAMES = {
  ETH_MAINNET,
  RSK_MAINNET,
  RSK_TESTNET };exports.NET_NAMES = NET_NAMES;


const NETWORKS = {
  1: ETH_MAINNET,
  2: 'Morden Testnet (deprecated)',
  3: 'Ropsten Testnet',
  4: 'Rinkeby Testnet',
  30: RSK_MAINNET,
  31: RSK_TESTNET,
  42: 'Kovan Testnet' };exports.NETWORKS = NETWORKS;


const SUBSCRIPTIONS = {
  METHOD: 'method',
  FILTER: 'filter' };exports.SUBSCRIPTIONS = SUBSCRIPTIONS;


const NOD3_MODULE = 'nod3Module';exports.NOD3_MODULE = NOD3_MODULE;