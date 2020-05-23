import * as utils from '../lib/utils'
import { Subscribe } from '../classes/Subscribe'
import { HttpProvider } from '../classes/HttpProvider'
import { CurlProvider } from '../classes/CurlProvider'
import { NOD3_MODULE } from '../lib/types'
import modules from '../modules'

const BATCH_KEY = 'isBatch' + Math.random()
const isBatch = key => key === BATCH_KEY

export class Nod3 {
  constructor (provider, { logger, debug } = {}) {
    let { url, rpc } = provider
    this.provider = provider
    this.rpc = rpc
    this.url = url
    this.log = logger || function (err) { console.log(err) }
    if (debug && typeof debug !== 'function') debug = (res) => this.logDebug(res)
    this.doDebug = debug
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

  setDebug (debug) {
    this.doDebug = debug
  }
  logDebug ({ method, params, time }) {
    this.log(`${method} (${params}) -- time:${time}ms`)
  }
  setSkipFormatters (v) {
    this.skipFormatters = !!v
  }

  isConnected () {
    return this.provider.isConnected()
  }
  runAndDebug (promise, payload) {
    let { doDebug } = this
    let debugData = createDebugData(payload)
    return runAndDebug(promise, debugData, doDebug)
  }

  async batchRequest (commands, methodName) {
    try {
      let { rpc } = this
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
      let data = await this.runAndDebug(rpc.send(payload), payload)
      return data.map((d, i) => format(d, batch[i].formatters))
    } catch (err) {
      return Promise.reject(err)
    }
  }

  static async send (payload) {
    let { method, params, formatters } = payload
    let { rpc, skipFormatters } = this
    let res = await this.runAndDebug(rpc.sendMethod(method, params), payload)
    return (skipFormatters === true) ? res : format(res, formatters)
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

async function runAndDebug (promise, debugData, debugCb) {
  try {
    let time = (typeof debugCb === 'function') ? Date.now() : undefined
    let result = await promise
    if (time) {
      time = Date.now() - time
      debugData.time = Date.now() - time
      debugCb(debugData)
    }
    return result
  } catch (err) {
    return Promise.reject(err)
  }
}

function createDebugData (payload) {
  if (Array.isArray(payload)) {
    let method = [...new Set(payload.map(({ method }) => method))]
    let params = payload.map(({ params }) => params)
    return { method, params }
  }
  return payload
}

Nod3.providers = { HttpProvider, CurlProvider }
