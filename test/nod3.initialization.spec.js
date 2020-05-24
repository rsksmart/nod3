import { assert } from 'chai'
import { Nod3 } from '../src/classes/Nod3'
import { HttpProvider } from '../src/classes/HttpProvider'

const url = 'http://localhost:9009'
describe('Initialization', function () {
  it(`should set skipFormatters`, () => {
    let nod3 = new Nod3(new HttpProvider(url), { skipFormatters: true })
    assert.equal(nod3.skipFormatters, true)
  })
})
