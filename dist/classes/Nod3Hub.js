"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.Nod3Hub = Nod3Hub;exports.default = exports.NOD3_HUB_NAME = void 0;
var _Nod = require("./Nod3");
var _utils = require("../lib/utils");

const NOD3_HUB_NAME = 'isNod3Hub';exports.NOD3_HUB_NAME = NOD3_HUB_NAME;

function Hub(instances) {
  let subsKey;

  const next = (0, _utils.RoundRobin)(instances);

  const getNode = key => instances[key];

  const getNodeByUrl = url => instances.find(({ provider }) => provider.url === url);
  const getNodeKeyByUrl = url => instances.findIndex(({ provider }) => provider.url === url);

  const subscriber = Object.freeze({
    get: () => getNode(subsKey),
    set: key => {
      if (!isNaN(parseInt(key)) && !instances[key]) {
        throw new Error(`Invalid instance key`);
      }
      subsKey = key;
    },
    clear: () => {subsKey = undefined;} });


  return Object.freeze({ next, getNode, getNodeByUrl, getNodeKeyByUrl, subscriber });
}

function Nod3Hub(providers, options = {}, routeTo) {
  const instances = providers.map(provider => new _Nod.Nod3(provider));
  const hub = Hub(instances);

  const nod3 = new Proxy({}, {
    get: function (obj, prop) {
      if (prop === NOD3_HUB_NAME) return true;
      if (prop === 'subscribe') {
        let instance = hub.subscriber.get() || hub.next();
        return instance[prop];
      }
      if (routeTo) {
        let instance = hub.getNode(routeTo(prop));
        if (instance) return instance[prop];
      }
      return hub.next()[prop];
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