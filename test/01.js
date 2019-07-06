import { expect } from 'chai'
import { checkConection } from './checkConnection'
import { nod3Creator, testNod3, getRandomBlockNumber } from './shared'

let blockNumber = getRandomBlockNumber()
let nod3 = global.nod3 || nod3Creator()
let conn

beforeEach(async function () {
  conn = await checkConection()
})

it('Check internet connection', function () {
  expect(conn).has.ownProperty('hostname')
  describe(`Testing with blockNumber:${blockNumber}`, () => {
    describe(`HTPP provider`, () => {
      describe('isConnected', () => {
        it('should be return a boolean', async () => {
          let connected = await nod3.isConnected()
          console.log('connected:', connected)
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
