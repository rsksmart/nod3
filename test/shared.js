import { Nod3 } from '../src/'
import { expect } from 'chai'
import { isBlockHash } from '../src/lib/utils'

export const nod3Creator = () => {
  const url = process.env['url'] || 'http://localhost:4444'
  let nod3 = new Nod3(new Nod3.providers.HttpProvider(url))
  return nod3
}

export const testNod3 = (nod3, options) => {
  let blockNumber = options.blockNumber
  let params = [...new Array(10)].map(a => [Math.floor(Math.random() * blockNumber), false])
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
}

export const testBlock = block => {
  describe(`Testing block ${(block) ? block.number : block}`, () => {
    it(`should have block properties`, () => {
      expect(isBlockHash(block.hash)).to.be.equal(true)
      expect(isBlockHash(block.parentHash)).to.be.equal(true)
    })
  })
}

export const checkDecimal = (value, name) => {
  expect(`${value}`, `${name}`).to.be.equal(`${Number(value).toString(10)}`)
  expect(typeof value).to.be.equal('number')
  expect(value).to.be.equal(parseInt(value))
}

export const checkDecimalFields = (result, fields) => () => {
  for (let field of fields) {
    it(`${field} should be a decimal value`, () => {
      const value = result[field]
      checkDecimal(value, field)
    })
  }
}

export const getRandomBlockNumber = () => Math.floor(Math.random() * 2000)
