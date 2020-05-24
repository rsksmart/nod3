import { Nod3Router } from '../../src/classes/Nod3Router'
import { HttpProvider } from '../../src/classes/HttpProvider'
import { assert } from 'chai'
import { JsonRpcServer } from '../Servers/JsonRpcServer'

const host = 'http://127.0.0.1'
const urls = [7057, 8058, 9059].map(port => `${host}:${port}`)

const servers = urls.map(url => createServer(url))
const { nod3, router } = Nod3Router(urls.map(url => new HttpProvider(url)), { skipFormatters: true })

describe(`# Nod3Router`, function () {

  this.afterAll(() => servers.map(server => server.close()))

  it('should return instances', () => {
    for (let url of urls) {
      assert.equal(nod3.provider.url, url)
    }
  })

  it('should return routes', () => {
    assert.typeOf(router.getRoutes(), 'object')
  })

  describe('routes', function () {
    it('should add a route', () => {
      let module = 'trace'
      let to = 1
      router.add({ module, to })
      assert.propertyVal(router.getRoutes(), module, to)
    })

    it('it should throw an error', () => {
      assert.throw(() => router.add())
      assert.throw(() => router.add('foo'))
      assert.throw(() => router.add('trace', 9))
    })

    it('should remove a route', () => {
      let module = 'trace'
      let to = 1
      router.add({ module, to })
      assert.property(router.getRoutes(), module)
      router.remove(module)
      assert.isUndefined(router.getRoutes()[module])
    })
  })

  describe('Routing', function () {
    it('should return a node key', () => {
      let module = 'eth'
      let to = 0
      router.add({ module, to })
      assert.equal(router.resolve(module, to))
    })

    it('should route to', async () => {
      router.add({ module: 'net', to: 1 })
      for (let i = 0; i <= urls.length * 2; i++) {
        let res = await nod3.net.listening()
        assert.equal(res, urls[1])
      }
    })
    describe('When subscribe is set:', function () {
      testSubscribe('method', 'eth.blockNumber')
      testSubscribe('filter', 'newBlock')
    })
    describe('Subscribe', function () {
      this.timeout(2500)
      let to = urls.length - 1
      let url = urls[to]
      let responses = []
      it(`should route to instance ${to}`, async function () {
        router.add({ module: 'subscribe', to })
        let subscription = await nod3.subscribe.method('net.listening', [])
        subscription.watch(data => responses.push(data))
        await new Promise(resolve => setTimeout(resolve, 2000))
        await subscription.delete()
        assert.isTrue(responses.length > 3)
        assert.includeMembers([url], responses)
      })
    })
  })
})

function createServer (url) {
  let block = 0
  const server = JsonRpcServer(url)
  server.addMethod('net_listening', () => { return url })
  server.addMethod('eth_newBlockFilter', () => 1)
  server.addMethod('eth_blockNumber', () => {
    return {
      block: block++,
      url
    }
  })
  return server
}

function testSubscribe (type, name) {
  it(`all subscribe.${type} should be managed by the same instance`, async function () {
    router.add({ module: 'subscribe', to: 1 })
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
