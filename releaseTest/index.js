const assert = require('assert')
const { Nod3 } = require('nod3')
const nod3 = new Nod3(new Nod3.providers.HttpProvider('http://localhost:4444'))

assert.equal(typeof nod3, 'object', 'nod3 is not an object')
assert.equal(typeof nod3.eth.getBlock, 'function', 'eth.getBlock is not a function')
console.log('done')
