import { netName, toDecimal } from '../lib/utils'
export default {
  listening () {
    return { method: 'net_listening' }
  },
  version () {
    const formatVersion = (id) => {
      let name = netName(id)
      return { id, name }
    }
    return { method: 'net_version', formatters: [formatVersion] }
  },
  peerCount () {
    return { method: 'net_peerCount', formatters: [(value) => toDecimal(value)] }
  }
}