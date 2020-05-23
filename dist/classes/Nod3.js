"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.format = format;exports.Nod3 = void 0;var utils = _interopRequireWildcard(require("../lib/utils"));
var _Subscribe = require("../classes/Subscribe");
var _HttpProvider = require("../classes/HttpProvider");
var _CurlProvider = require("../classes/CurlProvider");
var _types = require("../lib/types");
var _modules = _interopRequireDefault(require("../modules"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _getRequireWildcardCache() {if (typeof WeakMap !== "function") return null;var cache = new WeakMap();_getRequireWildcardCache = function () {return cache;};return cache;}function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;}if (obj === null || typeof obj !== "object" && typeof obj !== "function") {return { default: obj };}var cache = _getRequireWildcardCache();if (cache && cache.has(obj)) {return cache.get(obj);}var newObj = {};var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;if (desc && (desc.get || desc.set)) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}newObj.default = obj;if (cache) {cache.set(obj, newObj);}return newObj;}

const BATCH_KEY = 'isBatch' + Math.random();
const isBatch = key => key === BATCH_KEY;

class Nod3 {
  constructor(provider, { logger, debug } = {}) {
    this.provider = provider;
    this.rpc = provider.rpc;
    this.log = logger || function (err) {console.log(err);};
    if (debug && typeof debug !== 'function') debug = res => this.logDebug(res);
    this.doDebug = debug;
    this.isBatch = isBatch;
    this.BATCH_KEY = BATCH_KEY;
    this.utils = utils;
    this.skipFormatters = !!(provider instanceof _CurlProvider.CurlProvider);
    // modules
    for (let module in _modules.default) {
      this[module] = addModule(_modules.default[module], this);
    }
    this.subscribe = new _Subscribe.Subscribe(this);
  }

  setDebug(debug) {
    this.doDebug = debug;
  }
  logDebug({ method, params, time }) {
    this.log(`${method} (${params}) -- time:${time}ms`);
  }
  setSkipFormatters(v) {
    this.skipFormatters = !!v;
  }

  isConnected() {
    return this.provider.isConnected();
  }

  async batchRequest(commands, methodName) {
    try {
      let { doDebug } = this;
      let batch = commands.map(c => {
        let mName = methodName || c[0];
        mName = mName.split('.');
        let params = methodName ? c : c.slice(1);
        if (mName.length > 2) throw new Error(`Invalid method ${c[0]}`);

        let ctx = mName[1] ? this[mName[0]] : this;
        let method = ctx[mName.pop()];
        return method(...params, this.BATCH_KEY);
      });
      let payload = batch.map(b => this.rpc.toPayload(b.method, b.params));
      let time = doDebug ? Date.now() : undefined;
      let data = await this.rpc.send(payload);
      if (doDebug) {
        time = Date.now() - time;
        let method = [...new Set(payload.map(({ method }) => method))];
        let params = payload.map(({ params }) => params);
        doDebug({ method, params, time });
      }
      return data.map((d, i) => format(d, batch[i].formatters));
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async send(payload) {
    let { method, params, formatters } = payload;
    let { rpc, skipFormatters, doDebug } = this;
    let time = doDebug ? Date.now() : null;
    let res = await rpc.sendMethod(method, params);
    if (doDebug) {
      time = Date.now() - time;
      doDebug({ method, params, time });
    }
    return skipFormatters === true ? res : format(res, formatters);
  }}exports.Nod3 = Nod3;


function format(data, formatters) {
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

Nod3.providers = { HttpProvider: _HttpProvider.HttpProvider, CurlProvider: _CurlProvider.CurlProvider };