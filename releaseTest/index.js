const assert = require('assert')
const { Nod3, Nod3Hub, NOD3_HUB_NAME, Nod3Router } = require('nod3')
const { HttpProvider } = Nod3.providers

const url = 'http://localhost'
const nod3 = new Nod3(new HttpProvider(`${url}:4444`))
const { nod3: nod3Hub, hub } = Nod3Hub([`${url}:4444`, `${url}:4445`].map(u => new HttpProvider(u)))
const { nod3: nod3Router, hub: routerHub, router } = Nod3Router([`${url}:4444`, `${url}:4445`].map(u => new HttpProvider(u)))

// Nod3
assert.equal(typeof nod3, 'object', 'nod3 is not an object')
assert.equal(typeof nod3.eth.getBlock, 'function', 'eth.getBlock is not a function')

// Nod3Hub
assert.equal(typeof nod3Hub, 'object')
assert.equal(nod3Hub[NOD3_HUB_NAME], NOD3_HUB_NAME)
assert.equal(typeof hub, 'object')

// Nod3Router
assert.equal(typeof nod3Router, 'object')
assert.equal(typeof routerHub, 'object')
assert.equal(typeof router, 'object')

console.log('done!')
