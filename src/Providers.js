import axios from 'axios'
import { jsonRpcPayload } from './JsonRpc'

export class Provider {
  constructor (url) {
    this.url = url || 'http://localhost:4444'
  }
  isConnected () {
    throw new Error(`isConnected is not implemented`)
  }
}

export class HttpProvider extends Provider {
  constructor (options = {}) {
    super(options.url)
  }
  send (payload) {
    let url = this.url
    let headers = { 'Content-Type': 'application/json' }
    return axios.post(url, payload, { headers })
  }
  isConnected () {
    return this.send(jsonRpcPayload('net_listening'))
  }
}
