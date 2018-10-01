import { expect } from 'chai'
import { isBlockHash } from '../../src/lib/utils';


let nod3 = global.nod3
/* describe(`getTransaction #by hash`, () => {
  it('should', () => {
    expect(true).to.be.equal(false)
  })
})
 */
describe('Get Transactions', () => {
  describe(`getTransaction #by block number, index`, () => {
    it('should returns a tx object', async () => {
      let tx = await nod3.eth.getTransactionByIndex(5001, 0)
      expect(tx).to.be.an('object')
      expect(tx).to.have.property('hash')
      expect(tx).to.have.property('blockHash')
      expect(isBlockHash(tx.blockHash)).to.be.equal(true)

      describe(`getTransaction #by block hash, index`, () => {
        it('should returns a tx object', async () => {
          let tx2 = await nod3.eth.getTransactionByIndex(tx.blockHash, 0)
          expect(tx2).to.be.an('object')
          expect(tx2).to.have.property('hash')
          expect(tx2).to.have.property('blockHash')
        })
      })

      describe(`getTransaction #by hash`, () => {
        it('should returns a tx object', async () => {
          let tx3 = await nod3.eth.getTransactionByHash(tx.hash)
          expect(tx3).to.be.an('object')
          expect(tx3).to.have.property('hash')
          expect(tx3).to.have.property('blockHash')
        })
      })
    })
  })
})


