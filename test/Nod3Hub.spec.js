import { Nod3Hub, NOD3_HUB_NAME } from '../src/classes/Nod3Hub'
import { HttpProvider } from '../src/classes/HttpProvider'
import { assert } from 'chai'
import { JsonRpcServer } from './Servers/JsonRpcServer'

const host = 'http://127.0.0.1'
const urls = [7007, 8008, 9009].map(port => `${host}:${port}`)

const servers = urls.map(url => createServer(url))

describe(`# Nod3Hub`, function () {
  this.afterAll(() => servers.map(server => server.close()))
  const nod3 = Nod3Hub(urls.map(url => new HttpProvider(url)))

  it('should be a nod3Hub instance', () => {
    assert.equal(nod3[NOD3_HUB_NAME], true)
  })

  it(`should return a different instance every time`, () => {
    for (let url of urls.concat(urls)) {
      assert.equal(nod3.provider.url, url)
    }
  })

  it(`debugging should be set on all instances`, async () => {
    let log = []
    nod3.setDebug(obj => log.push(obj))
    const requests = urls.concat(urls)
    await Promise.all(requests.map(() => nod3.eth.blockNumber()))
    assert.equal(log.length, requests.length)
    let nodes = log.map(({ url }) => url).filter((v, i, s) => s.indexOf(v) === i)
    assert.includeMembers(nodes, urls)
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

function createServer (url) {
  let block = 0
  const server = JsonRpcServer(url)
  server.addMethod('eth_blockNumber', () => {
    return {
      block: block++,
      url
    }
  })
  server.addMethod('eth_newBlockFilter', () => 1)
  return server
}