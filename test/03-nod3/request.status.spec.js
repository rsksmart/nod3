import { Nod3 } from '../../src/classes/Nod3'
import { assert } from 'chai'
import { JsonRpcServer } from '../Servers/JsonRpcServer'
import { wait } from '../shared'

const url = 'http://127.0.0.1:7077'
const responseDelay = 1000
const delay = 100

const server = createServer(url)
const nod3 = new Nod3(new Nod3.providers.HttpProvider(url), { skipFormatters: true })

describe('Request status', function () {
  this.timeout(60000)
  this.afterAll(() => server.close())

  it('should return the time elapsed in ms', async () => {
    let promise = nod3.eth.blockNumber()
    let elapsed = nod3.isRequesting()
    assert.isTrue(elapsed !== false)
    wait(delay)
    assert.isAtLeast(nod3.isRequesting(), delay + elapsed)
    let { block } = await promise
    assert.equal(block, 0)
    assert.isFalse(nod3.isRequesting())
  })

  it('new request should restart the time', async () => {
    let promise = nod3.eth.blockNumber()
    wait(20)
    let elapsed = nod3.isRequesting()
    assert.isAtLeast(elapsed, 1)
    let promise2 = nod3.eth.blockNumber()
    assert.isAtMost(nod3.isRequesting(), elapsed)
    let { block } = await promise
    let { block: block2 } = await promise2
    assert.equal(block, 1)
    assert.equal(block2, 2)
    assert.isFalse(nod3.isRequesting())
  })
})

function createServer (url) {
  let block = 0
  const server = JsonRpcServer(url)
  server.addMethod('eth_blockNumber', () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ block: block++, url }), responseDelay)
    })
  })
  return server
}
