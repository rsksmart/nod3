import axios from 'axios'
import { Provider } from './Provider'

export class HttpProvider extends Provider {
  constructor (url, options = {}) {
    super(url, options)
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
      let url = this.url
      let headers = { 'Content-Type': 'application/json' }
      const res = await axios.post(url, payload, { headers })
        .catch(err => {
          // wrap rskj & axios errors
          err = (err.response && err.response.data) ? err.response.data.error : err
          return Promise.reject(err.message)
        })
      return res.data
    } catch (err) {
      return Promise.reject(err)
    }
  }
}
