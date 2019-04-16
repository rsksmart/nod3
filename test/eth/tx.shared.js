import { expect } from 'chai'
import { checkDecimalFields } from '../shared'
import { isBlockHash } from '../../src/lib/utils'

export const txDecimalFields = [
  'transactionIndex',
  'blockNumber',
  'gas',
  'nonce']

export const validateTransaction = (tx, fields = txDecimalFields) => {
  const { blockHash, blockNumber, transactionIndex } = tx
  // txpool transaction
  const inPool = blockNumber === null && blockHash === '0x'.padEnd(66, '0')
  expect(typeof tx).to.be.equal('object')
  expect(tx).to.have.property('hash')
  expect(tx).to.have.property('blockHash')
  expect(tx).to.have.property('blockNumber')
  expect(tx).to.have.property('transactionIndex')
  expect(transactionIndex).to.be.equal(parseInt(transactionIndex))

  if (!inPool) {
    expect(isBlockHash(blockHash)).to.be.equal(true)
  }

  describe('  Decimal fields', checkDecimalFields(tx, fields))
}
