import { expect } from 'chai'
import { checkConection } from './checkConnection'
import { testNod3 } from './shared'

let blockNumber = global.blockNumber
let nod3 = global.nod3
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