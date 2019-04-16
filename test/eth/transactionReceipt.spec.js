import { expect } from 'chai'
import * as sinon from 'sinon'
import { fakeRpcSendMethod, nod3Creator, checkDecimalFields } from '../shared'
let nod3 = global.nod3 || nod3Creator()

describe(`# Transaction Receipt format`, () => {
  let receipt
  before(async function () {
    sinon.replace(nod3.rpc, 'sendMethod', fakeRpcSendMethod)
    receipt = await nod3.eth.getTransactionReceipt()
  })

  after(() => { sinon.restore() })

  it('Fields', () => {
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
})
