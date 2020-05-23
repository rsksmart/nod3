import { Nod3Hub, NOD3_HUB_NAME } from '../src/classes/Nod3Hub'
import { HttpProvider } from '../src/classes/HttpProvider'
import { assert } from 'chai'
import { JsonRpcServer } from './Servers/JsonRpcServer'

const urls = ['http://127.0.0.1:9000', 'http://bar.baz']

let block = 0
const server = JsonRpcServer(urls[0])
server.addMethod('eth_blockNumber', () => block++)
server.addMethod('eth_newBlockFilter', () => 1)

describe(`# Nod3Hub`, function () {
  this.afterAll(() => server.close())
  const nod3 = Nod3Hub(urls.map(url => new HttpProvider(url)))
  it('should be a nod3Hub instance', () => {
    assert.equal(nod3[NOD3_HUB_NAME], true)
  })

  it(`should return the first instance`, () => {
    assert.equal(nod3.provider.url, urls[0])
  })

  it(`should return the next instance`, () => {
    assert.equal(nod3.provider.url, urls[1])
  })

  it(`should return the first instance`, () => {
    assert.equal(nod3.provider.url, urls[0])
  })

  it(`should return the next instance`, () => {
    assert.equal(nod3.provider.url, urls[1])
  })

  it(`set operations should modify all instances`, () => {
    const test = '123456'
    nod3.test = test
    assert.equal(nod3.test, test)
    assert.equal(nod3.test, test)
    assert.equal(nod3.test, test)
    assert.equal(nod3.test, test)
  })

  describe(`Subscriptions should be managed by the first instance`, function () {
    testSubscribe(nod3, 'method', 'eth.blockNumber')
    testSubscribe(nod3, 'filter', 'newBlock')
  })
})

function testSubscribe (nod3, type, name) {
  it(`subscribe.${type} should be managed by the first instance`, async () => {
    assert.equal(nod3.subscribe.provider.url, urls[0])
    assert.equal(nod3.subscribe.provider.url, urls[0])
    let subscription = await nod3.subscribe[type](name, [])
    assert.equal(typeof subscription, 'object')
    assert.equal(nod3.subscribe.provider.url, urls[0])
    subscription.watch(() => subscription.delete())
    assert.equal(nod3.subscribe.provider.url, urls[0])
  })
}
