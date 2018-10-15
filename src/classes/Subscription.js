import { SUBSCRIPTIONS } from '../lib/types'

export class Subscription {
  constructor (id, type) {
    if (!id) throw new Error('Missing id')
    let isSubsType = Object.values(SUBSCRIPTIONS).includes(type)
    if (!isSubsType) throw new Error(`Unknown subscription type ${type}`)
    this.id = id
    this.type = type
    this.errorHandler = (err) => console.log(err)
    this.dataHandler = null
  }
  watch (dataCb, errCb) {
    if (undefined !== dataCb) this.dataHandler = dataCb
    if (undefined !== errCb) this.errorHandler = errCb
  }
  send (err, data, options = {}) {
    let formatter = options.formatter
    let cb = options.cb
    if (formatter && typeof formatter === 'function') data = formatter(data)
    if (cb && typeof cb === 'function') return cb.bind(this)(err, data)
    else {
      if (err && this.errorHandler) this.errorHandler(err)
      if (data !== undefined && this.dataHandler) this.dataHandler(data)
    }
  }
  delete () {
    throw new Error(`Method delete is not implemented on: ${this.id}`)
  }
}
