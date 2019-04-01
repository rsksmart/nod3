'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.Nod3 = undefined;exports.


























































format = format;var _utils = require('../lib/utils');var utils = _interopRequireWildcard(_utils);var _eth = require('../modules/eth');var _eth2 = _interopRequireDefault(_eth);var _rsk = require('../modules/rsk');var _rsk2 = _interopRequireDefault(_rsk);var _net = require('../modules/net');var _net2 = _interopRequireDefault(_net);var _txpool = require('../modules/txpool');var _txpool2 = _interopRequireDefault(_txpool);var _Subscribe = require('../classes/Subscribe');var _HttpProvider = require('../classes/HttpProvider');var _types = require('../lib/types');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}const BATCH_KEY = 'isBatch' + Math.random();const isBatch = key => key === BATCH_KEY;class Nod3 {constructor(provider, options = {}) {this.provider = provider;this.rpc = provider.rpc;this.log = options.logger || function (err) {console.log(err);};this.isBatch = isBatch;this.BATCH_KEY = BATCH_KEY;this.utils = utils;this.eth = addModule(_eth2.default, this);this.rsk = addModule(_rsk2.default, this);this.net = addModule(_net2.default, this);this.txpool = addModule(_txpool2.default, this);this.subscribe = new _Subscribe.Subscribe(this);}isConnected() {return this.provider.isConnected();}async batchRequest(commands, methodName) {try {let batch = commands.map(c => {let mName = methodName || c[0];mName = mName.split('.');let params = methodName ? c : c.slice(1);if (mName.length > 2) throw new Error(`Invalid method ${c[0]}`);let ctx = mName[1] ? this[mName[0]] : this;let method = ctx[mName.pop()];return method(...params, this.BATCH_KEY);});let payload = batch.map(b => this.rpc.toPayload(b.method, b.params));let data = await this.rpc.send(payload);return data.map((d, i) => format(d, batch[i].formatters));} catch (err) {return Promise.reject(err);}}static send(payload) {let { method, params, formatters } = payload;return this.rpc.sendMethod(method, params).then(res => format(res, formatters)).catch(err => this.log(err));}}exports.Nod3 = Nod3;function format(data, formatters) {
  if (Array.isArray(formatters)) {
    formatters = formatters.filter(f => typeof f === 'function');
    formatters.forEach(f => {data = f(data);});
  }
  return data;
}

function addModule(mod, nod3) {
  // Module proxy
  return new Proxy(mod, {
    get(obj, prop) {
      if (prop === '_type') return _types.NOD3_MODULE;
      let value = obj[prop];
      if (typeof value !== 'function') return value;
      // Module method proxy
      return new Proxy(value, {
        //  intercept function calls
        apply(fn, thisArg, args) {
          let aLen = args.length;
          // batch request
          if (fn.length < aLen && isBatch(args[aLen - 1])) {
            args.pop();
            return fn(...args);
          }
          // single execution
          return Nod3.send.bind(nod3)(fn(...args));
        } });

    } });

}

Nod3.providers = { HttpProvider: _HttpProvider.HttpProvider };