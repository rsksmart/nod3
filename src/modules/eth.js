import {
  blockFormatter,
  syncFormatter,
  txFormatter,
  txReceiptFormatter
} from '../lib/formatters'

import { isHashOrNumber, toHexStr, toDecimal } from '../lib/utils'

/**
 * @module eth
 * @typicalname nod3.eth
 */

export default {

/**
*  Returns a block object using eth_getBlockByHash or eth_getBlockByNumber according to the parameters.
 * @param {String} hashOrNumber BlockHash or blockNumber
 * @param {Boolean} txs If true it returns the full transaction objects, if false only the hashes of the transactions.
 * @returns {Promise.<Object>} block object or null
 * @see https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getblockbyhash
 * @see https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getblockbyNumber
 */
  getBlock (hashOrNumber, txs = false) {
    let method = 'eth_getBlockByNumber'
    let hOn = isHashOrNumber(hashOrNumber)

    if (hOn.hash) method = 'eth_getBlockByHash'
    else hashOrNumber = (hOn.number !== null) ? hOn.number : hashOrNumber

    let params = [hashOrNumber, txs]
    return { method, params, formatters: [blockFormatter] }
  },

  getTransactionByIndex (hashOrNumber, index) {
    let hOn = isHashOrNumber(hashOrNumber)
    let params = (hOn.hash) ? [hOn.hash] : [hOn.number]
    let method = (hOn.hash) ? 'eth_getTransactionByBlockHashAndIndex' : 'eth_getTransactionByBlockNumberAndIndex'
    index = toHexStr(index)
    params.push(index)
    return { method, params, formatters: [txFormatter] }
  },

  getTransactionByHash (hash) {
    let params = [hash]
    let method = 'eth_getTransactionByHash'
    return { method, params, formatters: [txFormatter] }
  },

  getTransactionReceipt (hash) {
    let method = 'eth_getTransactionReceipt'
    let params = [hash]
    return { method, params, formatters: [txReceiptFormatter] }
  },

  getTransactionCount (address, block = 'latest') {
    block = parseBlockArg(block)
    return { method: 'eth_getTransactionCount', params: [address, block] }
  },

  getBalance (address, block = 'latest') {
    block = parseBlockArg(block)
    return { method: 'eth_getBalance', params: [address, block] }
  },

  getCode (address, block = 'latest') {
    block = parseBlockArg(block)
    return { method: 'eth_getCode', params: [address, block] }
  },

  syncing () {
    return { method: 'eth_syncing', formatters: [syncFormatter] }
  },

  blockNumber () {
    return { method: 'eth_blockNumber', formatters: [toDecimal] }
  },

  sendRawTransaction (txData) {
    return { method: 'eth_sendRawTransaction', params: [txData] }
  },

  netHashrate () {
    return { method: 'eth_netHashrate', formatters: [toDecimal] }
  },

  call (callObj, block = 'latest') {
    block = parseBlockArg(block)
    return { method: 'eth_call', params: [callObj, block] }
  },

  chainId () {
    return { method: 'eth_chainId', formatters: [toDecimal] }
  }

}

function parseBlockArg (block) {
  let hOn = isHashOrNumber(block)
  if (hOn.hash) block = hOn.hash
  if (hOn.number) block = hOn.number
  return block
}
