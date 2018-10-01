import { expect } from 'chai'

let blockNumber = global.blockNumber
let nod3 = global.nod3


describe('getBlock', () => {
  let block

  it('should be return a block by decimal number', async () => {
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