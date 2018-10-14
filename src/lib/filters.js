export default {
  newBlock () {
    return {
      method: 'eth_newBlockFilter',
      cb: defaultCb
    }
  },
  pendingTransactions () {
    return {
      method: 'eth_newPendingTransactionFilter',
      cb: defaultCb
    }
  }
}

function defaultCb (err, data) {
  // return error to original handler
  if (err) return this.emit(err)
  // emit data if not empty
  if (data && data.length) {
    data.forEach(d => this.emit(null, d))
  }
}
