import { nod3Creator } from './shared'

const blockNumber = process.env['blockNumber'] || Math.floor(Math.random() * 600000)
const nod3 = nod3Creator()

global.nod3 = nod3
global.blockNumber = blockNumber
