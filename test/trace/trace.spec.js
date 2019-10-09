import { expect } from 'chai'
import { nod3Creator, checkDecimal } from '../shared'
let nod3 = global.nod3 || nod3Creator()
const txs = ['0x3dc63d1963891243522bb5cca95127afbefa8b2a9dde6e62e5cd95c35fda8457']

describe(`#trace_transaction`, function () {
  it(`should return a transaction trace`, async () => {
    for (let tx of txs) {
      const trace = await nod3.trace.transaction(tx)
      expect(trace).to.be.an('array')
      for (let item of trace) {
        expect(item).to.be.an('object')
        expect(item).includes.all.keys(['blockNumber', 'blockHash', 'transactionHash', 'action', 'result'])
        checkDecimal(item.blockNumber)
      }
    }
  })
})
