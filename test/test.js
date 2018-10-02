import { HttpProvider } from '../src/'
import { testNod3 } from './shared'
const blockNumber = process.env['blockNumber'] || Math.floor(Math.random() * 600000)

describe(`Testing with blockNumber:${blockNumber}`, () => {
  describe(`HTPP provider`, () => {
    let provider = new HttpProvider()
    testNod3({ blockNumber, provider })
  })
})
