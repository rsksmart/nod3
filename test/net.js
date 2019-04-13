
import { nod3Creator } from './shared'
import { expect } from 'chai'
const nod3 = global.nod3 || nod3Creator()

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

  describe('#net_peerCount', async () => {
    it('should be a decimal number', async () => {
      let peers = await nod3.net.peerCount()
      expect(parseInt(peers)).to.be.equal(parseInt(peers))
    })
  })

})
