export default {
  transaction (txHash) {
    return { method: 'trace_transaction', params: [txHash] }
  },
  block (blockHash) {
    return { method: 'trace_block', params: [blockHash] }
  }
}
