'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.default = {
  getBlocksByNumber(number) {
    let method = 'eth_getBlocksByNumber';
    let params = [number];
    return { method, params };
  } };