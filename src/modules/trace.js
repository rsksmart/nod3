export default {
  transaction (txHash) {
    return { method: 'trace_transaction', params: [txHash] }
  }
}
