import { expect } from 'chai'
import { nod3Creator, checkDecimal, getRandomBlockNumber } from '../shared'
let nod3 = global.nod3 || nod3Creator()
const txs = ['0x3dc63d1963891243522bb5cca95127afbefa8b2a9dde6e62e5cd95c35fda8457']
const blocks = [...Array(1)].map(() => getRandomBlockNumber())
describe(`# trace`, function () {
  describe(`trace_transaction()`, function () {
    it(`should return a transaction trace`, async () => {
      for (let tx of txs) {
        const trace = await nod3.trace.transaction(tx)
        expect(trace).to.be.an('array', 'trace should be an array')
        for (let action of trace) {
          testAction(action)
        }
      }
    })
  })
  describe(`trace_block()`, function () {
    this.timeout(90000)
    for (let blockNumber of blocks) {
      it(`should return a trace of block ${blockNumber}`, async () => {
        const blocks = await nod3.rsk.getBlocksByNumber(blockNumber)
        const { hash } = blocks.filter(b => b.inMainChain).pop()
        const block = await nod3.eth.getBlock(hash, false)
        const { transactions } = block
        const trace = await nod3.trace.block(hash)
        expect(trace).to.be.an('array', 'trace should be an array')
        const hashes = new Set(...[trace.map(t => t.transactionHash)])
        expect(hashes.size).to.be.equal(transactions.length, 'transactions length')
        expect([...hashes]).to.be.deep.equal(transactions, 'transactions hashes')
        for (let item of trace) {
          expect(item).to.be.an('object')
          testAction(item)
        }
      })
    }
  })
})

function testAction (action) {
  expect(action).to.be.an('object', 'action should be an object')
  expect(Object.keys(action)).to.include.members(['blockNumber', 'blockHash', 'transactionHash', 'action', 'result'], 'action properties')
  checkDecimal(action.blockNumber)
}
