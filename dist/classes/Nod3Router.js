"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.Nod3Router = Nod3Router;var _Nod3Hub = require("./Nod3Hub");
var _modules = _interopRequireDefault(require("../modules"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

/* const methods = Object.keys(modules).reduce((v, a) => {
  v[a] = Object.keys(modules[a])
  return v
}, {}) */

const SUBSCRIBE = 'subscribe';

const getModule = name => {
  if (!_modules.default[name]) throw new Error(`Unknown module: ${name}`);
  return _modules.default[name];
};

function Nod3Router(providers, options = {}) {
  let routes = {};

  const getRoutes = () => Object.assign({}, routes);

  const resolve = ({ module, method }) => {
    let route = routes[module];
    if (undefined === route) return;
    if (typeof route !== 'object') return route;
    return route[method];
  };

  const routeTo = ({ module, method }, hub) => {
    let key = resolve({ module, method });
    if (undefined !== key) {
      return key;
    }
  };

  const { hub, nod3 } = (0, _Nod3Hub.Nod3Hub)(providers, options, { routeTo });

  const add = ({ module, method, to }) => {
    to = parseInt(to);
    if (isNaN(to) || !hub.getNode(to)) throw new Error(`Invalid key: ${to}`);
    if (module !== SUBSCRIBE && !getModule(module)) throw new Error(`Unknown module ${module}`);
    let route = routes[module];
    if (route !== undefined && typeof route !== 'object') throw new Error(`The route exists`);
    if (method) {
      if (!route) routes[module] = {};
      routes[module][method] = to;
    } else {
      routes[module] = to;
    }
  };
  const remove = (module, method) => {
    if (!method) {
      delete routes[module];
    } else {
      if (routes[module]) delete routes[module][method];
    }
  };
  const reset = () => {
    routes = undefined;
    routes = {};
  };

  const router = Object.freeze({ add, remove, reset, resolve, getRoutes });
  return Object.freeze({ nod3, hub, router });
}