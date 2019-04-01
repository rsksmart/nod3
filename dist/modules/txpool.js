'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.default = {

  content() {
    return { method: 'txpool_content', formatters: [txPoolFormatter] };
  },

  inspect() {
    return { method: 'txpool_inspect', formatters: [txPoolFormatter] };
  },

  status() {
    return { method: 'txpool_status', formatters: [txPoolFormatter] };
  } };


// fix bad rskj response
// see: https://github.com/rsksmart/rskj/issues/689
const txPoolFormatter = exports.txPoolFormatter = result => typeof result === 'string' ? JSON.parse(result) : result;