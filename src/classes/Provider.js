import { JsonRpc } from './JsonRpc'
export class Provider {
  constructor (url, options = {}) {
    this.url = url || 'http://localhost:4444'
    this.rpc = new JsonRpc(this)
    this.poolTime = options.poolTime || 1000 / 2
    this.nextPool = null
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
    this.processPool()
  }

  unsubscribe (id) {
    this.pool.delete(id)
    this.checkPool()
  }

  checkPool () {
    if (this.pool.size && !this.nextPool) {
      this.nextPool = setTimeout(() => { this.processPool() }, this.poolTime)
    }
  }

  async processPool () {
    this.nextPool = null
    try {
      let q = []
      this.pool.forEach((sub, id) => {
        let { cb, payload } = sub
        q.push(this.rpc.send(payload)
          .then(data => cb(null, data))
          .catch(err => cb(err)))
      })
      await Promise.all(q)
      this.checkPool()
    } catch (err) {
      console.log(err.Error)
      this.checkPool()
    }
  }
}
