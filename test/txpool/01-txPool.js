import { expect } from 'chai'
import { nod3Creator } from '../shared'

let nod3 = global.nod3 || nod3Creator()

describe('# txpool content', function () {
  it('should....', async function () {
    let content = await nod3.txpool.content()
    expect(content).has.ownProperty('pending')
    expect(content).has.ownProperty('queued')
  })
})

describe('# txpool inspect', function () {
  it('should....', async function () {
    let inspect = await nod3.txpool.inspect()
    expect(inspect).has.ownProperty('queued')
    expect(inspect).has.ownProperty('pending')
  })
})

describe('# txpool status', function () {
  it('should....', async function () {
    let status = await nod3.txpool.status()
    expect(status.queued).to.be.a('number')
    expect(status.pending).to.be.a('number')
  })
})
