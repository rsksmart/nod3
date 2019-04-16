import { expect } from 'chai'
import { nod3Creator } from '../shared'
import { txPoolValidateContent } from './txPool.shared'

let nod3 = global.nod3 || nod3Creator()

describe('# txpool content', function () {
  it('should be a valid response', async function () {
    let content = await nod3.txpool.content()
    txPoolValidateContent(content)
  })
})

describe('# txpool inspect', function () {
  it('should be a valid response', async function () {
    let inspect = await nod3.txpool.inspect()
    expect(inspect).has.ownProperty('queued')
    expect(inspect).has.ownProperty('pending')
  })
})

describe('# txpool status', function () {
  it('should be a valid response', async function () {
    let status = await nod3.txpool.status()
    expect(status.queued).to.be.a('number')
    expect(status.pending).to.be.a('number')
  })
})
