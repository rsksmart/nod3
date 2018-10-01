'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.HttpProvider = undefined;var _axios = require('axios');var _axios2 = _interopRequireDefault(_axios);
var _Provider = require('./Provider');
var _JsonRpc = require('./JsonRpc');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

class HttpProvider extends _Provider.Provider {
  constructor(options = {}) {
    super(options.url);
  }
  send(payload) {
    let url = this.url;
    let headers = { 'Content-Type': 'application/json' };
    return _axios2.default.post(url, payload, { headers }).then(res => res.data);
  }
  isConnected() {
    return this.send((0, _JsonRpc.jsonRpcPayload)('net_listening'));
  }}exports.HttpProvider = HttpProvider;