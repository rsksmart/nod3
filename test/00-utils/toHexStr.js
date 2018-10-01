import { assert } from 'chai'
import { toHexStr } from '../../src/lib/utils'
const cases = [
  [1111, '0x457'],
  [2324252627, '0x8a8947d3'],
  ['2324252627', '0x8a8947d3'],
  ['test', 'test'],
  [null, null],
  [undefined, undefined],
  ['0x8a8947d3', '0x8a8947d3'],
  ['0xab38973945745cfa239483434accfe45345435c', '0xab38973945745cfa239483434accfe45345435c']

]

describe('toHexStr', () => {
  cases.forEach(c => {
    it(`${c[0]} -> ${c[1]}`, () => {
      let value = toHexStr(c[0])
      // expect(value).to.be.equal(c[1])
      assert(value === c[1],`${value} !== ${c[1]}`)
    })
  })
})
