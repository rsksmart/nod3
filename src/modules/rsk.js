export default {
  getBlocksByNumber (number) {
    let method = 'eth_getBlocksByNumber'
    let params = [number]
    return { method, params }
  }
}
