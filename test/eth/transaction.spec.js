import { fakeNod3 } from '../fakes'
import { validateTransaction } from './tx.shared'

describe('# Transaction format', fakeNod3((nod3) => {
  it('should be a valid transaction', async () => {
    const tx = await nod3.eth.getTransactionByHash()
    validateTransaction(tx)
  })
}))
