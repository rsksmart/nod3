import { expect } from 'chai'
import { nod3Creator } from '../shared'

let nod3 = global.nod3 || nod3Creator()

describe('#eth.blockNumber', function () {
  it(`should return a decimal block number`, async function () {
    let blockNumber = await nod3.eth.blockNumber()
    console.log(blockNumber)
    expect(blockNumber).to.be.equal(parseInt(blockNumber))
  })
  it('should be equal to last block', async function () {
    let blockNumber = await nod3.eth.blockNumber()
    let lastBlock = await nod3.eth.getBlock('latest')
    expect(lastBlock.number).to.be.equal(blockNumber)
  })
})
