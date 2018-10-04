import { JsonRpc } from './JsonRpc'
import * as utils from './utils'
import eth from './modules/eth'
import rsk from './modules/rsk'

const IS_BATCH = 'isBatch' + Math.random()
const isBatch = (key) => (key) ? key === IS_BATCH : IS_BATCH

export class Nod3 {
  constructor (provider, options) {
    this.rpc = new JsonRpc(provider)
    this.utils = utils
    this.eth = addModule(eth, this)
    this.rsk = addModule(rsk, this)
  }

  isConnected () {
    return this.rpc.send(this.rpc.toPayload('net_listening'))
  }

  async batchRequest (commands, methodName) {
    try {
      let batch = commands.map(c => {
        let mName = methodName || c[0]
        mName = mName.split('.')
        let params = (methodName) ? c : c.slice(1)

        if (mName.length > 2) throw new Error(`Invalid method ${c[0]}`)

        let ctx = (mName[1]) ? this[mName[0]] : this
        let method = ctx[mName.pop()]
        return method(...params, isBatch())
      })
      let payload = batch.map(b => this.rpc.toPayload(b.method, b.params))
      let data = await this.rpc.send(payload, true)
      return data.map((d, i) => format(d, batch[i].formatter))
    } catch (err) {
      return Promise.reject(err)
    }
  }

  static send (payload) {
    let method, params, formatter
    ({ method, params, formatter } = payload)
    return this.rpc.send(this.rpc.toPayload(method, params))
      .then(res => format(res, formatter))
  }
}

function format (data, formatter) {
  return (formatter) ? formatter(data) : data
}

function addModule (mod, parent) {
  // Module proxy
  return new Proxy(mod, {
    get (obj, prop) {
      let value = obj[prop]
      if (typeof value === 'function') {
        // Module method proxy
        return new Proxy(value, {
          //  intercept function calls
          apply (fn, thisArg, args) {
            let aLen = args.length
            // batch request
            if (fn.length < aLen && isBatch(args[aLen - 1])) {
              return fn(...args)
            }
            // single execution
            const send = Nod3.send.bind(parent)
            return send(fn(...args))
          }
        })
      }
      return value
    }
  })
}
