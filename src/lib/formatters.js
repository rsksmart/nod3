import { toDecimal } from './utils'

export const formatKey = (obj, key, formatter) => {
  if (!obj) return obj
  let value = obj[key]
  if (undefined !== value) {
    obj[key] = formatter(value)
  }
  return obj
}

export const format = (obj, formats) => {
  for (let key in formats) {
    obj = formatKey(obj, key, formats[key])
  }
  return obj
}

const addDefaultFields = (fields) => {
  let def = {
    transactionIndex: toDecimal,
    blockNumber: toDecimal,
    timestamp: toDecimal,
    gas: toDecimal,
    gasUsed: toDecimal
  }
  return Object.assign(def, fields)
}

export const blockFormatter = block => {
  return format(block, {
    number: toDecimal,
    timestamp: toDecimal,
    size: toDecimal,
    gasUsed: toDecimal,
    gasLimit: toDecimal
  })
}

export const syncFormatter = sync => {
  if (typeof sync === 'object') {
    return format(sync, {
      startingBlock: toDecimal,
      currentBlock: toDecimal,
      highestBlock: toDecimal
    })
  }
  return sync
}

export const txFormatter = tx => {
  return format(tx, addDefaultFields({
    nonce: toDecimal
  }))
}

export const txReceiptFormatter = receipt => {
  receipt.logs = receipt.logs.map(log => logFormatter(log))
  return format(receipt, addDefaultFields({
    cumulativeGasUsed: toDecimal
  }))
}

export const logFormatter = log => {
  return format(log, addDefaultFields({
    logIndex: toDecimal
  }))
}
