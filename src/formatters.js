export const formatKey = (obj, key, formatter) => {
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

export const toDecimal = value => {
  return parseInt(Number(value).toString(10))
}

export const blockFormatter = block => {
  return format(block, {
    number: toDecimal
  })
}
