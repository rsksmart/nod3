import { Nod3, HttpProvider } from '../src/'
import { testNod3 } from './shared'
import { expect } from 'chai'

const blockNumber = process.env['blockNumber'] || Math.floor(Math.random() * 600000)
global.blockNumber = blockNumber

describe(`Testing with blockNumber:${blockNumber}`, () => {
  describe(`HTPP provider`, () => {
    let nod3 = new Nod3(new HttpProvider())
    describe('isConnected', () => {
      it('should be return a boolean', async () => {
        let connected = await nod3.isConnected()
        expect(connected).to.be.equal(true || false)
        describe('Nod3 test', () => {
          it('should be connected', () => {
            expect(connected).to.be.equal(true)
            testNod3(nod3, { blockNumber })
          })
        })
      })
    })
  })
})