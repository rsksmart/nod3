import { netName, toDecimal } from '../lib/utils'
export default {
  listening () {
    return { method: 'net_listening' }
  },
  version () {
    let formatter = (id) => {
      let name = netName(id)
      return { id, name }
    }
    return { method: 'net_version', formatter }
  },
  peerCount () {
    return { method: 'net_peerCount', formatter: (value) => toDecimal(value) }
  }
}