const assert = require('assert')
const { Nod3, Nod3Hub, NOD3_HUB_NAME } = require('nod3')
const { HttpProvider } = Nod3.providers

const url = 'http://localhost'
const nod3 = new Nod3(new HttpProvider(`${url}:4444`))
const hub = Nod3Hub([`${url}:4444`, `${url}:4444`].map(u => new HttpProvider(u)))

assert.equal(typeof nod3, 'object', 'nod3 is not an object')
assert.equal(typeof nod3.eth.getBlock, 'function', 'eth.getBlock is not a function')

assert.equal(typeof hub, 'object')
assert.equal(hub[NOD3_HUB_NAME], NOD3_HUB_NAME)

console.log('done!')
