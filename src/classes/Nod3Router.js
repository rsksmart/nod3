import { Nod3Hub } from './Nod3Hub'
import modules from '../modules'

/* const methods = Object.keys(modules).reduce((v, a) => {
  v[a] = Object.keys(modules[a])
  return v
}, {}) */

const SUBSCRIBE = 'subscribe'

const getModule = name => {
  if (!modules[name]) throw new Error(`Unknown module: ${name}`)
  return modules[name]
}

export function Nod3Router (providers, options = {}) {
  let routes = {}

  const getRoutes = () => Object.assign({}, routes)

  const resolve = ({ module, method }) => {
    let route = routes[module]
    if (undefined === route) return
    if (typeof route !== 'object') return route
    return route[method]
  }

  const routeTo = ({ module, method }, hub) => {
    let key = resolve({ module, method })
    if (undefined !== key) {
      return key
    }
  }

  const { hub, nod3 } = Nod3Hub(providers, options, { routeTo })

  const add = ({ module, method, to }) => {
    to = parseInt(to)
    if (isNaN(to) || !hub.getNode(to)) throw new Error(`Invalid key: ${to}`)
    if (module !== SUBSCRIBE && !getModule(module)) throw new Error(`Unknown module ${module}`)
    let route = routes[module]
    if (route !== undefined && typeof route !== 'object') throw new Error(`The route exists`)
    if (method) {
      if (!route) routes[module] = {}
      routes[module][method] = to
    } else {
      routes[module] = to
    }
  }
  const remove = (module, method) => {
    if (!method) {
      delete routes[module]
    } else {
      if (routes[module]) delete routes[module][method]
    }
  }
  const reset = () => {
    routes = undefined
    routes = {}
  }

  const router = Object.freeze({ add, remove, reset, resolve, getRoutes })
  return Object.freeze({ nod3, hub, router })
}
