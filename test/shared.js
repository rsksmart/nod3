import { Nod3 } from '../src/'
import { expect } from 'chai'
import { isBlockHash } from '../src/lib/utils'

export const nod3Creator = () => {
  const url = process.env['url']
  let nod3 = new Nod3(new Nod3.providers.HttpProvider(url))
  return nod3
}

export const testNod3 = (nod3, options) => {
  let blockNumber = options.blockNumber

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
