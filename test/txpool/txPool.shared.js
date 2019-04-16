import { expect } from 'chai'
import { validateTransaction, txDecimalFields } from '../eth/tx.shared'

const fields = txDecimalFields.concat([])
fields.splice('transactionIndex', 1)
fields.splice('blockNumber', 1)

export const testTxPoolContentItem = item => () => {
  it('should be an object', () => {
    expect(typeof item).to.be.equal('object')
  })
  for (let address in item) {
    const value = item[address]
    it(`address ${address}`, () => {
      // expect(isHexStr(address), `is hex string ${address}`).to.be.equal(true)
      expect(typeof value).to.be.equal('object')
      for (let nonce in value) {
        // expect(typeof nonce).to.be.equal('number')
        const txs = value[nonce]
        expect(Array.isArray(txs)).to.be.equal(true)
        for (let tx of txs) {
          expect(tx.nonce).to.be.equal(tx.nonce)
          validateTransaction(tx, fields)
        }
      }
    })
  }
}

export const txPoolValidateContent = content => {
  expect(content).has.ownProperty('pending')
  expect(content).has.ownProperty('queued')
  const { pending, queued } = content
  describe(`pending`, testTxPoolContentItem(pending))
  if (Object.keys(queued).length) {
    describe('queued', testTxPoolContentItem(queued))
  }
}
