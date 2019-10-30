import { expect } from 'chai'
import { toDecimal, toBase10 } from '../../src/lib/utils'

const cases = [
  [123, 123],
  [123.5, 123.5],
  ['123.5', '123.5'],
  ['0xf', '15'],
  ['0x5966dada6c53', '98298293283923']

]

describe('# toBase10', () => {
  for (let test of cases) {
    const [value, expected] = test
    it(`should return a decimal value ${value} -> ${expected}`, () => {
      expect(toBase10(value)).to.be.equal(expected)
    })
  }
})

describe('# toDecimal', () => {
  for (let test of cases) {
    const [value, expected] = test
    it(`should return a decimal value ${value} -> ${expected}`, () => {
      expect(toDecimal(value)).to.be.equal(parseInt(expected))
    })
  }
})
