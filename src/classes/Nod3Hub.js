
import { Nod3 } from './Nod3'
import { RoundRobin } from '../lib/utils'

export const NOD3_HUB_NAME = 'isNod3Hub'

export function Nod3Hub (providers, options = {}) {
  const instances = providers.map(provider => new Nod3(provider))
  const next = RoundRobin(instances)
  return new Proxy({}, {
    get: function (obj, prop) {
      if (prop === NOD3_HUB_NAME) return true
      if (prop === 'subscribe') return instances[0][prop]
      return next()[prop]
    },
    set: function (obj, prop, value) {
      for (let instance of instances) {
        instance[prop] = value
      }
      return true
    },
    apply: function (fn, that, args) {
      return next().apply(fn, args)
    }
  })
}

export default Nod3Hub
