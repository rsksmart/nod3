import { blockFormatter, syncFormatter } from '../lib/formatters'
import { isHashOrNuber, toHexStr } from '../lib/utils'

export default {
  getBlock (hashOrNumber, txs = false) {
    let method = 'eth_getBlockByNumber'
    let hOn = isHashOrNuber(hashOrNumber)

    if (hOn.hash) method = 'eth_getBlockByHash'
    else hashOrNumber = hOn.number

    let params = [hashOrNumber, txs]
    return { method, params, formatter: blockFormatter }
  },

  getTransactionByIndex (hashOrNumber, index) {
    let hOn = isHashOrNuber(hashOrNumber)
    let params = (hOn.hash) ? [hOn.hash] : [hOn.number]
    let method = (hOn.hash) ? 'eth_getTransactionByBlockHashAndIndex' : 'eth_getTransactionByBlockNumberAndIndex'
    index = toHexStr(index)
    params.push(index)
    return { method, params }
  },

  getTransactionByHash (hash) {
    let params = [hash]
    let method = 'eth_getTransactionByHash'
    return { method, params }
  },

  getTransactionReceipt (hash) {
    let method = 'eth_getTransactionReceipt'
    let params = [hash]
    return { method, params }
  },

  getBalance (address, block = 'latest') {
    block = parseBlockArg(block)
    return { method: 'eth_getBalance', params: [address] }
  },

  getCode (address, block = 'latest') {
    block = parseBlockArg(block)
    return { method: 'eth_getCode', params: [address, block] }
  },

  syncing () {
    return { method: 'eth_syncing', formatter: syncFormatter }
  },

  blockNumber () {
    return { method: 'eth_blockNumber' }
  }
}

function parseBlockArg (block) {
  let hOn = isHashOrNuber(block)
  if (hOn.hash) block = hOn.hash
  if (hOn.number) block = hOn.number
  return block
}
