import { nod3Creator } from '../shared'
import { Subscription } from '../../src/classes/Subscription'
import { expect } from 'chai'
import { isBlockHash } from '../../src/lib/utils'

const nod3 = nod3Creator()
var nbFilter
let filtersTests = [
  {
    name: 'newBlock',
    validator: function (data) {
      return isBlockHash(data)
    }
  },
  {
    name: 'pendingTransactions',
    validator: function (data) {
      // UNCOMPLETE
      return Array.isArray(data)
    },
    skip: true
  }
]
// remove skipped tests
filtersTests = filtersTests.filter(f => !f.skip)

filtersTests.forEach(f => {
  var filterName = f.name
  var validator = f.validator
  if (!filterName || !validator) throw new Error('Bad configuration')
  describe(`add ${filterName} filter`, () => {

    it(`should create a ${filterName} filter`, async function () {
      nbFilter = await nod3.subscribe.filter(filterName)
      expect(nbFilter).to.be.instanceOf(Subscription)
    })
  })

  describe(`waiting for ${filterName} results`, function () {
    it('sould be a valid result', function (done) {
      this.timeout(60000)
      nbFilter.watch(data => {
        console.log(data)
        expect(data).to.satisfy(validator)
        done()
      })
    })
  })

  describe(`remove ${filterName} filter`, function () {
    it('should remove filter', async function () {
      let id = nbFilter.id
      await nbFilter.delete()
      expect(nod3.subscribe.subscriptions.get(id)).to.be.equal(undefined)
      expect(nod3.provider.pool.get(id)).to.be.equal(undefined)
      let nodeFilter = await nod3.rpc.sendMethod('eth_getFilterChanges', id)
      expect(nodeFilter).to.be.equal(null)
      return Promise.resolve()
    })
  })
})

let sub

describe('subscribe to method eth.syncing', () => {
  it('should create a subscription', async function () {
    sub = await nod3.subscribe.method('eth.syncing')
    expect(sub).to.be.instanceOf(Subscription)
    return Promise.resolve()
  })
})

describe('waiting subscription events', function () {
  it('sould be a valid method event', function (done) {
    this.timeout(60000)
    sub.watch(data => {
      console.log(data)
      expect(data).to.satisfy(function (data) {
        return data === true || data === false || typeof data === 'object'
      })
      sub.delete()
      done()
    })
  })
})
