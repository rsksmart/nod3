import * as utils from '../lib/utils'
import { Subscribe } from '../classes/Subscribe'
import { HttpProvider } from '../classes/HttpProvider'
import { CurlProvider } from '../classes/CurlProvider'
import { NOD3_MODULE } from '../lib/types'
import modules from '../modules'

const BATCH_KEY = 'isBatch' + Math.random()
const isBatch = key => key === BATCH_KEY

export class Nod3 {
  constructor (provider, options = {}) {
    this.provider = provider
    this.rpc = provider.rpc
    this.log = options.logger || function (err) { console.log(err) }
    this.isBatch = isBatch
    this.BATCH_KEY = BATCH_KEY
    this.utils = utils
    this.skipFormatters = !!(provider instanceof CurlProvider)
    // modules
    for (let module in modules) {
      this[module] = addModule(modules[module], this)
    }
    this.subscribe = new Subscribe(this)
  }

  setSkipFormatters (v) {
    this.skipFormatters = !!v
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
        return method(...params, this.BATCH_KEY)
      })
      let payload = batch.map(b => this.rpc.toPayload(b.method, b.params))
      let data = await this.rpc.send(payload)
      return data.map((d, i) => format(d, batch[i].formatters))
    } catch (err) {
      return Promise.reject(err)
    }
  }

  static send (payload) {
    let { method, params, formatters } = payload
    return this.rpc.sendMethod(method, params)
      .then(res => (this.skipFormatters === true) ? res : format(res, formatters))
  }
}

export function format (data, formatters) {
  if (Array.isArray(formatters)) {
    formatters = formatters.filter(f => typeof f === 'function')
    formatters.forEach(f => { data = f(data) })
  }
  return data
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
            args.pop()
            return fn(...args)
          }
          // single execution
          return Nod3.send.bind(nod3)(fn(...args))
        }
      })
    }
  })
}

Nod3.providers = { HttpProvider, CurlProvider }
