/**
 * @module rsk
 * @typicalname nod3.rsk
 */

export default {
  /**
   * Returns a list of block hashes for a given block number with the main chain block identified.
   * @param {Number} blockNumber
   * @returns {Promise.<Array>}: Array of block objects.
   */
  getBlocksByNumber (number) {
    let method = 'eth_getBlocksByNumber'
    let params = [number]
    return { method, params }
  }
}
