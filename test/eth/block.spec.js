import { validateBlock } from './block.shared'
import { fakeNod3 } from '../fakes'

describe('# Block format', fakeNod3((nod3) => {
  it('should be a valid block', async () => {
    const block = await nod3.eth.getBlock()
    validateBlock(block)
  })
}))
