import { fakeNod3 } from '../fakes'
import { expect } from 'chai'

describe('chainId', fakeNod3((nod3) => {
  it('should be a decimal value', async () => {
    const id = await nod3.eth.chainId()
    expect(typeof id).to.be.equal('number')
    expect(parseInt(id).toString(10)).to.be.equal(`${id}`)
  })
}))
