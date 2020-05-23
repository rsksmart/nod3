import { assert } from 'chai'
import { RoundRobin } from '../../src/lib/utils'

describe('RoundRobin()', function () {
  let arr = [1, 2, 3]
  let next = RoundRobin(arr)
  it(`should throw an Error`, () => {
    assert.throw(() => RoundRobin())
  })
  it('should return item after item ', () => {
    assert.equal(next(), 1)
    assert.equal(next(), 2)
    assert.equal(next(), 3)
    assert.equal(next(), 1)
    assert.equal(next(), 2)
  })
})
