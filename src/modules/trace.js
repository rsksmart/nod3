import { addTraceIndex } from '../lib/formatters'

/**
 * @module trace
 * @typicalname nod3.trace
 */

export default {
  transaction (txHash) {
    return { method: 'trace_transaction', params: [txHash], formatters: [addTraceIndex] }
  },
  block (blockHash) {
    return { method: 'trace_block', params: [blockHash], formatters: [addTraceIndex] }
  }
}
