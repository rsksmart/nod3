import axios from 'axios'
import { Provider } from './Provider'
import { jsonRpcPayload } from './JsonRpc'

export class HttpProvider extends Provider {
  constructor (options = {}) {
    super(options.url)
  }
  send (payload) {
    let url = this.url
    let headers = { 'Content-Type': 'application/json' }
    return axios.post(url, payload, { headers }).then(res => res.data)
  }
  isConnected () {
    return this.send(jsonRpcPayload('net_listening'))
  }
}

