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

  const resolve = ({ module }) => {
    return routes[module];
  };

  const routeTo = module => {
    let key = resolve({ module });
    if (undefined !== key) {
      return key;
    }
  };

  const { hub, nod3 } = (0, _Nod3Hub.Nod3Hub)(providers, options, routeTo);

  const add = ({ module, to }) => {
    to = parseInt(to);
    if (isNaN(to) || !hub.getNode(to)) throw new Error(`Invalid key: ${to}`);
    if (module === SUBSCRIBE || getModule(module)) routes[module] = to;
  };
  const remove = item => {
    delete routes[item];
  };

  const router = Object.freeze({ add, remove, resolve, getRoutes });
  return Object.freeze({ nod3, hub, router });
}