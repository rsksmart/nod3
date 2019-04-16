import * as sinon from 'sinon'
import { fakeRpcSendMethod, nod3Creator } from '../shared'
import { validateTransaction } from './tx.shared'
let nod3 = global.nod3 || nod3Creator()

describe(`# Transaction format`, () => {
  let tx
  before(async function () {
    sinon.replace(nod3.rpc, 'sendMethod', fakeRpcSendMethod)
    tx = await nod3.eth.getTransactionByHash()
  })

  after(() => { sinon.restore() })

  it('Fields', () => {
    validateTransaction(tx)
  })
})
