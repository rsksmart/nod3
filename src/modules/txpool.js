import { txFormatter } from '../lib/formatters'

/**
 * @module txpool
* @typicalname nod3.txpool
 */

export default {

  content () {
    return { method: 'txpool_content', formatters: [txPoolFormatter, txPoolTxsFormatter] }
  },

  inspect () {
    return { method: 'txpool_inspect', formatters: [txPoolFormatter] }
  },

  status () {
    return { method: 'txpool_status', formatters: [txPoolFormatter] }
  }
}

// fix bad rskj response
// see: https://github.com/rsksmart/rskj/issues/689
export const txPoolFormatter = result => (typeof result === 'string') ? JSON.parse(result) : result

export const txPoolTxsFormatter = result => {
  result.queued = txPoolApplyTxFilter(result.queued)
  result.pending = txPoolApplyTxFilter(result.pending)
  return result
}

export const txPoolApplyTxFilter = item => {
  return (item) ? txPoolTxs(item, txFormatter) : item
}

export const txPoolTxs = (item, cb) => {
  const result = Object.assign({}, item)
  const addresses = Object.keys(result)
  addresses.forEach(address => {
    const value = item[address]
    const nonces = Object.keys(value)
    nonces.forEach(nonce => {
      const txs = value[nonce]
      value[nonce] = txs.map(tx => {
        tx = fixTxFields(tx)
        return (typeof cb === 'function') ? cb(tx) : tx
      })
    })
    result[address] = value
  })
  return result
}

const renameProp = (obj, prop, newProp) => {
  if (obj.hasOwnProperty(prop)) {
    const value = obj[prop]
    obj[newProp] = value
    delete obj[prop]
  }
  return obj
}

// fix bad rskj response
// see: https://github.com/rsksmart/rskj/issues/689
export const fixTxFields = tx => {
  tx = renameProp(tx, 'blockhash', 'blockHash')
  tx = renameProp(tx, 'blocknumber', 'blockNumber')
  return tx
}
