import * as sinon from 'sinon'
import { fakeRpcSendMethod, nod3Creator } from '../shared'
import { txPoolValidateContent } from './txPool.shared'

let nod3 = global.nod3 || nod3Creator()

describe(`# TxPool content format`, () => {
  let content
  before(async function () {
    sinon.replace(nod3.rpc, 'sendMethod', fakeRpcSendMethod)
    content = await nod3.txpool.content()
  })

  after(() => { sinon.restore() })

  it('Content', () => {
    txPoolValidateContent(content)
  })
})
