import { expect, request } from 'chai'
import { Nod3, HttpProvider } from '../src/'

const nod3 = new Nod3(new HttpProvider())
const blockNumber = process.env['blockNumber'] || Math.floor(Math.random() * 600000)  

console.log(`BlockNumber: ${blockNumber}`)
describe('getBlock', () => {
  let block
  it('should be return a block by decimal number', async () => {
    block = await nod3.getBlock(blockNumber)
    expect(block.number).to.be.equal(parseInt(blockNumber))
  })
  it('should be return a block by hash', async () => {
    let hash = block.parentHash
    block = null
    block = await nod3.getBlock(hash)
    expect(block.number).to.be.equal(blockNumber - 1)
    expect(block.hash).to.be.equal(hash)
  })
})

describe('getBlocksByNumber', () => {
  it('should be return an array', async () => {
    let blocks = await nod3.getBlocksByNumber(blockNumber)
    expect(blocks).to.be.an('array')
  })
})