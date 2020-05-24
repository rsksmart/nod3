import { expect } from 'chai'
import { nod3Creator } from '../shared'
import { validateBlock } from './block.shared'

let blockNumber = global.blockNumber
let nod3 = global.nod3 || nod3Creator()

describe(`# getBlock`, () => {
  let block

  it(`should return a block by decimal number: #${blockNumber}`, async () => {
    block = await nod3.eth.getBlock(blockNumber)
    validateBlock(block)
  })

  it('should return a block by hash', async () => {
    let hash = block.parentHash
    block = null
    block = await nod3.eth.getBlock(hash)
    expect(parseInt(block.number)).to.be.equal(parseInt(blockNumber) - 1)
    expect(block.hash).to.be.equal(hash)
    validateBlock(block)
  })
})
