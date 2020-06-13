import { expect } from 'chai'
import { nod3Creator } from '../shared'

let nod3 = global.nod3 || nod3Creator()

describe('# eth.blockNumber', function () {
  it(`should return a decimal block number`, async function () {
    let blockNumber = await nod3.eth.blockNumber()
    expect(parseInt(blockNumber)).to.be.equal(parseInt(blockNumber))
  })
  it('should be equal to last block', async function () {
    let lastBlock = await nod3.eth.getBlock('latest')
    let blockNumber = await nod3.eth.blockNumber()
    expect(lastBlock.number).to.be.equal(blockNumber)
  })
})
