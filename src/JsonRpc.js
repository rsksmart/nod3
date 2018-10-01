export class JsonRpc {
  constructor (provider) {
    this.id = 0
    this.provider = provider
  }

  async send (method, params) {
    try {
      let payload = this.toPayload(method, params)
      let res = await this.provider.send(payload)
      let data = res.data
      if (!data) throw new Error('No data')
      if (data.error) throw new Error(data.error)
      return (this.isValidResponse(data)) ? data.result : null
    } catch (err) {
      return Promise.reject(err)
    }
  }
  toPayload (method, params) {
    let id = this.getId()
    return jsonRpcPayload(method, params, id)
  }

  getId () {
    this.id++
    return this.id
  }

  isValidResponse (res) {
    return Array.isArray(res) ? res.every(validate) : validate(res)
    function validate (message) {
      return !!message &&
        !message.error &&
        message.jsonrpc === '2.0' &&
        typeof message.id === 'number' &&
        message.result !== undefined
    }
  }

  isConnected () {
    return this.provider.isConnected()
  }
}

export const jsonRpcPayload = (method, params = [], id = 666) => {
  params = Array.isArray(params) ? params : [params]
  return {
    jsonrpc: '2.0',
    method,
    params,
    id
  }
}

export default JsonRpc
