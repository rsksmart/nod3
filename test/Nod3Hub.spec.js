import { Nod3Hub, NOD3_HUB_NAME } from '../src/classes/Nod3Hub'
import { HttpProvider } from '../src/classes/HttpProvider'
import { assert } from 'chai'
import { JsonRpcServer } from './Servers/JsonRpcServer'

const host = 'http://127.0.0.1'
const urls = [7007, 8008, 9009].map(port => `${host}:${port}`)

const servers = urls.map(url => createServer(url))
const { nod3, hub } = Nod3Hub(urls.map(url => new HttpProvider(url)))

describe(`# Nod3Hub`, function () {
  this.afterAll(() => servers.map(server => server.close()))

  describe(' nod3', function () {
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
  })

  describe(' hub', function () {

    it(`should return instances by url`, () => {
      for (let url of urls) {
        assert.equal(hub.getNodeByUrl(url).provider.url, url)
      }
    })

    it(`should return instances keys by url`, () => {
      for (let key in urls) {
        let url = urls[key]
        assert.equal(hub.getNodeKeyByUrl(url), key)
      }
    })

    it('As default the subscriber should be undefined', () => {
      assert.isUndefined(hub.subscriber.get())
    })

    describe(`subscriber methods`, function () {

      it('should set the subscriber', () => {
        hub.subscriber.set(0)
        assert.equal(hub.subscriber.get().provider.url, urls[0])
      })

      it('should remove the subscriber', () => {
        hub.subscriber.clear()
        assert.isUndefined(hub.subscriber.get())
      })

      it('should return the subscription instance', () => {
        hub.subscriber.set(1)
        assert.isDefined(hub.subscriber.get().provider.url)
      })

      it(`hub.changeSubscriber() should change the subscription instance`, () => {
        let key = 1
        hub.subscriber.set(key)
        assert.equal(hub.subscriber.get().provider.url, urls[key])
        assert.equal(nod3.subscribe.provider.url, urls[key])
      })
    })

    describe('When subscriber is set', function () {
      testSubscribe(nod3, 'method', 'eth.blockNumber')
      testSubscribe(nod3, 'filter', 'newBlock')
    })
  })
})

function testSubscribe (nod3, type, name) {

  it(`All subscribe.${type} should be managed by the same instance`, async () => {
    hub.subscriber.set(2)
    const key = urls.indexOf(nod3.subscribe.provider.url)
    assert.equal(nod3.subscribe.provider.url, urls[key])
    assert.equal(nod3.subscribe.provider.url, urls[key])
    let subscription = await nod3.subscribe[type](name, [])
    assert.equal(typeof subscription, 'object')
    assert.equal(nod3.subscribe.provider.url, urls[key])
    subscription.watch(() => subscription.delete())
    assert.equal(nod3.subscribe.provider.url, urls[key])
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