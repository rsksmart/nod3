import { JsonRpc } from './JsonRpc'
export class Provider {
  constructor (url) {
    this.url = url || 'http://localhost:4444'
    this.rpc = new JsonRpc(this)
    this.interval = null
    this.intervalTime = 5000
    this.pool = new Map()
  }
  send () {
    throw new Error(`send is not implemented`)
  }
  isConnected () {
    throw new Error(`isConnected is not implemented`)
  }
  subscribe (id, payload, cb) {
    if (!id || !payload || !cb) throw new Error('Missing Arguments')
    if (typeof cb !== 'function') throw new Error('cb must be a function')
    this.pool.set(id, { payload, cb })
    this.startPool()
  }

  unsubscribe (id) {
    this.pool.delete(id)
    this.proveInterval()
  }

  proveInterval () {
    if (this.interval && !this.pool.size) {
      clearInterval(this.interval)
      this.interval = null
    }
  }

  processPool () {
    this.proveInterval()
    this.pool.forEach((sub, id) => {
      let { cb, payload } = sub
      this.rpc.send(payload)
        .then(data => cb(null, data))
        .catch(err => cb(err))
    })
  }

  startPool () {
    if (!this.interval && this.pool.size) {
      this.interval = setInterval(() => { this.processPool() }, this.intervalTime)
    }
  }
}
