"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.Nod3Hub = Nod3Hub;exports.default = void 0;
var _Nod = require("./Nod3");
var _types = require("../lib/types");
var _utils = require("../lib/utils");

function Hub(instances) {
  const next = (0, _utils.RoundRobin)(instances);
  const getNode = key => instances[key];
  const searchNode = cb => {
    let key = instances.findIndex(cb);
    if (undefined === key) return key;
    let nod3 = instances[key];
    return { nod3, key };
  };
  return Object.freeze({ next, getNode, searchNode });
}

const isNod3Module = thing => typeof thing === 'object' && thing._type === _types.NOD3_MODULE;

function Nod3Hub(providers, options = {}, { routeTo } = {}) {
  const instances = providers.map(provider => new _Nod.Nod3(provider, options));
  const hub = Hub(instances);

  const routeToInstance = (routeTo, { module, method }) => {
    let instance;
    if (typeof routeTo === 'function') {
      let node = routeTo({ module, method });
      instance = hub.getNode(node);
    }
    return instance;
  };

  const getFreeInstance = instance => {
    instance = instance || hub.next();
    if (instance.isRequesting() === false) return instance;
    let free = instances.find(nod3 => nod3.isRequesting() === false);
    free = free || instance;
    return free;
  };

  const moduleProxy = (module, instanceModule, routeTo) => {
    return new Proxy(instanceModule, {
      get: function (obj, method) {
        // route by method
        let newInstance = routeToInstance(routeTo, { module, method });
        return newInstance ? newInstance[module][method] : obj[method];
      } });

  };
  // nod3 instance proxy
  const nod3 = new Proxy({}, {
    get: function (obj, module) {
      if (module === _types.NOD3_HUB) return true;
      let instance;
      instance = routeToInstance(routeTo, { module }) || getFreeInstance();
      let instanceModule = instance[module];
      // nod3 module proxy
      if (isNod3Module(instanceModule)) {
        instanceModule = moduleProxy(module, instanceModule, routeTo);
      }
      return instanceModule;
    },
    set: function (obj, prop, value) {
      for (let instance of instances) {
        instance[prop] = value;
      }
      return true;
    },
    apply: function (fn, that, args) {
      return hub.next().apply(fn, args);
    } });

  return Object.freeze({ nod3, hub });
}var _default =

Nod3Hub;exports.default = _default;