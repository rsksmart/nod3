import { Provider } from './Provider'
import { HttpClient } from '../classes/HttpClient'

export class HttpProvider extends Provider {
  constructor (url, options = {}) {
    super(url, options)
    this.client = new HttpClient(url, { keepAlive: true })
  }

  async isConnected () {
    try {
      let connected = await this.rpc.sendMethod('net_listening')
      return connected === true
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async send (payload) {
    try {
      let headers = { 'Content-Type': 'application/json' }
      const res = await this.client.post(payload, { headers })
        .catch(err => {
          // wrap rskj errors
          err = (err.response && err.response.data) ? err.response.data.error : err
          return Promise.reject(err.message || `${err}`)
        })
      return res.data
    } catch (err) {
      return Promise.reject(err)
    }
  }
}

export default HttpProvider
