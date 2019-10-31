import http from 'http'
import https from 'https'
import fs from 'fs'
import path from 'path'
import URL from 'url'

const createHttp = (requestHandler) => {
  return http.createServer(requestHandler)
}

const createHttps = (requestHandler) => {
  const options = {
    key: fs.readFileSync(path.resolve(__dirname, 'private.key')),
    cert: fs.readFileSync(path.resolve(__dirname, 'private.crt'))
  }
  return https.createServer(options, requestHandler)
}

const parseUrl = url => {
  if (!url) throw new Error('Invalid url')
  url = (typeof url === 'string') ? URL.parse(url) : url
  return url
}

const create = (url, requestHandler) => {
  try {
    url = parseUrl(url)
    if (typeof requestHandler !== 'function') throw new Error('Invalid requestHandler')
    const protocol = url.protocol.replace(':', '')
    if (!protocol) throw new Error('Missing url protocol')
    const server = (protocol === 'https') ? createHttps(requestHandler) : createHttp(requestHandler)
    return server
  } catch (err) {
    throw err
  }
}

export default Object.freeze({ create, parseUrl })
