
import HttpServer from './HttpServer'

const jsonrpc = '2.0'

const JSONRPC_SERVER_ERROR_NAME = 'JSON_RPC_SERVER_ERROR'

/**
 * @description
 * @export
 * @class JsonRpcError
 * @extends {Error}
 * @param: options - <string> (message) | <object> : {message,code}
 */
export class JsonRpcServerError extends Error {
  constructor (options, ...args) {
    super(...args)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, JsonRpcServerError)
    }
    let message, code
    if (typeof options === 'object') {
      ({ message, code } = options)
    } else {
      message = options
    }
    this.message = message || 'Error'
    if (code) code = parseInt(code)
    this.errorCode = (code && !isNaN(code)) ? code : -32604
    this.name = JSONRPC_SERVER_ERROR_NAME
  }
  getError () {
    let { message, errorCode: code } = this
    return { message, code }
  }
  static isJsonRpcServerError (error = {}) {
    const { name } = error
    return name === JSONRPC_SERVER_ERROR_NAME
  }
}

export const createJsonRpcError = (message, errorCode) => {
  return new JsonRpcServerError({ errorCode, message })
}

export const JsonRpcErrors = {
  PARSE: createJsonRpcError('Parse error', -32700),
  BAD_REQUEST: createJsonRpcError('Invalid Request', -32600),
  METHOD_NOT_FOUND: createJsonRpcError('Method not found', -32601),
  INVALID_PARAMS: createJsonRpcError('Invalid Params', -32602),
  ERROR: createJsonRpcError('Error', -32603)
}

const makeResponse = (data, id) => {
  let payload = { id, jsonrpc }
  if (JsonRpcServerError.isJsonRpcServerError(data)) payload.error = data.getError()
  if (!payload.error) payload.result = data
  return JSON.stringify(payload)
}

export function JsonRpcServer (url) {
  let methods = {}
  let server

  /**
   * @description: add method to JsonRpc Server
   * @param {*} name <string>:  the method name
   * @param {*} cb <function>: (params)=> method_result | JsonRpcError instance
   */
  const addMethod = (name, cb) => {
    if (typeof name !== 'string') throw new Error('Invalid name')
    if (typeof cb !== 'function') throw new Error('The method callback must be a function')
    methods[name] = cb
  }

  // defaults methods
  addMethod('get_OK', () => 'OK')
  addMethod('get_error', () => new JsonRpcServerError('error'))
  addMethod('eth_getFilterChanges', ([id]) => { return { id } })

  const run = async (methodName, params) => {
    let method = methods[methodName]
    let data
    if (!method) data = JsonRpcErrors.METHOD_NOT_FOUND
    else data = await method(params)
    return data
  }

  const requestHandler = (req, res) => {

    const runPayload = async payload => {
      payload = (Array.isArray(payload)) ? payload : [payload]
      let data = payload.map(async p => {
        let { method, params, id } = p
        id = parseInt(id)
        if (isNaN(id) || id < 1) return jsonResponse({ error: JsonRpcErrors.BAD_REQUEST })
        let result = await run(method, params)
        return jsonResponse(result, id)
      })
      return (data.length > 1) ? data : data[0]
    }
    const jsonResponse = (result, id) => {
      let response = makeResponse(result, id)
      res.statusCode = (response) ? 200 : 404
      if (response) {
        res.setHeader('Content-type', 'application/json')
        res.write(response)
      }
      res.end()
    }

    res.on('error', err => {
      console.error(err)
    })

    req.on('error', err => {
      console.error(err)
      if (res.statusCode < 400) res.statusCode = 400
      res.write(err.message)
      res.end()
    })

    let { method, headers } = req
    if (method !== 'POST') {
      res.statusCode = 405
      req.emit('error', new Error(`Unsupported method: ${method}`))
    }

    if (headers['content-type'] !== 'application/json') {
      req.emit('error', new Error(`Unsupported content type: ${headers['content-type']}`))
    }

    let body = ''

    req.on('data', data => {
      body += data
    })

    req.on('end', () => {
      try {
        const payload = JSON.parse(body)
        return runPayload(payload)
      } catch (err) {
        res.statusCode = 400
        res.end()
        console.error(err)
      }
    })
  }

  const close = () => server.close()
  const create = (url) => {
    try {
      url = HttpServer.parseUrl(url)
      const { port } = url
      server = HttpServer.create(url, requestHandler)

      server.on('error', err => {
        console.error(err)
        server.close()
      })

      if (port) server.listen(port)

      return server
    } catch (err) {
      throw err
    }
  }
  if (url) server = create(url)
  return Object.freeze({ create, addMethod, server, methods, close })
}

export default JsonRpcServer
