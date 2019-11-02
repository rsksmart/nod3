import { HttpClient, HttpClientError } from '../../src/classes/HttpClient'
import HttpServer from '../Servers/HttpServer'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
const { expect } = chai

// Disable ssl rejections
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

describe(`# HttpClient`, function () {
  testHttpClient('http://localhost:4004', 'HTTP')
  testHttpClient('https://localhost:4005', 'HTTPS')
})

function TestServer (serverUrl) {
  serverUrl = HttpServer.parseUrl(serverUrl)
  const { port } = serverUrl
  const server = HttpServer.create(serverUrl, function (req, res) {

    let body = ''

    req.on('data', data => {
      body += data
    })

    req.on('end', () => {
      try {
        let { headers } = req
        for (let k in headers) {
          res.setHeader(k, headers[k])
        }
        const int = parseInt(body)
        if (!isNaN(int) && int > 200 && int < 501) {
          res.statusCode = int
        }
        res.write(body)
        res.end()
      } catch (err) {
        res.statusCode = 400
        res.end()
        console.error(err)
      }
    })
  })
  server.listen(port)
  return server
}

function testHttpClient (url, testTitle) {
  const server = TestServer(url)
  const client = new HttpClient(url)

  server.on('listening', () => {
    let { port, address } = server.address()
    console.log(`Server listening on ${address}:${port}`)
  })

  describe(`${testTitle}`, function () {
    after(function () {
      server.close()
    })
    const test = 'fooBar'

    it(`should POST`, async () => {
      const res = await client.post({ test })
      expect(res.data).to.be.deep.equal({ test })
    })

    it(`should throw an HttpClientError with statusCode 500`, async () => {
      let res = client.post(500)
      expect(res).to.be.rejectedWith(HttpClientError).then(err => {
        expect(HttpClientError.isHttpClientError(err)).to.be.equal(true)
        expect(err.response.statusCode).to.be.equal(500)
      })
    })

    it(`should throw an HttpClientError with statusCode 404`, async () => {
      let res = client.post(404)
      expect(res).to.be.rejectedWith(HttpClientError).then(err => {
        expect(HttpClientError.isHttpClientError(err)).to.be.equal(true)
        expect(err.response.statusCode).to.be.equal(404)
      })
    })
  })
}
