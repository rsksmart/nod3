import { expect } from 'chai'
import { fakeNod3 } from '../fakes'
import { checkDecimalFields } from '../shared'

describe(`# Transaction Receipt format`, fakeNod3((nod3) => {
  it('Fields', async () => {
    const receipt = await nod3.eth.getTransactionReceipt()
    const { logs } = receipt
    expect(Array.isArray(logs)).equal(true)

    describe('  Decimal fields', checkDecimalFields(receipt, [
      'blockNumber',
      'transactionIndex',
      'cumulativeGasUsed'
    ]))
    let i = 0
    for (let log of logs) {
      describe(`  Log #${i} Decimal fields`, checkDecimalFields(log, [
        'logIndex',
        'blockNumber',
        'transactionIndex'
      ]
      ))
      i++
    }
  })
}))
