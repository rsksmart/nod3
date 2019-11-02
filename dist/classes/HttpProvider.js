"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = exports.HttpProvider = void 0;var _Provider = require("./Provider");
var _HttpClient = require("../classes/HttpClient");

class HttpProvider extends _Provider.Provider {
  constructor(url, options = {}) {
    super(url, options);
    this.client = new _HttpClient.HttpClient(url, { keepAlive: true });
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
      let headers = { 'Content-Type': 'application/json' };
      const res = await this.client.post(payload, { headers }).
      catch(err => {
        // wrap rskj errors
        err = err.response && err.response.data ? err.response.data.error : err;
        return Promise.reject(err.message || `${err}`);
      });
      return res.data;
    } catch (err) {
      return Promise.reject(err);
    }
  }}exports.HttpProvider = HttpProvider;var _default =


HttpProvider;exports.default = _default;