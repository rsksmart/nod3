
import { expect } from 'chai'
import { checkDecimalFields } from '../shared'

export const validateBlock = block => {
  expect(block).has.ownProperty('number')
  expect(block).has.ownProperty('hash')
  expect(block).has.ownProperty('parentHash')
  const { number } = block
  expect(number).to.be.equal(parseInt(number))
  describe('  Decimal fields', checkDecimalFields(block, [
    'number',
    'timestamp',
    'size',
    'gasUsed',
    'gasLimit']))
}
