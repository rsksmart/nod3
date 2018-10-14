'use strict';Object.defineProperty(exports, "__esModule", { value: true });class JsonRpc {
  constructor(provider) {
    this.id = 0;
    this.provider = provider;
  }

  async send(payload) {
    try {
      let data = await this.provider.send(payload);
      if (undefined === data) throw new Error('No data');
      if (Array.isArray(payload)) return data.map(d => this.checkData(d));else
      return this.checkData(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  sendMethod(method, params) {
    let payload = this.toPayload(method, params);
    return this.send(payload);
  }

  checkData(data) {
    return this.isValidResponse(data) ? data.result : null;
  }

  toPayload(method, params) {
    let id = this.getId();
    return jsonRpcPayload(method, params, id);
  }

  getId() {
    this.id++;
    return this.id;
  }

  isValidResponse(res) {
    return Array.isArray(res) ? res.every(validate) : validate(res);
    function validate(message) {
      return !!message &&
      !message.error &&
      message.jsonrpc === '2.0' &&
      typeof message.id === 'number' &&
      message.result !== undefined;
    }
  }}exports.JsonRpc = JsonRpc;


const jsonRpcPayload = exports.jsonRpcPayload = (method, params = [], id = 666) => {
  params = Array.isArray(params) ? params : [params];
  return {
    jsonrpc: '2.0',
    method,
    params,
    id };

};exports.default =

JsonRpc;