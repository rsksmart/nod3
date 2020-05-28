
import { Nod3 } from './Nod3'
import { RoundRobin } from '../lib/utils'

export const NOD3_HUB_NAME = 'isNod3Hub'

function Hub (instances) {
  const next = RoundRobin(instances)
  const getNode = key => instances[key]
  const searchNode = cb => {
    let key = instances.findIndex(cb)
    if (undefined === key) return key
    let nod3 = instances[key]
    return { nod3, key }
  }
  return Object.freeze({ next, getNode, searchNode })
}

export function Nod3Hub (providers, options = {}, routeTo) {
  const instances = providers.map(provider => new Nod3(provider))
  const hub = Hub(instances)

  const nod3 = new Proxy({}, {
    get: function (obj, prop) {
      if (prop === NOD3_HUB_NAME) return true
      if (routeTo) {
        let instance = hub.getNode(routeTo(prop))
        if (instance) return instance[prop]
      }
      return hub.next()[prop]
    },
    set: function (obj, prop, value) {
      for (let instance of instances) {
        instance[prop] = value
      }
      return true
    },
    apply: function (fn, that, args) {
      return hub.next().apply(fn, args)
    }
  })
  return Object.freeze({ nod3, hub })
}

export default Nod3Hub
