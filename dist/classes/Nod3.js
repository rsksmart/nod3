'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.Nod3 = undefined;var _JsonRpc = require('./JsonRpc');
var _utils = require('../lib/utils');var utils = _interopRequireWildcard(_utils);
var _eth = require('../modules/eth');var _eth2 = _interopRequireDefault(_eth);
var _rsk = require('../modules/rsk');var _rsk2 = _interopRequireDefault(_rsk);
var _net = require('../modules/net');var _net2 = _interopRequireDefault(_net);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}

const IS_BATCH = 'isBatch' + Math.random();
const isBatch = key => key ? key === IS_BATCH : IS_BATCH;

class Nod3 {
  constructor(provider, options) {
    this.rpc = new _JsonRpc.JsonRpc(provider);
    this.utils = utils;
    this.eth = addModule(_eth2.default, this);
    this.rsk = addModule(_rsk2.default, this);
    this.net = addModule(_net2.default, this);
  }

  isConnected() {
    return this.rpc.send(this.rpc.toPayload('net_listening'));
  }

  async batchRequest(commands, methodName) {
    try {
      let batch = commands.map(c => {
        let mName = methodName || c[0];
        mName = mName.split('.');
        let params = methodName ? c : c.slice(1);

        if (mName.length > 2) throw new Error(`Invalid method ${c[0]}`);

        let ctx = mName[1] ? this[mName[0]] : this;
        let method = ctx[mName.pop()];
        return method(...params, isBatch());
      });
      let payload = batch.map(b => this.rpc.toPayload(b.method, b.params));
      let data = await this.rpc.send(payload, true);
      return data.map((d, i) => format(d, batch[i].formatter));
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static send(payload) {
    let method, params, formatter;
    ({ method, params, formatter } = payload);
    return this.rpc.send(this.rpc.toPayload(method, params)).
    then(res => format(res, formatter));
  }}exports.Nod3 = Nod3;


function format(data, formatter) {
  return formatter ? formatter(data) : data;
}

function addModule(mod, parent) {
  // Module proxy
  return new Proxy(mod, {
    get(obj, prop) {
      let value = obj[prop];
      if (typeof value !== 'function') return value;
      // Module method proxy
      return new Proxy(value, {
        //  intercept function calls
        apply(fn, thisArg, args) {
          let aLen = args.length;
          // batch request
          if (fn.length < aLen && isBatch(args[aLen - 1])) {
            return fn(...args);
          }
          // single execution
          const send = Nod3.send.bind(parent);
          return send(fn(...args));
        } });

    } });

}