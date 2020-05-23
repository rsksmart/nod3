import { NETWORKS } from './types'

export const checkBlockHash = value => {
  value = String(value).toLowerCase()
  if (/^(0x)[0-9a-f]{64}$/.test(value)) return value
  if (/^[0-9a-f]{64}$/.test(value)) return '0x' + value
  return null
}

export const isBlockHash = value => checkBlockHash(value) !== null

export const isHashOrNumber = (hashOrNumber, toHex = true) => {
  let hash = (isBlockHash(hashOrNumber)) ? hashOrNumber : null
  let number = (!isNaN(parseInt(hashOrNumber)) && !hash) ? hashOrNumber : null
  number = (number !== null && toHex) ? toHexStr(hashOrNumber) : number
  return { hash, number }
}

export const isHexStr = str => /^0x[0-9a-f]*$/.test(str)

export const toHexStr = (value, ox = '0x') => {
  if (isHexStr(value) || value === null) return value
  let hex = ox + Number(value).toString(16)
  return (parseInt(hex) === Number(value)) ? hex : value
}

export const netName = id => NETWORKS[id]
export const isNet = (id, name) => netName(id) === name

export const toBase10 = (value, asNumber = false) => {
  const type = typeof value
  value = Number(value).toString(10)
  return (type === 'number' || asNumber) ? Number(value) : value
}

export const toDecimal = value => (undefined !== value) ? parseInt(toBase10(value)) : value

export const RoundRobin = (arr, index) => {
  index = index || 0
  if (!Array.isArray(arr)) throw new Error('The first argument must be an array')
  return () => {
    if (index >= arr.length) index = 0
    return arr[index++]
  }
}
