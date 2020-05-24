"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = exports.Subscribe = void 0;var _Nod = require("./Nod3");
var _Subscription = require("./Subscription");
var _filters = _interopRequireDefault(require("../lib/filters"));
var _types = require("../lib/types");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

class Subscribe {
  constructor(nod3) {
    this.nod3 = nod3;
    let provider = nod3.provider;
    this.subscriptions = new Map();
    this.provider = provider;
    this.rpc = provider.rpc;
    this.send = _Nod.Nod3.send.bind(nod3);
    this.sid = 0;
  }
  async filter(filterName) {
    try {
      if (typeof filterName !== 'string') throw new Error('The filter name must be a string');
      let filterDef = _filters.default[filterName];
      if (!filterDef) throw new Error(`Unknown filter: ${filterName}`);
      filterDef = filterDef();
      let id = await this.send(filterDef);
      if (!id) throw new Error('The node returns an invalid id');
      let payload = this.rpc.toPayload('eth_getFilterChanges', [id]);
      let cb = filterDef.cb;
      return addSubscription.bind(this)(id, _types.SUBSCRIPTIONS.FILTER, payload, { cb });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async method(name, args) {
    try {
      args = args || [];
      name = name.split('.');
      let module = this.nod3[name[0]];
      if (!module || module._type !== _types.NOD3_MODULE) throw new Error(`Unknown module: ${name[0]}`);
      let method = module[name[1]];
      if (!method) throw new Error(`Unknown method ${name[1]} in module ${name[0]}`);
      args.push(this.nod3.BATCH_KEY);
      let m = method(...args);
      let payload = this.rpc.toPayload(m.method, m.params);
      let type = _types.SUBSCRIPTIONS.METHOD;
      let id = methodId.bind(this)(type);
      return addSubscription.bind(this)(id, type, payload, { formatters: m.formatters });
    } catch (err) {
      return Promise.reject(err);
    }
  }
  async remove(id) {
    try {
      let sub = this.subscriptions.get(id);
      if (!sub) throw new Error(`Unknown subscription id ${id}`);
      let type = sub.type;
      if (type === _types.SUBSCRIPTIONS.FILTER) {
        let removed = await this.rpc.sendMethod('eth_uninstallFilter', sub.id);
        if (!removed) throw new Error('The node did not remove the filter');
      }
      this.provider.unsubscribe(sub.id);
      this.subscriptions.delete(id);
      return;
    } catch (err) {
      return Promise.reject(err);
    }
  }
  async clear(cleanNode) {
    try {
      let q = [];
      this.subscriptions.forEach(sub => {
        q.push(this.remove(sub.id));
      });
      let res = await Promise.all(q);
      if (cleanNode) await this.removeAllNodeFilters();
      return res;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async removeAllNodeFilters() {
    try {
      let filter = await this.filter(Object.keys(_filters.default)[0]);
      let id = parseInt(filter.id);
      let payload = new Array(id + 1).fill().
      map((v, i) => this.rpc.toPayload('eth_uninstallFilter', '0x' + Number(i + 1).toString(16)));
      filter.delete();
      let res = await this.rpc.send(payload);
      return res;
    } catch (err) {
      // hide this errors
    }
  }

  list() {
    return [...this.subscriptions.keys()];
  }}exports.Subscribe = Subscribe;


function addSubscription(id, type, payload, options = {}) {
  let subscription = new _Subscription.Subscription(id, type);
  subscription.delete = () => this.remove(id);
  this.provider.subscribe(id, payload,
  (err, res) => subscription.send(err, res, options));
  this.subscriptions.set(id, subscription);
  return subscription;
}

function methodId(key) {
  this.sid++;
  return `${key}_${this.sid}`;
}var _default =

Subscribe;exports.default = _default;