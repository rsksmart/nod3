import { netName, toDecimal } from '../lib/utils'

/**
 * @module net
 * @typicalname nod3.net
 */

export default {
  /**
  *  Returns true if client is listening for networks connections.
   * @returns {Promise.<Boolean>}
   * @see https://github.com/ethereum/wiki/wiki/JSON-RPC#net_listening
   */

  listening () {
    return { method: 'net_listening' }
  },

  /**
  * Returns the network id.
  * @returns {Promise.<String>} network id
  * @see https://github.com/ethereum/wiki/wiki/JSON-RPC#net_version
  */

  version () {
    const formatVersion = (id) => {
      let name = netName(id)
      return { id, name }
    }
    return { method: 'net_version', formatters: [formatVersion] }
  },

  /**
  *  Returns number of peers connected to the client.
  * @returns {Promise.<QUANTITY>} peers
  * @see https://github.com/ethereum/wiki/wiki/JSON-RPC#net_peercount
  */

  peerCount () {
    return { method: 'net_peerCount', formatters: [(value) => toDecimal(value)] }
  }
}
