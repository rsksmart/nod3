"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.Nod3Hub = Nod3Hub;exports.default = exports.NOD3_HUB_NAME = void 0;
var _Nod = require("./Nod3");
var _utils = require("../lib/utils");

const NOD3_HUB_NAME = 'isNod3Hub';exports.NOD3_HUB_NAME = NOD3_HUB_NAME;

function Nod3Hub(providers, options = {}) {
  const instances = providers.map(provider => new _Nod.Nod3(provider));
  const next = (0, _utils.RoundRobin)(instances);
  return new Proxy({}, {
    get: function (obj, prop) {
      if (prop === NOD3_HUB_NAME) return true;
      if (prop === 'subscribe') return instances[0][prop];
      return next()[prop];
    },
    set: function (obj, prop, value) {
      for (let instance of instances) {
        instance[prop] = value;
      }
      return true;
    },
    apply: function (fn, that, args) {
      return next().apply(fn, args);
    } });

}var _default =

Nod3Hub;exports.default = _default;