import { Nod3Router } from '../src/classes/Nod3Router'
import { HttpProvider } from '../src/classes/HttpProvider'
import { assert } from 'chai'
import { JsonRpcServer } from './Servers/JsonRpcServer'

const host = 'http://127.0.0.1'
const urls = [7007, 8008].map(port => `${host}:${port}`)

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

  describe('routes', () => {

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
})

function createServer (url) {
  const server = JsonRpcServer(url)
  server.addMethod('net_listening', () => {
    return url
  })
  return server
}