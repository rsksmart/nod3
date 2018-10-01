import { Nod3, HttpProvider } from '../src/'
import { testNod3 } from './shared'
import { expect } from 'chai'
import { checkConection } from './checkConnection'

const blockNumber = process.env['blockNumber'] || Math.floor(Math.random() * 600000)
let nod3 = new Nod3(new HttpProvider())
global.nod3 = nod3
global.blockNumber = blockNumber

describe('These tests require an internet connection', () => {

  it('internet connection', async () => {
    let conn = await checkConection()
    expect(conn).has.property('hostname')
    describe(`Testing with blockNumber:${blockNumber}`, () => {
      describe(`HTPP provider`, () => {
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
  })
})


