import { expect } from 'chai'
import { nod3Creator } from '../shared'
let nod3 = global.nod3 || nod3Creator()

describe(`# debug_trace`, function () {
  this.timeout(60000)
  it(`should return a transaction debug trace`, async () => {
    const block = await nod3.eth.getBlock('latest')
    let { transactions } = block
    for (let tx of transactions) {
      const trace = await nod3.debug.traceTransaction(tx)
      expect(trace).to.be.an('object')
    }
  })
})
