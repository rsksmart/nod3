import * as utils from '../lib/utils'
import eth from '../modules/eth'
import rsk from '../modules/rsk'
import net from '../modules/net'
import { Subscribe } from '../classes/Subscribe'
import { HttpProvider } from '../classes/HttpProvider'
import { NOD3_MODULE } from '../lib/types'

const IS_BATCH = 'isBatch' + Math.random()
const isBatch = (key) => (key) ? key === IS_BATCH : IS_BATCH

export class Nod3 {
  constructor (provider) {
    this.provider = provider
    this.rpc = provider.rpc
    this.isBatch = isBatch
    this.utils = utils
    this.eth = addModule(eth, this)
    this.rsk = addModule(rsk, this)
    this.net = addModule(net, this)
    this.subscribe = new Subscribe(this)
  }

  isConnected () {
    return this.provider.isConnected()
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
      let data = await this.rpc.send(payload)
      return data.map((d, i) => format(d, batch[i].formatter))
    } catch (err) {
      return Promise.reject(err)
    }
  }

  static send (payload) {
    let method, params, formatter
    ({ method, params, formatter } = payload)
    return this.rpc.sendMethod(method, params)
      .then(res => format(res, formatter))
  }
}

function format (data, formatter) {
  return (formatter) ? formatter(data) : data
}

function addModule (mod, nod3) {
  // Module proxy
  return new Proxy(mod, {
    get (obj, prop) {
      if (prop === '_type') return NOD3_MODULE
      let value = obj[prop]
      if (typeof value !== 'function') return value
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
          return Nod3.send.bind(nod3)(fn(...args))
        }
      })
    }
  })
}

Nod3.providers = { HttpProvider }
