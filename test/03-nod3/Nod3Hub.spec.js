import { Nod3Hub } from '../../src/classes/Nod3Hub'
import { NOD3_HUB } from '../../src/lib/types'
import { HttpProvider } from '../../src/classes/HttpProvider'
import { assert } from 'chai'
import { JsonRpcServer } from '../Servers/JsonRpcServer'

const host = 'http://127.0.0.1'
const urls = [7007, 8008, 9009].map(port => `${host}:${port}`)

const servers = urls.map(url => createServer(url))
const { nod3, hub } = Nod3Hub(urls.map(url => new HttpProvider(url)), { skipFormatters: true })

describe(`# Nod3Hub`, function () {
  this.afterAll(() => servers.map(server => server.close()))

  describe(' nod3', function () {
    it('should be a nod3Hub instance', () => {
      assert.equal(nod3[NOD3_HUB], true)
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

    it(`searchNode() should throw a TypeError if the argument is not a function`, () => {
      assert.throw(() => hub.searchNode(true), TypeError)
    })

    it(`should search instances by url`, () => {
      for (let key in urls) {
        let url = urls[key]
        const res = hub.searchNode((i) => i.url === url)
        assert.equal(res.nod3.url, url)
        assert.equal(res.key, key)
      }
    })
  })

  describe(' load balancing', function () {
    this.timeout(10000)
    it('should skip the busy instance', async () => {
      let { nod3 } = Nod3Hub(urls.map(url => new HttpProvider(url)), { skipFormatters: true })
      let promise = nod3.eth.syncing()
      let res = []
      for (let i = 0; i <= 5; i++) {
        let { url } = await nod3.eth.blockNumber()
        res.push(url)
      }
      let { url } = await promise
      res = [...new Set(res)]
      assert.includeDeepMembers(urls, res)
      assert.equal(url, urls[0])
      assert.isFalse(res.includes(url))
    })
  })
})

function createServer (url) {
  let block = 0
  const server = JsonRpcServer(url)
  server.addMethod('eth_blockNumber', () => {
    return {
      block: block++,
      url
    }
  })
  server.addMethod('eth_syncing', () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ url }), 2000)
    })
  })
  return server
}
