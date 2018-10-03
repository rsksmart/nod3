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
      let filter = new Subscription(id, SUBSCRIPTIONS.FILTER)
      filter.delete = () => this.remove(id)
      let payload = this.rpc.toPayload('eth_getFilterChanges', [id])
      let cb = filterDef.cb
      return addSubscription.bind(this)(filter, payload, cb)
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
      args.push(this.nod3.isBatch())
      let m = method(...args)
      let payload = this.rpc.toPayload(m.method, m.params)
      let subscription = new Subscription(methodId.bind(this)(), SUBSCRIPTIONS.METHOD)
      return addSubscription.bind(this)(subscription, payload)
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
      this.provider.unsubscribe(id)
      this.subscriptions.delete(id)
      return
    } catch (err) {
      return Promise.reject(err)
    }
  }
  list () {
    return [...this.subscriptions.keys()]
  }

}

function addSubscription (subscription, payload, cb) {
  let id = subscription.id
  this.provider.subscribe(id, payload, (err, res) => subscription.emit(err, res, cb))
  this.subscriptions.set(id, subscription)
  return subscription
}

function methodId () {
  this.sid++
  return `${SUBSCRIPTIONS.METHOD}_${this.sid}`
}

export default Subscribe
