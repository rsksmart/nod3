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


// fix bad rskj response
// see: https://github.com/rsksmart/rskj/issues/689
const txPoolFormatter = exports.txPoolFormatter = result => typeof result === 'string' ? JSON.parse(result) : result;