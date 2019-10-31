import { JsonRpc, JsonRpcError } from '../../src/classes/JsonRpc'
import { HttpProvider } from '../../src/classes/HttpProvider'
import { JsonRpcServer, JsonRpcServerError } from '../Servers/JsonRpcServer'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
const { expect } = chai

// Disable ssl rejections
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

describe(`JsonRpc`, function () {
  testJsonRpc('http://localhost:4004', 'HttpProvider over HTTP')
  testJsonRpc('https://localhost:4005', 'HttpProvider over HTTPS')
})

function testJsonRpc (url, testTitle) {
  const { server, addMethod } = JsonRpcServer(url)
  const TEST = 'test'
  const ERROR = 'myError'

  addMethod('test', () => TEST)
  addMethod('myError', () => new JsonRpcServerError(ERROR))
  const jsonRpc = new JsonRpc(new HttpProvider(url))

  server.on('listening', () => {
    let { port, address } = server.address()
    console.log(`JsonRpc server listening on ${address}:${port}`)
  })

  describe(`${testTitle}`, function () {
    after(function () {
      server.close()
    })

    it(`should return "${TEST}"`, async () => {
      const res = await jsonRpc.sendMethod('test')
      expect(res).to.be.deep.equal(TEST)
    })
    it(`should reject an Error: ${ERROR}`, () => {
      let res = jsonRpc.sendMethod('myError')
      expect(res).to.be.rejectedWith(JsonRpcError, ERROR).then(err => {
        expect(JsonRpcError.isJsonRpcError(err)).to.be.equal(true)
      })
    })
  })
}
