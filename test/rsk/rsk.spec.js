
import { expect } from 'chai'
let blockNumber = global.blockNumber
let nod3 = global.nod3

describe('# RSK', () => {
  describe('getBlocksByNumber', () => {

    it('should return an array', async () => {
      let blocks = await nod3.rsk.getBlocksByNumber(blockNumber)
      expect(blocks).to.be.an('array')
    })
  })
})