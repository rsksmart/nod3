import axios from 'axios'
import { Provider } from './Provider'

export class HttpProvider extends Provider {
  constructor (options = {}) {
    super(options.url)
  }
  async send (payload) {
    try {
      let url = this.url
      let headers = { 'Content-Type': 'application/json' }
      const res = await axios.post(url, payload, { headers })
      return res.data
    } catch (err) {
      return Promise.reject(err)
    }
  }
}
