import { nod3Creator } from '../shared'
import { validateTransaction } from './tx.shared'

let nod3 = global.nod3 || nod3Creator()

describe('Get Transactions', () => {
  describe(`# getTransaction - by block number, index`, () => {
    it('should return a tx object', async () => {
      let tx = await nod3.eth.getTransactionByIndex(2001, 0)
      validateTransaction(tx)

      describe(`# getTransaction - by block hash, index`, () => {
        it('should return a tx object', async () => {
          let tx2 = await nod3.eth.getTransactionByIndex(tx.blockHash, 0)
          validateTransaction(tx2)
        })
      })

      describe(`# getTransaction - by hash`, () => {
        it('should return a tx object', async () => {
          let tx3 = await nod3.eth.getTransactionByHash(tx.hash)
          validateTransaction(tx3)
        })
      })
    })
  })
})
