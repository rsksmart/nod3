import { assert } from 'chai'
import { isHexStr } from '../../src/lib/utils'

const ok = ['0xab', '0xab34340934039430493439cb']
const fail = ['test', 21212, '1234acb45343443']
describe('isHexStr', () => {
  ok.forEach(v => {
    it(`${v} should pass`, () => {
      assert(isHexStr(v))
    })
  })

  fail.forEach(v => {
    it(`${v} should fail`, () => {
      assert.isFalse(isHexStr(v))
    })
  })
})