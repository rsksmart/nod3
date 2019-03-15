import { expect } from 'chai'
import { nod3Creator } from './shared'

let nod3 = global.nod3 || nod3Creator()

describe('Batch request multiple methods', function () {
  it('test', async () => {
    const block = await nod3.eth.getBlock('latest', true)
    const netVersion = await nod3.net.version()
    const { transactions } = block
    let payload = [['eth.getBlock', block.number, true], ['net.version']]
    const nonTxsKeys = payload.length
    payload = payload.concat(transactions.map(tx => ['eth.getTransactionByHash', tx.hash]))
    let result = await nod3.batchRequest(payload)
    expect(Array.isArray(result)).to.be.equal(true)
    expect(result.length).to.be.equal(transactions.length + nonTxsKeys)
    expect(result[0]).deep.equals(block)
    expect(result[1]).deep.equals(netVersion)
    transactions.forEach((tx, i) => {
      expect(tx).deep.equals(result[nonTxsKeys + i])
    })
  })
})
