import { expect } from 'chai'
import { isBlockHash } from '../src/lib/utils'

export const testNod3 = (nod3, options) => {
  let blockNumber = options.blockNumber

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

  describe('getBlocksByNumber', () => {

    it('should be return an array', async () => {
      let blocks = await nod3.rsk.getBlocksByNumber(blockNumber)
      expect(blocks).to.be.an('array')
    })
  })

  let params = [...new Array(10)].map(a => [Math.floor(Math.random() * 600000), false])
  let total = params.length

  describe(`batch request: getBlock [${total}]`, () => {
    describe(`# by NUMBER `, () => {
    
      it(`should be return an array of ${total} values`, async () => {
        let data = await nod3.batchRequest(params, 'eth.getBlock')
        expect(data).to.be.an('array')
        expect(data.length).to.be.equal(total)

        describe('Test values', () => {
          data.forEach(block => {
            testBlock(block)
          })
        })

        params = new Set()
        data.forEach(block => {
          params.add(block.parentHash)
          return block.uncles.forEach(u => params.add(u))
        })
        params = [...params].slice(0, total).map(h => [h, false])

        describe(`# by HASH `, () => {
          it(`should be return an array of ${total} blocks`, async () => {
            let data = await nod3.batchRequest(params, 'eth.getBlock')
            expect(data).to.be.an('array')
            expect(data.length).to.be.equal(total)
            data.forEach(block => {
              testBlock(block)
            })
          })
        })
      })
    })
  })

  

  describe(`Mixed methods Batch request`, () => {

  })

}

export const testBlock = block => {
  describe(`Testing block ${(block) ? block.number : block}`, () => {

    it(`should have block properties`, () => {
      expect(block.number).to.be.an('number')
      expect(isBlockHash(block.hash)).to.be.equal(true)
      expect(isBlockHash(block.parentHash)).to.be.equal(true)
    })
  })
}
