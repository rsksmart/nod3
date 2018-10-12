import { nod3Creator } from '../shared'
import { Subscription } from '../../src/classes/Subscription'
import { expect, assert } from 'chai'
import { isBlockHash } from '../../src/lib/utils'
const nod3 = nod3Creator()
var nbFilter

describe('add newBlock filter', () => {
  it('should create a newBlock filter', async function () {
    nbFilter = await nod3.subscribe.filter('newBlock')
    expect(nbFilter).to.be.instanceOf(Subscription)
  })
})

describe('waiting for new block', function () {
  it('sould be a block hash', function (done) {
    this.timeout(60000)
    nbFilter.on('data', data => {
      console.log(data)
      assert(isBlockHash(data), data)
      done()
    })
  })
})

describe('remove newBlock filter', function () {
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
    sub.on('data', data => {
      console.log(data)
      expect(data).to.satisfy(function (data) {
        return data === true || data === false || typeof data === 'object'
      })
      sub.delete()
      done()
    })
  })
})
