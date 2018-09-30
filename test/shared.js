import { expect } from 'chai'
import { Nod3 } from '../src/'
import { isBlockHash } from '../src/utils'

export const testNod3 = options => {
  let provider = options.provider
  let blockNumber = options.blockNumber
  let nod3 = new Nod3(provider)

  describe('isConnected', () => {
    it('should be return a boolean', async () => {
      let connected = await nod3.isConnected()
      expect(connected).to.be.equal(true || false)
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

      let params = [...new Array(20)].map(a => [Math.floor(Math.random() * 600000), false])
      let total = params.length

      describe(`batchRequest getBlock [${total}] by NUMBER `, () => {

        it(`should be return an array of ${total} blocks`, async () => {
          let data = await nod3.batchRequest('getBlock', params)
          expect(data).to.be.an('array')
          expect(data.length === total)
          data.forEach(block => {
            testBlock(block)
          })
          params = new Set()
          data.forEach(block => {
            params.add(block.parentHash)
            return block.uncles.forEach(u => params.add(u))
          })
          params = [...params].slice(0, total).map(h => [h, false])

          describe(`batchRequest getBlock [${total}] by HASH `, () => {
            it(`should be return an array of ${total} blocks`, async () => {
              let data = await nod3.batchRequest('getBlock', params)
              expect(data).to.be.an('array')
              expect(data.length === total)
              data.forEach(block => {
                testBlock(block)
              })
            })
          })
        })
      })
    })
  })
}

export const testBlock = block => {
  describe(`block ${(block) ? block.number : block}`, () => {
    it(`should be a block`, () => {
      expect(block.number).to.be.an('number')
      expect(isBlockHash(block.hash)).to.be.equal(true)
      expect(isBlockHash(block.parentHash)).to.be.equal(true)
    })
  })
}
