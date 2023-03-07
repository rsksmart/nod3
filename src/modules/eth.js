import {
  blockFormatter,
  syncFormatter,
  txFormatter,
  txReceiptFormatter
} from '../lib/formatters'

import { isHashOrNumber, toHexStr, toDecimal } from '../lib/utils'

export default {
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
  },

  getStorageAt (contract, storageAddr, block = 'latest') {
    return { method: 'eth_getStorageAt', params: [contract, storageAddr, block] }
  }

}

function parseBlockArg (block) {
  let hOn = isHashOrNumber(block)
  if (hOn.hash) block = hOn.hash
  if (hOn.number) block = hOn.number
  return block
}
