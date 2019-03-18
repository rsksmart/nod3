import { SUBSCRIPTIONS } from '../lib/types'
import { format } from './Nod3'

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
    let formatters = { options }
    let cb = options.cb
    data = format(data, formatters)
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
