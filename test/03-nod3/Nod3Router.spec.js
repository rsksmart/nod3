import { Nod3Router } from '../../src/classes/Nod3Router'
import { HttpProvider } from '../../src/classes/HttpProvider'
import { assert } from 'chai'
import { JsonRpcServer } from '../Servers/JsonRpcServer'
import { wait } from '../shared'

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

    it('router.add() should throw an error when invalid arguments are passed', () => {
      assert.throw(() => router.add())
      assert.throw(() => router.add('foo'))
      assert.throw(() => router.add('trace', 9))
    })

    it('router.add() should throw an error when "to" is invalid', () => {
      assert.throw(() => router.add({ module: 'trace' }))
      assert.throw(() => router.add({ module: 'trace', to: 'foo' }))
    })

    it('router.add() should throw an error for invalid module', () => {
      assert.throw(() => router.add({ module: 'eth', to: urls.length }))
      assert.throw(() => router.add({ module: 'bar', to: 1 }))
    })

    it('router.remove() should remove a route', () => {
      let module = 'eth'
      let to = 1
      router.add({ module, to })
      assert.property(router.getRoutes(), module)
      router.remove(module)
      assert.isUndefined(router.getRoutes()[module])
    })

    it(`router.reset() should remove all routes`, () => {
      router.reset()
      assert.equal(Object.keys(router.getRoutes()).length, 0)
      router.add({ module: 'eth', to: 2 })
      router.add({ module: 'trace', to: 1 })
      router.add({ module: 'net', to: 1 })
      assert.equal(Object.keys(router.getRoutes()).length, 3)
      router.reset()
      assert.deepEqual(router.getRoutes(), {})
    })

  })

  describe('Routing', function () {

    describe(`By module routes`, function () {
      it('should return a node key', () => {
        let module = 'eth'
        let to = 0
        router.add({ module, to })
        assert.equal(router.resolve({ module }), to)
      })

      it('should route to', async () => {
        router.add({ module: 'net', to: 1 })
        for (let i = 0; i <= urls.length * 2; i++) {
          let res = await nod3.net.listening()
          assert.equal(res, urls[1])
        }
      })
    })

    describe(`By method routes`, function () {
      it('should return a node key', () => {
        router.reset()
        let routes = [
          { module: 'eth', method: 'blockNumber', to: 0 },
          { module: 'eth', method: 'url', to: 2 }
        ]
        router.add(routes[0])
        router.add(routes[1])
        assert.equal(routes[0].to, router.resolve(routes[0]))
        assert.equal(routes[1].to, router.resolve(routes[1]))
      })

      it('should route to', async () => {
        router.reset()
        router.add({ module: 'eth', method: 'blockNumber', to: 1 })
        for (let x = 0; x < 10; x++) {
          let chains = []
          for (let i = 0; i <= urls.length - 1; i++) {
            let { url } = await nod3.eth.blockNumber()
            let url2 = await nod3.eth.chainId()
            chains.push(url2)
            assert.equal(url, urls[1])
          }
          chains = new Set([...chains])
          assert.equal(chains.size, urls.length)
        }
      })
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
        router.reset()
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
  server.addMethod('eth_chainId', () => { return url })
  server.addMethod('eth_blockNumber', () => {
    wait(10)
    return {
      block: block++,
      url
    }
  })
  return server
}

function testSubscribe (type, name) {
  it(`all subscribe.${type} should be managed by the same instance`, async function () {
    router.reset()
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
