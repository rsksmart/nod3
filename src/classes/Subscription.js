import { EventEmitter } from 'events'
import { SUBSCRIPTIONS } from '../lib/types'

export class Subscription extends EventEmitter {
  constructor (id, type) {
    super()
    if (!id) throw new Error('Missing id')
    let isSubsType = Object.values(SUBSCRIPTIONS).includes(type)
    if (!isSubsType) throw new Error(`Unknown subscription type ${type}`)
    this.id = id
    this.type = type
  }
  emit (err, data, cb, options = {}) {
    let formatter = options.formatter
    if (formatter) data = formatter(data)
    if (cb) return cb.bind(this)(err, data)
    if (err) return super.emit('error', err)
    if (data !== undefined) return super.emit('data', data)
  }
  delete () {
    throw new Error(`Method delete is not implemented on: ${this.id}`)
  }
}
