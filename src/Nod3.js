import { JsonRpc } from './JsonRpc'
import * as utils from './utils'
import { blockFormatter } from './formatters'

export class Nod3 {
  constructor (provider, options) {
    this.rpc = new JsonRpc(provider)
    this.utils = utils
  }

  getBlock (hashOrNumber, txs = false) {
    let isHash = this.utils.isBlockHash(hashOrNumber)
    let method = (isHash) ? 'getBlockByHash' : 'getBlockByNumber'
    return this[method](hashOrNumber, txs)
      .then(block => blockFormatter(block))
  }

  getBlockByNumber (number, txs) {
    if (!isNaN(parseInt(number))) number = '0x' + Number(number).toString(16)
    return this.rpc.send('eth_getBlockByNumber', [number, txs])
  }
  getBlockByHash (hash, txs) {
    return this.rpc.send('eth_getBlockByHash', [hash, txs])
  }
  getBlocksByNumber (number) {
    return this.rpc.send('eth_getBlocksByNumber', [number])
  }
}
