import { nod3Creator, getRandomBlockNumber } from './shared'

const blockNumber = process.env['blockNumber'] || getRandomBlockNumber()
const nod3 = nod3Creator()

global.nod3 = nod3
global.blockNumber = blockNumber
