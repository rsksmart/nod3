import { CurlProvider } from '../../src/classes/CurlProvider'
import { nod3Creator } from '../shared'
import childProcess from 'child_process'
import { assert } from 'chai'

const nod3 = nod3Creator(null, { skipFormatters: true })
const nod3Curl = nod3Creator(CurlProvider)
const exec = childProcess.execSync
const test = [
  ['eth', 'getBlock', [20]],
  ['net', 'version', []]
]
describe(`# Curl provider`, function () {
  this.timeout(9000)
  for (let t of test) {
    let [module, action, params] = t
    it('should return the same result', async () => {
      const expected = await nod3[module][action](params)
      const curl = await nod3Curl[module][action](params)
      const result = await execCurl(curl)
      assert.deepEqual(expected, result)
    })
  }
})

function execCurl (cmd) {
  try {
    if (cmd.substring(0, 4) !== 'curl') throw new Error('Invalid curl command')
    let res = exec(`${cmd}`)
    res = JSON.parse(res)
    if (res.error) throw new Error(res.error)
    return res.result
  } catch (err) {
    console.log(err)
    return Promise.reject(err)
  }
}