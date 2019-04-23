import { fakeNod3 } from '../fakes'
import { checkDecimal } from '../shared'

describe(`# Hash rate format`, fakeNod3((nod3, examples) => {
  it(`should be a decimal value`, async () => {
    checkHashRate(nod3)
  })
}))

async function checkHashRate (nod3) {
  let hashRate = await nod3.eth.netHashrate()
  if (!hashRate) return
  checkDecimal(hashRate, 'hash rate')
  checkHashRate(nod3)
}
