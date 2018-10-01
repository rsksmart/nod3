
import { expect } from 'chai'
let nod3 = global.nod3

describe('NET', () => {
  let net
  describe('#net_version', () => {
    it(`should returns an object with name & id`, async () => {
      net = await nod3.net.version()
      expect(net).to.be.an('object')
      expect(net).has.property('id')
      expect(net).has.property('name')
      describe('test net.name', () => {
        it(`${net.name} should be a string`, () => {
          expect(net.name).to.be.a('string')
        })
      })
    })
  })
})
