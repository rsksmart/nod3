
import { Nod3 } from './Nod3'
import { NOD3_MODULE, NOD3_HUB } from '../lib/types'
import { RoundRobin } from '../lib/utils'

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

const isNod3Module = thing => typeof thing === 'object' && thing._type === NOD3_MODULE

export function Nod3Hub (providers, options = {}, { routeTo } = {}) {
  const instances = providers.map(provider => new Nod3(provider, options))
  const hub = Hub(instances)

  const routeToInstance = (routeTo, { module, method }) => {
    let instance
    if (typeof routeTo === 'function') {
      let node = routeTo({ module, method })
      instance = hub.getNode(node)
    }
    return instance
  }

  const moduleProxy = (module, instanceModule, routeTo) => {
    return new Proxy(instanceModule, {
      get: function (obj, method) {
        // route by method
        let newInstance = routeToInstance(routeTo, { module, method })
        return (newInstance) ? newInstance[module][method] : obj[method]
      }
    })
  }
  // nod3 instance proxy
  const nod3 = new Proxy({}, {
    get: function (obj, module) {
      if (module === NOD3_HUB) return true
      let instance
      instance = routeToInstance(routeTo, { module }) || hub.next()
      let instanceModule = instance[module]
      // nod3 module proxy
      if (isNod3Module(instanceModule)) {
        instanceModule = moduleProxy(module, instanceModule, routeTo)
      }
      return instanceModule
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
