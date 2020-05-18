import { expect } from 'chai'
import { nod3Creator } from './shared'
import { validateBlock } from './eth/block.shared'
import * as sinon from 'sinon'

describe('Debug Mode', function () {
  this.timeout(60000)
  let results = []
  const debug = (res) => results.push(res)
  let nod3 = nod3Creator(null, { debug })

  it('should add a response time', async () => {
    const block = await nod3.eth.getBlock('latest', true)
    nod3.setDebug(debug)
    let stats = results[0]
    validateBlock(block)
    expect(stats).to.be.an('object')
    let { method, params, time } = stats
    expect(method).to.be.equal('eth_getBlockByNumber')
    expect(params).to.be.deep.equal(['latest', true])
    expect(time).to.be.a('number')
    expect(time).to.be.greaterThan(0)
  })

  it(`debug should works on batch request`, async () => {
    let numbers = [3, 8, 12]
    let params = numbers.map(n => [n, false])
    let blocks = await nod3.batchRequest(params, 'eth.getBlock')
    expect(Array.isArray(blocks)).to.be.equal(true)
    expect(blocks.map(({ number }) => number)).to.be.deep.equal(numbers)
    expect(results.length).to.be.equal(2)
    let result = results[1]
    expect(result.method).to.be.deep.equal(['eth_getBlockByNumber'])
    expect(result.params.length).to.be.deep.equal(params.length)
    expect(result.time).to.be.a('number')
    expect(result.time).to.be.greaterThan(0)
  })

  it(`should add the debug method`, async () => {
    let results = []
    nod3.setDebug((res) => results.push(res))
    await nod3.eth.getBlock('latest', true)
    expect(results.length).to.be.equal(1)
    let stats = results[0]
    expect(stats).to.be.an('object')
    let { method, params, time } = stats
    expect(method).to.be.equal('eth_getBlockByNumber')
    expect(params).to.be.deep.equal(['latest', true])
    expect(time).to.be.a('number')
    expect(time).to.be.greaterThan(0)
  })

  describe('Default option', function () {
    let n3 = nod3Creator(null, { debug: true })
    let spy = sinon.spy(n3, 'log')
    after(() => spy.restore())
    it('should log the response time', async () => {
      const block = await n3.eth.getBlock('latest', true)
      validateBlock(block)
      expect(spy.callCount).to.be.equal(1)
    })
  })
})
