import { nod3Creator } from '../shared'
import { expect } from 'chai'
const nod3 = nod3Creator()

describe('Test subscribe.clear', function () {
  let list = [
    'newBlock',
    'eth.syncing',
    ['rsk.getBlocksByNumber', '0x05'],
    'newBlock',
    ['eth.getBlock', '0xf', false]
  ]

  it(`should create ${list.length} subscriptions`, async function () {
    let connected = await nod3.isConnected()
    if (!connected) throw new Error('nod3 is not connected')
    await createSubs(list)
    let subs = nod3.subscribe.list()
    expect(subs.length).to.be.equal(list.length)
  })

  it('should remove all subscriptions', async function () {
    await nod3.subscribe.clear()
    let total = nod3.subscribe.list()
    expect(total).to.be.an('array')
    expect(total.length).to.be.equal(0)
  })
})

async function createSubs (subs) {
  try {
    let q = []
    subs.forEach(async s => {
      let n = (Array.isArray(s)) ? s[0] : s
      let type = (n.split('.').length > 1) ? 'method' : 'filter'
      let params = (Array.isArray(s)) ? s.slice(1) : []
      q.push(nod3.subscribe[type](n, params))
    })
    let res = await Promise.all(q)
    return res
  } catch (err) {
    console.log(err)
    process.exit()
  }
}
