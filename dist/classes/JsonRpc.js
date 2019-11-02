"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = exports.jsonRpcPayload = exports.JsonRpc = exports.JsonRpcError = void 0;
const JSONRPC_ERROR_NAME = 'JSON_RPC_ERROR';
class JsonRpcError extends Error {
  constructor({ message, code }, ...args) {
    super(...args);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, JsonRpcError);
    }
    this.message = message;
    this.errorCode = code;
  }
  getName() {
    return JSONRPC_ERROR_NAME;
  }
  static isJsonRpcError(error = {}) {
    const { getName } = error;
    const name = typeof getName === 'function' ? getName() : undefined;
    return name === JSONRPC_ERROR_NAME;
  }}exports.JsonRpcError = JsonRpcError;

class JsonRpc {
  constructor(provider) {
    this.id = 0;
    this.provider = provider;
  }

  async send(payload) {
    try {
      let data = await this.provider.send(payload);
      if (undefined === data) throw new Error('No data');
      if (data.error) throw new JsonRpcError(data.error);
      if (Array.isArray(payload)) return data.map(d => this.checkData(d));else
      return this.checkData(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  sendMethod(method, params = []) {
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
    if (this.id > Number.MAX_SAFE_INTEGER) {
      this.id = 0;
    }
    return this.id;
  }

  isValidId(id) {
    return typeof id === 'number';
  }

  isValidResponse(res) {
    const isValidId = this.isValidId;
    return Array.isArray(res) ? res.every(validate) : validate(res);
    function validate(message) {
      return !!message &&
      !message.error &&
      message.jsonrpc === '2.0' &&
      isValidId(message.id) &&
      message.result !== undefined;
    }
  }}exports.JsonRpc = JsonRpc;


const jsonRpcPayload = (method, params = [], id = 666) => {
  params = Array.isArray(params) ? params : [params];
  return {
    jsonrpc: '2.0',
    method,
    params,
    id };

};exports.jsonRpcPayload = jsonRpcPayload;var _default =

JsonRpc;exports.default = _default;