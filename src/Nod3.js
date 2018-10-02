import { JsonRpc } from './JsonRpc'
import * as utils from './utils'
import { blockFormatter } from './formatters'

export class Nod3 {
  constructor (provider, options) {
    this.rpc = new JsonRpc(provider)
    this.utils = utils
  }

  isConnected () {
    return this.rpc.send(this.rpc.toPayload('net_listening'))
  }

  async batchRequest (method, params) {
    let batch = params.map(p => this[method](...p, true))
    let payload = batch.map(b => this.rpc.toPayload(b.method, b.params))
    let data = await this.rpc.send(payload, true)
    return data.map((d, i) => this.format(d, batch[i].formatter))
  }

  getBlock (hashOrNumber, txs = false, isBatch) {
    let isHash = this.utils.isBlockHash(hashOrNumber)
    let method = 'eth_getBlockByNumber'
    if (isHash) {
      method = 'eth_getBlockByHash'
    } else {
      if (!isNaN(parseInt(hashOrNumber))) hashOrNumber = '0x' + Number(hashOrNumber).toString(16)
    }
    let formatter = blockFormatter
    let params = [hashOrNumber, txs]
    return this.runMethod({ method, params, formatter, isBatch })
  }

  getBlocksByNumber (number, isBatch) {
    let method = 'eth_getBlocksByNumber'
    let params = [number]
    return this.runMethod({ method, params, isBatch })
  }

  runMethod (payload) {
    return (payload.isBatch) ? payload : this.rpcSend(payload)
  }

  rpcSend (payload) {
    let method, params, formatter
    ({ method, params, formatter } = payload)
    return this.rpc.send(this.rpc.toPayload(method, params))
      .then(res => this.format(res, formatter))
  }

  format (data, formatter) {
    return (formatter) ? formatter(data) : data
  }
}
