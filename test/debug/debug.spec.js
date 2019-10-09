import { expect } from 'chai'
import { nod3Creator } from '../shared'
let nod3 = global.nod3 || nod3Creator()
const txs = ['0x3dc63d1963891243522bb5cca95127afbefa8b2a9dde6e62e5cd95c35fda8457']

describe(`#debug_trace`, function () {
  this.timeout(60000)
  it(`should return a transaction debug trace`, async () => {
    for (let tx of txs) {
      const trace = await nod3.debug.traceTransaction(tx)
      expect(trace).to.be.an('object')
      expect(trace).includes.all.keys(['initStorage', 'structLogs'])
    }
  })
})
