import URL from 'url'
import http from 'http'
import https from 'https'

const HTTP_CLIENT_ERROR_NAME = 'HTTP_CLIENT_ERROR'

export class HttpClientError extends Error {
  constructor ({ response, message }, ...args) {
    super(...args)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpClientError)
    }
    this.response = response
    this.message = message
  }
  getName () {
    return HTTP_CLIENT_ERROR_NAME
  }
  static isHttpClientError (error = {}) {
    const { getName } = error
    const name = (typeof getName === 'function') ? getName() : undefined
    return name === HTTP_CLIENT_ERROR_NAME
  }
}

export class HttpClient {
  constructor (url, { keepAlive } = {}) {
    keepAlive = !!(keepAlive !== false)
    this.url = this.parseUrl(url)
    this.client = Client(url)
    this.agent = new this.client.Agent({ keepAlive })
  }
  async request ({ url, method, payload, headers }) {
    try {
      url = url || this.url
      url = this.parseUrl(url)
      let { port, hostname: host, path, query } = url
      path = path || '/'
      method = method || 'POST'
      headers = headers || {}
      payload = (payload && typeof payload !== 'string') ? JSON.stringify(payload) : payload

      headers['Content-Length'] = Buffer.byteLength(payload)
      const { client, agent } = this
      const options = { host, port, headers, method, agent, path, query }
      return new Promise((resolve, reject) => {
        const req = makeRequest(client, options, (error, data, response) => {
          if (error) reject(error)
          try {
            const { statusCode, statusMessage } = response

            data = (data && typeof data !== 'object') ? JSON.parse(`${data}`) : data
            response.data = data
            if (statusCode >= 400) throw new HttpClientError({ response, message: statusMessage })
            resolve({ data, response })
          } catch (err) {
            reject(err)
          }
        })
        if (payload) req.write(payload)
        req.end()
      })
    } catch (err) {
      return Promise.reject(err)
    }
  }

  get (getUrl, { headers } = {}) {
    let url = Object.assign({}, this.url || {})
    if (getUrl) url = Object.assign(url, this.parseUrl(getUrl))
    return this.request({ url, headers, method: 'GET' })
  }
  post (payload, { url, headers } = {}) {
    headers = headers || { 'Content-type': 'application/json' }
    return this.request({ payload, headers, url, method: 'POST' })
  }

  parseUrl (url) {
    if (!url) throw new Error('Invalid url')
    if (typeof url === 'string') url = URL.parse(url)
    return url
  }
}

function Client (url) {
  let proto = (typeof url === 'object') ? url.proto : url
  const isSsl = proto.substring(0, 5) === 'https'
  return isSsl ? https : http
}

function makeRequest (client, options, cb) {
  return client.request(options, (res) => {
    let chunk = []
    res.on('data', data => {
      chunk.push(Buffer.from(data))
    })

    res.on('end', data => {
      try {
        if (data) chunk.push(Buffer.from(data))
        let content = Buffer.concat(chunk).toString('utf-8')
        cb(null, content, res)
      } catch (err) {
        cb(err)
      }
    })
  })
}
