import { fakeNod3 } from '../fakes'
import { txPoolValidateContent } from './txPool.shared'

describe(`# TxPool content format`, fakeNod3((nod3) => {

  it('Content', async () => {
    const content = await nod3.txpool.content()
    txPoolValidateContent(content)
  })
})
)
