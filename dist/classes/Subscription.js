"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.Subscription = void 0;var _types = require("../lib/types");
var _Nod = require("./Nod3");

class Subscription {
  constructor(id, type) {
    if (!id) throw new Error('Missing id');
    let isSubsType = Object.values(_types.SUBSCRIPTIONS).includes(type);
    if (!isSubsType) throw new Error(`Unknown subscription type ${type}`);
    this.id = id;
    this.type = type;
    this.errorHandler = err => console.log(err);
    this.dataHandler = null;
  }
  watch(dataCb, errCb) {
    if (undefined !== dataCb) this.dataHandler = dataCb;
    if (undefined !== errCb) this.errorHandler = errCb;
  }
  send(err, data, options = {}) {
    let formatters = { options };
    let cb = options.cb;
    data = (0, _Nod.format)(data, formatters);
    if (cb && typeof cb === 'function') return cb.bind(this)(err, data);else
    {
      if (err && this.errorHandler) this.errorHandler(err);
      if (data !== undefined && this.dataHandler) this.dataHandler(data);
    }
  }
  delete() {
    throw new Error(`Method delete is not implemented on: ${this.id}`);
  }}exports.Subscription = Subscription;