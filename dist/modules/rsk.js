"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = {
  getBlocksByNumber(number) {
    let method = 'eth_getBlocksByNumber';
    let params = [number];
    return { method, params };
  } };exports.default = _default;