import { expect } from 'chai'
import { nod3Creator } from '../shared'

let blockNumber = global.blockNumber || Math.floor(Math.random() * 60000)
let nod3 = global.nod3 || nod3Creator()

describe('getBlock', () => {
  let block

  it(`should be return a block by decimal number: #${blockNumber}`, async () => {
    block = await nod3.eth.getBlock(blockNumber)
    expect(block.number).to.be.equal(parseInt(blockNumber))
  })

  it('should be return a block by hash', async () => {
    let hash = block.parentHash
    block = null
    block = await nod3.eth.getBlock(hash)
    expect(block.number).to.be.equal(blockNumber - 1)
    expect(block.hash).to.be.equal(hash)
  })
})
