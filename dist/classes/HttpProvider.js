'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.HttpProvider = undefined;var _axios = require('axios');var _axios2 = _interopRequireDefault(_axios);
var _Provider = require('./Provider');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

class HttpProvider extends _Provider.Provider {
  constructor(options = {}) {
    super(options.url);
  }

  async isConnected() {
    try {
      let connected = await this.rpc.sendMethod('net_listening');
      return connected === true;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async send(payload) {
    try {
      let url = this.url;
      let headers = { 'Content-Type': 'application/json' };
      const res = await _axios2.default.post(url, payload, { headers });
      return res.data;
    } catch (err) {
      return Promise.reject(err);
    }
  }}exports.HttpProvider = HttpProvider;