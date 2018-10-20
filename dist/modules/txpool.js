'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.default = {

  content() {
    return { method: 'txpool_content', formatter: txPoolFormatter };
  },

  inspect() {
    return { method: 'txpool_inspect', formatter: txPoolFormatter };
  },

  status() {
    return { method: 'txpool_status', formatter: txPoolFormatter };
  } };


const txPoolFormatter = exports.txPoolFormatter = result => JSON.parse(result);