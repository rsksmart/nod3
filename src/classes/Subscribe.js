import { Nod3 } from './Nod3'
import { Subscription } from './Subscription'
import filters from '../lib/filters'
import { SUBSCRIPTIONS, NOD3_MODULE } from '../lib/types'

export class Subscribe {
  constructor (nod3) {
    this.nod3 = nod3
    let provider = nod3.provider
    this.subscriptions = new Map()
    this.provider = provider
    this.rpc = provider.rpc
    this.send = Nod3.send.bind(provider)
    this.sid = 0
  }
  async filter (filterName) {
    try {
      if (!filterName) throw new Error('Invalid Arguments')
      let filterDef = filters[filterName]
      if (!filterDef) throw new Error(`Unknown filter: ${filterName}`)
      filterDef = filterDef()
      let id = await this.send(filterDef)
      if (!id) throw new Error('Node returns invalid id')
      let payload = this.rpc.toPayload('eth_getFilterChanges', [id])
      let cb = filterDef.cb
      return addSubscription.bind(this)(id, SUBSCRIPTIONS.FILTER, payload, { cb })
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async method (name, args) {
    try {
      args = args || []
      name = name.split('.')
      let module = this.nod3[name[0]]
      if (!module || module._type !== NOD3_MODULE) throw new Error(`Unknown module: ${name[0]}`)
      let method = module[name[1]]
      if (!method) throw new Error(`Unknown method ${name[1]} in module ${name[0]}`)
      args.push(this.nod3.BATCH_KEY)
      let m = method(...args)
      let payload = this.rpc.toPayload(m.method, m.params)
      let type = SUBSCRIPTIONS.METHOD
      let id = methodId.bind(this)(type)
      return addSubscription.bind(this)(id, type, payload, { formatter: m.formatter })
    } catch (err) {
      return Promise.reject(err)
    }
  }
  async remove (id) {
    try {
      let sub = this.subscriptions.get(id)
      if (!sub) throw new Error(`Unknown subscription id ${id}`)
      let type = sub.type
      if (type === SUBSCRIPTIONS.FILTER) {
        let removed = await this.rpc.sendMethod('eth_uninstallFilter', sub.id)
        if (!removed) throw new Error('The node did not remove the filter')
      }
      this.provider.unsubscribe(sub.id)
      this.subscriptions.delete(id)
      return
    } catch (err) {
      return Promise.reject(err)
    }
  }
  async clear (cleanNode) {
    try {
      let q = []
      this.subscriptions.forEach(sub => {
        q.push(this.remove(sub.id))
      })
      let res = await Promise.all(q)
      if (cleanNode) await this.removeAllNodeFilters()
      return res
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async removeAllNodeFilters () {
    try {
      let filter = await this.filter(Object.keys(filters)[0])
      let id = parseInt(filter.id)
      let payload = new Array(id + 1).fill()
        .map((v, i) => this.rpc.toPayload('eth_uninstallFilter', '0x' + Number(i + 1).toString(16)))
      filter.delete()
      let res = await this.rpc.send(payload)
      return res
    } catch (err) {
      // hide this errors
    }
  }

  list () {
    return [...this.subscriptions.keys()]
  }
}

function addSubscription (id, type, payload, options = {}) {
  let subscription = new Subscription(id, type)
  subscription.delete = () => this.remove(id)
  this.provider.subscribe(id, payload,
    (err, res) => subscription.send(err, res, options))
  this.subscriptions.set(id, subscription)
  return subscription
}

function methodId (key) {
  this.sid++
  return `${key}_${this.sid}`
}

export default Subscribe
