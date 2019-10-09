export default {
  traceTransaction (txHash) {
    return { method: 'debug_traceTransaction', params: [txHash] }
  }
}
