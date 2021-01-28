
/**
 * @module debug
 * @typicalname nod3.debug
 */

export default {
  /**
   * @param {String} txHash
   * @returns {Object} debug trace
   * @see https://geth.ethereum.org/docs/rpc/ns-debug#debug_tracetransaction
   */
  traceTransaction (txHash) {
    return { method: 'debug_traceTransaction', params: [txHash] }
  }
}
