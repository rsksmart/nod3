import * as sinon from 'sinon'
import { validateBlock } from './block.shared'
import { fakeRpcSendMethod, nod3Creator } from '../shared'
let nod3 = global.nod3 || nod3Creator()

describe(`# Block format`, () => {
  let block
  before(async function () {
    sinon.replace(nod3.rpc, 'sendMethod', fakeRpcSendMethod)
    block = await nod3.eth.getBlock()
  })

  after(() => { sinon.restore() })
  it('valid block', () => {
    validateBlock(block)
  })
})
