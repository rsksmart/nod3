
import { Nod3 } from './Nod3'
import { RoundRobin } from '../lib/utils'

export const NOD3_HUB_NAME = 'isNod3Hub'

function Hub (instances) {
  let subsKey

  const next = RoundRobin(instances)

  const getNode = key => instances[key]

  const getNodeByUrl = url => instances.find(({ provider }) => provider.url === url)
  const getNodeKeyByUrl = url => instances.findIndex(({ provider }) => provider.url === url)

  const subscriber = Object.freeze({
    get: () => getNode(subsKey),
    set: key => {
      if (!isNaN(parseInt(key)) && !instances[key]) {
        throw new Error(`Invalid instance key`)
      }
      subsKey = key
    },
    clear: () => { subsKey = undefined }
  })

  return Object.freeze({ next, getNode, getNodeByUrl, getNodeKeyByUrl, subscriber })
}

export function Nod3Hub (providers, options = {}) {
  const instances = providers.map(provider => new Nod3(provider))
  const hub = Hub(instances)

  const nod3 = new Proxy({}, {
    get: function (obj, prop) {
      if (prop === NOD3_HUB_NAME) return true
      if (prop === 'subscribe') {
        let instance = hub.subscriber.get() || hub.next()
        return instance[prop]
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
